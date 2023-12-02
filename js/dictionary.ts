
export interface Entry {
  simplified: string;
  pinyin: string[];
  searchablePinyin?: string;
}

interface Trie {
  [key: string]: Trie;
}

export class Dictionary {
  entries: Entry[];
  trie: Trie;

  constructor(entries: Entry[]) {
    this.entries = entries;
    this.trie = this.buildTrie();

    // TODO: Build trie for word splitting
  }

  private buildTrie(): Trie {
    const trie: Trie = {};
    this.entries.forEach(entry => {
        let triePointer = trie;
        entry.simplified.split("").forEach(character => {
					if (!isChineseChar(character)) {
						return;
					} else if (!triePointer.hasOwnProperty(character)) {
            triePointer[character] = {};
          }
          triePointer = triePointer[character];
        });
    });
    return trie;
  }

  // Splits an input string into a list of strings, matching if possible.
  segmentText(input: string): string[] {
    const segments = [];

    // For each character, follow the trie until the end, then generate word.
    let finalWords: string[] = [];
    let curWord = "";
    let triePointer: Trie | null = null;

    input.split("").forEach((character) => {
      if (curWord.length === 0) {
        curWord = character;
        if (this.trie.hasOwnProperty(character)) {
          triePointer = this.trie[character];
        }
      } else if (triePointer) {
        // Current word ends.
        if (!triePointer.hasOwnProperty(character)) {
          finalWords.push(curWord);
          curWord = character;
          if (this.trie.hasOwnProperty(character)) {
            triePointer = this.trie[character];
          } else {
            triePointer = null;
          }
        // Going from known word => known word.
        } else {
          curWord += character;
          triePointer = triePointer[character];
        }
      } else {
        // Going from unknown word => known word.
        if (this.trie.hasOwnProperty(character)) {
          finalWords.push(curWord);
          curWord = character;
          triePointer = this.trie[character];
        // Going from unknown word => unknown word.
        } else {
          curWord += character;
        }
      }
    });

    if (curWord.length > 0) {
      finalWords.push(curWord);
    }
    return finalWords;
  }

  searchWord() {
  }
}


export function processRawTextToDict(rawText: string): Entry[] {
  return rawText.split(/\r?\n/).map((row, i) => {
    let [simplified, pinyin, definition, percentile] = row.split("∙");
    let pinyinParts: string[] = [];
    if (pinyin) {
      pinyinParts = pinyin.split("_");
    } else {
      // console.log("No pinyin for row:", row, i);
    }
    if (!definition) {
      // console.log("No def for row:", row, i);
      definition = "";
    }
    const searchablePinyin = pinyinParts.join("").normalize("NFD").replace(
      /[\u0300-\u036f]/g,
      "",
    ).toLowerCase();
    const entry: Entry = {
      simplified: simplified,
      pinyin: pinyinParts,
      searchablePinyin: searchablePinyin,
      //definition: definition.split("■").join("\n"),
      //percentile: Number(percentile),
    };
    return entry;
  });
}

export function isChineseChar(character: string): boolean {
	return /^[\u3400-\u4dbf|\u4e00-\u9fef]+$/.test(character);
}
