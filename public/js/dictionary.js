var Dictionary = /** @class */ (function () {
    function Dictionary(entries) {
        this.entries = entries;
        this.trie = this.buildTrie();
        // TODO: Build trie for word splitting
    }
    Dictionary.prototype.buildTrie = function () {
        var trie = {};
        this.entries.forEach(function (entry) {
            var triePointer = trie;
            entry.simplified.split("").forEach(function (character) {
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
    };
    // Splits an input string into a list of strings, matching if possible.
    Dictionary.prototype.segmentText = function (input) {
        var _this = this;
        var segments = [];
        // For each character, follow the trie until the end, then generate word.
        var finalWords = [];
        var curWord = "";
        var triePointer = null;
        input.split("").forEach(function (character) {
            if (curWord.length === 0) {
                curWord = character;
                if (_this.trie.hasOwnProperty(character)) {
                    triePointer = _this.trie[character];
                }
            }
            else if (triePointer) {
                // Current word ends.
                if (!triePointer.hasOwnProperty(character)) {
                    finalWords.push(curWord);
                    curWord = character;
                    if (_this.trie.hasOwnProperty(character)) {
                        triePointer = _this.trie[character];
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
                if (_this.trie.hasOwnProperty(character)) {
                    finalWords.push(curWord);
                    curWord = character;
                    triePointer = _this.trie[character];
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
    };
    Dictionary.prototype.searchWord = function () {
    };
    return Dictionary;
}());
export { Dictionary };
export function processRawTextToDict(rawText) {
    return rawText.split(/\r?\n/).map(function (row, i) {
        var _a = row.split("∙"), simplified = _a[0], pinyin = _a[1], definition = _a[2], percentile = _a[3];
        var pinyinParts = [];
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
        var searchablePinyin = pinyinParts.join("").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        var entry = {
            simplified: simplified,
            pinyin: pinyinParts,
            searchablePinyin: searchablePinyin,
            //definition: definition.split("■").join("\n"),
            //percentile: Number(percentile),
        };
        return entry;
    });
}
export function isChineseChar(character) {
    return /^[\u3400-\u4dbf|\u4e00-\u9fef]+$/.test(character);
}
