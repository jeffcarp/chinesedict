

// TODO: get this from proto now.
export interface Entry {
  traditional: string;
  simplified: string;
  pinyin: string;
  searchablePinyin?: string;
  percentile?: number;
}

interface Trie {
  [key: string]: Trie;
}

export class Dictionary {
  entries: Entry[];
  trie: Trie;

  constructor(entries: Entry[]) {
    this.entries = entries;
    this.postProcessEntries();
    this.trie = this.buildTrie();
  }

  private postProcessEntries() {
    this.entries.forEach(entry => {
      // TODO: Move this into better search data structure.
      //
      let pinyinParts: string[] = [];
      if (entry.pinyin.length > 0) {
        pinyinParts = entry.pinyin.split(" ");
      }
      entry.searchablePinyin = pinyinParts.join("").normalize("NFD").replace(
        /[\u0300-\u036f]/g,
        "",
      ).toLowerCase();
    });
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

  // Returns one word or null.
  lookupWord(word: string): Entry | null {

    // TODO: PRE BUILD INDEX!
    for (const entry of this.entries) {
      if (entry.simplified === word) {
        return entry
      }
    }

    return null
  }

  scoreText(text: string): number {
    const segments = this.segmentText(text);
    const scores = [];
    for (const seg of segments) {
      let entry = this.lookupWord(seg);
      if (entry && entry.percentile) {
        scores.push(entry.percentile)
      }
    }

    if (scores.length === 0) {
      return 0;
    }

    const sum = scores.reduce((accumulator, currentValue) => (
      accumulator + currentValue
    ), 0)
    return sum / scores.length;
  }
}

export function isChineseChar(character: string): boolean {
	return /^[\u3400-\u4dbf|\u4e00-\u9fef]+$/.test(character);
}
