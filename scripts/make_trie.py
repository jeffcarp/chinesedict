import argparse
import csv
import functools
import sys

# Assuming this is run from project root.
CEDICT_PARSED_PATH = './data/cedict_parsed.csv'
TRIE = {}
STOP_CHAR = None


def add_word(word):
  trie_pointer = TRIE

  for char in word:
    if char not in trie_pointer:
      trie_pointer[char] = {}

    trie_pointer = trie_pointer[char]

  # Add stop char.
  trie_pointer[char] = {STOP_CHAR: STOP_CHAR}


def main(args):
  with open(CEDICT_PARSED_PATH, 'r+') as f:
    csvreader = csv.reader(f, delimiter='∙', dialect='unix', quoting=csv.QUOTE_MINIMAL)
    if args.debug:
      csvreader = list(csvreader)[20:40]
    for simplified, pinyin, _, _ in csvreader:
      print(simplified, pinyin)
      add_word(simplified)

  print('FINAL TRIE:')
  print(TRIE)
  print('SIZE:', sys.getsizeof(TRIE))

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--debug', default=True)
  args = parser.parse_args()
  main(args)
