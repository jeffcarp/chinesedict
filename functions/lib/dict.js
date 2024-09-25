"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChineseChar = exports.Dict = void 0;
class Dict {
    constructor(entries) {
        this.entries = entries;
        console.log('ENTRIES!!!!', this.entries.length);
        //this.trie = {};
        this.trie = this.buildTrie();
    }
    // TODO: Generate and pre-cache this beforehand.
    buildTrie() {
        const trie = {};
        this.entries.forEach(entry => {
            let triePointer = trie;
            entry.simplified.split("").forEach(character => {
                if (!isChineseChar(character)) {
                    return;
                }
                else if (!triePointer.hasOwnProperty(character)) {
                    triePointer[character] = {};
                }
                triePointer = triePointer[character];
            });
        });
        return trie;
    }
    randomEntry() {
        const index = Math.floor(Math.random() * this.entries.length);
        return this.entries[index];
    }
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
    findTag(input) {
        // TODO do this in a not extremely stupid way
        let entries = [];
        for (const entry of this.entries) {
            if (!entry.tags) {
                continue;
            }
            else if (entry.tags.includes(input)) {
                entries.push(entry);
            }
        }
        return entries;
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
exports.Dict = Dict;
function isChineseChar(character) {
    return /^[\u3400-\u4dbf|\u4e00-\u9fef]+$/.test(character);
}
exports.isChineseChar = isChineseChar;
//# sourceMappingURL=dict.js.map