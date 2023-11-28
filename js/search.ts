// TODO: Generate correct trie with words
interface Trie {
  [key: string]: string[];
}

export interface Entry {
  pinyin: string[];
  searchablePinyin?: string;
}

export interface Dictionary {
  entries: Entry[],
}

const TRIE: Trie = {
  "你": ["好"],
  "好": [],
  "欢": ["迎"],
  "迎": [],
  "迟": ["到"],
  "到": [],
};

export async function loadDictionaryFromDisk(): Promise<Dictionary> {
  const decoder = new TextDecoder("utf-8");
  const fileContents = Deno.readFileSync("./public/cedict_parsed.csv.gz");

  const data = new Blob([fileContents]);
  const dataStream = data.stream();

  const decompStream = dataStream.pipeThrough(
    new DecompressionStream("gzip"),
  );
  const decompResp = await new Response(decompStream);
  const blob = await decompResp.blob();
  const text = await blob.text();

  return processRawTextToDict(text)
}

function processRawTextToDict(rawText: string): Dictionary {
  const entries = rawText.split(/\r?\n/).map((row, i) => {
    let [simplified, pinyin, definition, percentile] = row.split("∙");
    let pinyinParts: string[] = [];
    if (pinyin) {
      pinyinParts = pinyin.split("_");
    } else {
      console.log("No pinyin for row:", row, i);
    }
    if (!definition) {
      console.log("No def for row:", row, i);
      definition = "";
    }
    const searchablePinyin = pinyinParts.join("").normalize("NFD").replace(
      /[\u0300-\u036f]/g,
      "",
    ).toLowerCase();
    const entry: Entry = {
      //simplified: simplified,
      pinyin: pinyinParts,
      searchablePinyin: searchablePinyin,
      //definition: definition.split("■").join("\n"),
      //percentile: Number(percentile),
    };
    return entry;
  });
  return {
    entries: entries,
  };
}

// Returns a list of the biggest words found in the input string.
export function splitWords(input: string): string[] {
  // For each character, follow the trie until the end, then generate word.
  let finalWords: string[] = [];
  let curWord = "";
  input.split("").forEach((character) => {
    if (curWord.length === 0) {
      curWord += character;
    } else {
      const lastChar = curWord.charAt(curWord.length - 1);
      if (!(lastChar in TRIE)) {
        return;
      } else if (TRIE[lastChar].includes(character)) {
        curWord += character;
      } else {
        finalWords.push(curWord);
        curWord = character;
      }
    }
  });

  if (curWord) {
    finalWords.push(curWord);
  }

  return finalWords;
}

export function entriesForKeyword(
  keyword: string,
  dictionary: Dictionary,
  limit: number = 10,
): Entry[] {
  const finalQuery = keyword.trim().toLowerCase();

  return dictionary.entries.filter((entry) => {
      return entry.searchablePinyin === finalQuery;
  }).slice(0, limit);
}
