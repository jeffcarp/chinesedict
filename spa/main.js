const { createApp, ref, computed } = Vue
import { Dictionary } from "/dictionary.js";


const QUERY_LIMIT = 25;
let legacyDictionary = [];
const DICT_FILEPATH = "/cedict_parsed.csv.gz";
const definitionCache = {};
let dict;
let curSegment = 0;


const articles = [
		{
			title: 'yo1',
			text: '《易经》，中国古典文献之一，是古代中国巫师用于推演未来吉凶祸福的卜筮书，自汉代开始尊奉为“五经”之一；《易经》用一套符号形式系统描述事物的变化，表现了中国古典文化的哲学和宇宙观。它的中心思想，是用阴阳符号构成的卦象代表世间万物的运行状态。',
      difficulty: 45,
		},
    {
      title: 'slow chinese',
      text: '今天，跟大家介绍一款在中国非常流行的修图软件——美图秀秀。 根据极光大数据的报道：在中国，截止至2017年11月，市面上拍照修图的APP超过3400个。每100个移动网民中就有超过47人是该类APP的用户。美图秀秀是这类产品中的绝对领导者。 目前，美图秀秀有网页、电脑软件，和手机APP三个版本供用户选择。主要功能也有三个：美化图片、人像美容和拼图。无论是哪个版本，操作都十分简单。当然，随着智能手机的流行，用户最多的还是手机APP这个版本。 美图秀秀自2008年面世以来，用户总人数增长迅速，近几年渐渐走出国门。同时，在传入海外的过程中，美图秀秀也引发了一些争议。例如，人像美容这个功能里的“一键美颜”可以把照片上人像的皮肤变得更白、更细腻。一些海外的黑人用户在使用了这个功能之后，发现自己变白了，认为这是一种“种族歧视”。尽管如此，还是有不少外国网友被美图秀秀的一些功能所吸引，成为了美图秀秀的忠实用户。 你的手机上有修图软件吗？最常用的是哪个？如果你还没用过美图秀秀的话，可以下载了体验一下。',
      difficulty: 68,
    }
]

createApp({
	setup() {
		const message = ref('Hello vue!')
		const curArticle = ref(null)
		const curSidebarWord = ref(null)
		const query = ref('')

    const curArticleWords = computed(() => {
      if (!dict || !curArticle.value) {
        return []
      } else {
        return dict.segmentText(curArticle.value.text)
      }
    })

    const curDefinition = computed(() => {
      if (!curSidebarWord.value) {
        return null
      } else {
        return searchDict(curSidebarWord.value)
      }
    })

		return {
			curArticle,
      curArticleWords,
			message,
			query,
			articles,
      curSidebarWord,
      curDefinition,
		}
	}
}).mount('#app')

async function main() {
  legacyDictionary = await fetchDictionary();
  dict = new Dictionary(legacyDictionary);
	console.log(`Loaded dict with ${dict.entries.length} entries.`)
}

async function fetchDictionary() {
  const response = await fetch(DICT_FILEPATH);
  const decompStream = response.body.pipeThrough(
    new DecompressionStream("gzip"),
  );
  const decompResp = await new Response(decompStream);
  const blob = await decompResp.blob();
  const text = await blob.text();

  const data = text.split(/\r?\n/).map((row, i) => {
    let [simplified, pinyin, definition, percentile] = row.split("∙");
    if (pinyin) {
      pinyin = pinyin.split("_");
    } else {
      // TODO: This should be done in preprocessing.
      // console.log("No pinyin for row:", row, i);
      pinyin = [];
    }
    if (!definition) {
      // console.log("No def for row:", row, i);
      definition = "";
    }
    const searchablePinyin = pinyin.join("").normalize("NFD").replace(
      /[\u0300-\u036f]/g,
      "",
    ).toLowerCase();
    return {
      simplified: simplified,
      pinyin: pinyin,
      searchablePinyin: searchablePinyin,
      definition: definition.split("■").join("\n"),
      percentile: Number(percentile),
    };
  });
  return data;
}

function searchDict(query) {
  const finalQuery = query.trim().toLowerCase();

  const results = legacyDictionary.filter((entry) => {
    if (
      entry.simplified && entry.simplified.toLowerCase().includes(finalQuery)
    ) {
      return true;
    } else if (entry.searchablePinyin.includes(finalQuery)) {
      return true;
    } else if (
      entry.definition && entry.definition.toLowerCase().includes(finalQuery)
    ) {
      return true;
    }
  });

  function defExactMatch(queryString, entry) {
    // checks if the split lower case defintions are in the cache and adds them if not
    if (entry.simplified in definitionCache === false) {
      definitionCache[entry.simplified] = entry.definition.toLowerCase().split(
        "\n",
      );
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

function search() {
  const query = document.querySelector("input#query").value;

  // Segment before querying; use the first segment initially.
  const segments = updateSegments(query);
  if (segments.length == 0) {
    return;
  }
  if (curSegment >= segments.length) {
    curSegment = 0;
  }
  const keyword = segments[curSegment];

  const results = searchDict(keyword);
  document.querySelector("#results").innerHTML = "";
  const resultTemplate = document.querySelector("#search-result-li");
  results.forEach((result) => {
    const node = resultTemplate.content.cloneNode(true);
    //node.querySelector('.simplified').innerText = result.simplified
    //node.querySelector('.pinyin').innerText = result.pinyin.join(' ')
    let commonClass = "common";
    if (result.percentile == 0) {
      commonClass = "uncommon";
    }

    const rubyEl = document.createElement("ruby");
    result.simplified.split("").forEach((character, i) => {
      const charEl = document.createElement("span");
      charEl.innerText = character;
      rubyEl.appendChild(charEl);

      const rtEl = document.createElement("rt");
      rtEl.innerText = result.pinyin[i];
      rubyEl.appendChild(rtEl);
    });
    node.querySelector(".characters").appendChild(rubyEl);
    node.querySelector(".characters").classList.add(commonClass);

    node.querySelector(".definitions").innerText = result.definition;
    let percentileText = "(uncommon)";
    if (result.percentile > 0) {
      percentileText = "p" + result.percentile;
    }
    node.querySelector(".percentile").innerText = percentileText;

    document.querySelector("#results").appendChild(node);
  });
}

function updateSegments(query) {
  if (!dict) {
    return;
  }

  const segments = dict.segmentText(query);

  window.segments.innerHTML = "";

  if (segments.length <= 1) {
    return segments;
  }

  const wordTemplate = document.querySelector("#word-segment");
  segments.forEach((segment, index) => {
    const node = wordTemplate.content.cloneNode(true);
    node.querySelector('.segment').innerText = segment;
    window.segments.appendChild(node);

    const realNode = window.segments.children[index];
    if (index === curSegment) {
      realNode.style.borderBottom = 'solid 2px #E84A5F';
    }

    const makeChangeSegmentCallback = (index) => {
      return () => {
        curSegment = index;
        search();
      };
    };
    realNode.addEventListener('click', makeChangeSegmentCallback(index));
  })

  return segments;
}

main();
