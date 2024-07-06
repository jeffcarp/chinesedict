"use strict";
// COPIED FROM js/
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChineseChar = exports.processRawTextToDict = exports.Dictionary = void 0;
class Dictionary {
    constructor(entries) {
        this.entries = entries;
        // this.trie = this.buildTrie();
        this.trie = {};
        // TODO: Build trie for word splitting
    }
    /*
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
    */
    findWord(input) {
        // TODO do this in a not extremely stupid way
        let foundEntry = null;
        for (const entry of this.entries) {
            if (entry.simplified === input) {
                foundEntry = entry;
                break;
            }
        }
        return foundEntry;
    }
    // Splits an input string into a list of strings, matching if possible.
    segmentText(input) {
        // const segments = [];
        // For each character, follow the trie until the end, then generate word.
        let finalWords = [];
        let curWord = "";
        let triePointer = null;
        input.split("").forEach((character) => {
            if (curWord.length === 0) {
                curWord = character;
                if (this.trie.hasOwnProperty(character)) {
                    triePointer = this.trie[character];
                }
            }
            else if (triePointer) {
                // Current word ends.
                if (!triePointer.hasOwnProperty(character)) {
                    finalWords.push(curWord);
                    curWord = character;
                    if (this.trie.hasOwnProperty(character)) {
                        triePointer = this.trie[character];
                    }
                    else {
                        triePointer = null;
                    }
                    // Going from known word => known word.
                }
                else {
                    curWord += character;
                    triePointer = triePointer[character];
                }
            }
            else {
                // Going from unknown word => known word.
                if (this.trie.hasOwnProperty(character)) {
                    finalWords.push(curWord);
                    curWord = character;
                    triePointer = this.trie[character];
                    // Going from unknown word => unknown word.
                }
                else {
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
exports.Dictionary = Dictionary;
function processRawTextToDict(rawText) {
    return rawText.split(/\r?\n/).map((row, i) => {
        let [simplified, pinyin, definition, _] = row.split("∙");
        let pinyinParts = [];
        if (pinyin) {
            pinyinParts = pinyin.split("_");
        }
        else {
            // console.log("No pinyin for row:", row, i);
        }
        if (!definition) {
            // console.log("No def for row:", row, i);
            definition = "";
        }
        const searchablePinyin = pinyinParts.join("").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const entry = {
            simplified: simplified,
            pinyin: pinyinParts,
            searchablePinyin: searchablePinyin,
            //definition: definition.split("■").join("\n"),
            //percentile: Number(percentile),
        };
        return entry;
    });
}
exports.processRawTextToDict = processRawTextToDict;
function isChineseChar(character) {
    return /^[\u3400-\u4dbf|\u4e00-\u9fef]+$/.test(character);
}
exports.isChineseChar = isChineseChar;
//# sourceMappingURL=dictionary.js.map