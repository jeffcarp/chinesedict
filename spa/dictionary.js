var Dictionary = /** @class */ (function () {
    function Dictionary(entries) {
        this.entries = entries;
        this.postProcessEntries();
        this.trie = this.buildTrie();
    }
    Dictionary.prototype.postProcessEntries = function () {
        this.entries.forEach(function (entry) {
            // TODO: Move this into better search data structure.
            //
            var pinyinParts = [];
            if (entry.pinyin.length > 0) {
                pinyinParts = entry.pinyin.split(" ");
            }
            entry.searchablePinyin = pinyinParts.join("").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        });
    };
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
    // Returns one word or null.
    Dictionary.prototype.lookupWord = function (word) {
        // TODO: PRE BUILD INDEX!
        for (var _i = 0, _a = this.entries; _i < _a.length; _i++) {
            var entry = _a[_i];
            if (entry.simplified === word) {
                return entry;
            }
        }
        return null;
    };
    Dictionary.prototype.scoreText = function (text) {
        var segments = this.segmentText(text);
        var scores = [];
        for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
            var seg = segments_1[_i];
            var entry = this.lookupWord(seg);
            if (entry && entry.percentile) {
                scores.push(entry.percentile);
            }
        }
        if (scores.length === 0) {
            return 0;
        }
        var sum = scores.reduce(function (accumulator, currentValue) { return (accumulator + currentValue); }, 0);
        return sum / scores.length;
    };
    return Dictionary;
}());
export { Dictionary };
export function isChineseChar(character) {
    return /^[\u3400-\u4dbf|\u4e00-\u9fef]+$/.test(character);
}
