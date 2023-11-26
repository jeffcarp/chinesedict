import csv
import functools
import sys

# Assuming this is run from project root.
CEDICT_PARSED_PATH = './data/cedict_parsed.csv'
DEBUG = False
TRIE = {}


def add_word(word):
  trie_pointer = TRIE

  for char in word:
    if char not in trie_pointer:
      trie_pointer[char] = {}

    trie_pointer = trie_pointer[char]


def main():
  with open(CEDICT_PARSED_PATH, 'r+') as f:
    csvreader = csv.reader(f, delimiter='∙', dialect='unix', quoting=csv.QUOTE_MINIMAL)
    if DEBUG:
      csvreader = list(csvreader)[20:40]
    for simplified, _, _, _ in csvreader:
      print(simplified)
      add_word(simplified)

  print('FINAL TRIE:')
  print(TRIE)
  print('SIZE:', sys.getsizeof(TRIE))

if __name__ == '__main__':
  main()
