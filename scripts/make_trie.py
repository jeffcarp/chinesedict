import csv
import functools
import sys
import unicodedata

# Assuming this is run from project root.
CEDICT_PARSED_PATH = './data/cedict_parsed.csv'
DEBUG = True
TRIE = {}
STOP_CHAR = None


def add_word(word):
  trie_pointer = TRIE

  for char in word:
    if char not in trie_pointer:
      trie_pointer[char] = {}

    trie_pointer = trie_pointer[char]

  # Add stop char.
  trie_pointer[char] = STOP_CHAR


def main():
  with open(CEDICT_PARSED_PATH, 'r+') as f:
    csvreader = csv.reader(f, delimiter='∙', dialect='unix', quoting=csv.QUOTE_MINIMAL)
    if DEBUG:
      csvreader = list(csvreader)[20:40]
    for simplified, pinyin, _, _ in csvreader:
      print(simplified, pinyin)
      add_word(simplified)
      pinyin = unicodedata.normalize('NFKD', pinyin).encode('ASCII', 'ignore').decode()
      print(pinyin)
      add_word(pinyin)

  print('FINAL TRIE:')
  print(TRIE)
  print('SIZE:', sys.getsizeof(TRIE))

if __name__ == '__main__':
  main()
