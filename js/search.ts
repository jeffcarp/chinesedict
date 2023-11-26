// TODO: Generate correct trie with words
export function getDictionary() {
}

interface Trie {
  [key: string]: string[];
}

const TRIE: Trie = {
  "你": ["好"],
  "好": [],
  "欢": ["迎"],
  "迎": [],
  "迟": ["到"],
  "到": [],
};

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
