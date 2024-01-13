const { createApp, ref, computed } = Vue
import { Dictionary } from "/dictionary.js";


const QUERY_LIMIT = 25;
const DICT_FILEPATH = "/dictionary.json";
const definitionCache = {};
let globalDict;
let articles;



const app = createApp({
	setup() {
		const curArticle = ref(null)
		const selectedIndex = ref(null)
		const query = ref('')

    const curArticleWords = computed(() => {
      if (!globalDict || !curArticle.value) {
        return []
      } else {
        return globalDict.segmentText(curArticle.value.text)
      }
    })

    const curArticleDifficulty = computed(() => {
      return globalDict.scoreText(curArticle.value.text)
    })

    const selectedWord = computed(() => {
      if (selectedIndex.value === null) {
        return null
      } else if (curArticle.value === null) {
        return null
      } else {
        return curArticleWords.value.at(selectedIndex.value)
      }
    })

    const curDefinition = computed(() => {
      if (selectedIndex.value === null) {
        return null
      } else if (curArticle.value === null) {
        return null
      } else {
        // TODO return multiple but only exact matches
        const entry = globalDict.lookupWord(selectedWord.value);
        if (entry) {
          return [entry]
        } else {
          return []
        }
      }
    })

    const searchResults = computed(() => {
      // TODO: Impelement word segmentation of results and a word picker
      if (query.value.length === 0) {
        return null
      }

      return searchDict(query.value)
    })

    function querySubmit() {
        curArticle.value = {
          title: 'custom article',
          text: query.value,
        }
    }

    document.addEventListener("keydown", (event) => {
      if (!(event.isComposing || event.keyCode === 37 || event.keyCode === 39)) {
        return;
      } else if (curArticle.value === null) {
        return;
      } else if (selectedWord.value === null) {
        return;
      }

      if (event.keyCode === 37 && selectedIndex.value > 0) {
        selectedIndex.value -= 1;
      } else if (event.keyCode === 39 && selectedIndex.value < curArticleWords.value.length - 1) {
        selectedIndex.value += 1;
      }
    });

    return {
      querySubmit,
      curArticle,
      curArticleWords,
      curArticleDifficulty,
      query,
      searchResults,
      articles,
      selectedIndex,
      selectedWord,
      curDefinition,
		}
	}
});


async function main() {
  const dictProto = await fetchDictionary();
  globalDict = new Dictionary(dictProto.entries);

  articles = await fetchArticles();

  console.log(`Loaded dict with ${globalDict.entries.length} entries.`)
  console.log(globalDict.entries[1000])

  app.mount('#app');
}

async function fetchArticles() {
  const response = await fetch('/articles.json');
  return await response.json();
}

async function fetchDictionary() {
  const response = await fetch(DICT_FILEPATH);
  return await response.json();
}

// TODO: Replace this with something in Dictionary itself.
function searchDict(query) {
  const finalQuery = query.trim().toLowerCase();

  const results = globalDict.entries.filter((entry) => {
    if (
      entry.simplified && entry.simplified.toLowerCase().includes(finalQuery)
    ) {
      return true;
    } else if (entry.searchablePinyin.includes(finalQuery)) {
      return true;
    } else if (
      entry.definitions && entry.definitions.join('/').toLowerCase().includes(finalQuery)
    ) {
      return true;
    }
  });

  function defExactMatch(queryString, entry) {
    // checks if the split lower case defintions are in the cache and adds them if not
    // TODO simplified is not unique - this will skip some entries.
    if (!(entry.simplified in definitionCache)) {
      definitionCache[entry.simplified] = entry.definitions.map(d => d.toLowerCase())
    }

    // loops through the definitions in cache and returns true if there is an exact match
    for (const definition of definitionCache[entry.simplified]) {
      if (definition === queryString) {
        return true;
      }
    }
    return false;
  }

  function defPartialMatch(queryString, entry) {
    // checks definitions to see if it includes string. All entries should be in cache
    // by this point and do not need to be checked
    return definitionCache[entry.simplified].includes(queryString);
  }

  results.sort((a, b) => {
    // prioritizes exact matches
    const aExact = a.searchablePinyin === finalQuery ||
      defExactMatch(finalQuery, a);
    const bExact = b.searchablePinyin === finalQuery ||
      defExactMatch(finalQuery, b);
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    // If both are exact matches, prioritizes matches that contain the query string
    const queryInA = a.searchablePinyin.includes(finalQuery) ||
      defPartialMatch(finalQuery, a);
    const queryInB = b.searchablePinyin.includes(finalQuery) ||
      defPartialMatch(finalQuery, b);
    if (queryInA && !queryInB) return -1;
    else if (queryInB && !queryInA) return 1;

    // otherwise, prioritize most used by percentile
    return b.percentile - a.percentile;
  });

  return results.slice(0, QUERY_LIMIT);
}

main();
