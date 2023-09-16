import csv
import dataclasses
import functools
import re
from typing import Optional

import pandas as pd
import tqdm
import pinyin


_IN_FILE = './data/cedict_1_0_ts_utf-8_mdbg.txt'
_FREQ_FILE = './data/most_common_chinese_words_v7.csv'
_OUT_FILE = './data/cedict_parsed.csv'


@dataclasses.dataclass
class Word:
  """Representation of a Word. Used in front & back-end."""
  simplified: str
  # traditional: str
  # Pinyin delimited with `_`
  pinyin: str
  definition: str
  # An integer from 0-100 representing the relative frequency of the word.
  percentile: int


@functools.cache
def _get_word_frequencies() -> dict[str, float]:
  # Generated from Weibo dataset, for now:
  # https://colab.research.google.com/drive/1mGWKxTmcmHV_ZquNnHibq2hiH-_hlEy-

  frequencies = {}
  with open(_FREQ_FILE) as csvfile:
    reader = csv.reader(csvfile)
    # Skip header.
    next(reader, None)
    for row in reader:
      _, simplified, _, frequency = row
      frequencies[simplified] = int(float(frequency) * 100)

  return frequencies


def _parse_line(line: str) -> Optional[Word]:
  if line.startswith('#'):
    return None
  line = line.strip()
  line = line.rstrip('/')
  parts = line.split('/')
  char_and_pinyin = parts[0]
  definition = '■'.join(parts[1:])

  matches = re.findall(r'(.+)\s(.+)\s\[(.+)\]', char_and_pinyin)
  matches = matches[0]
  if len(matches) != 3:
    print('No match for:', char_and_pinyin)
    return
  traditional, simplified, old_pinyin = matches
  old_pinyin = old_pinyin.split(' ')

  # Using this for inflected pinyin
  better_pinyin = pinyin.get(simplified, delimiter='_')

  frequencies = _get_word_frequencies()
  percentile = frequencies.get(simplified, 0)

  return Word(
      simplified=simplified,
      pinyin=better_pinyin,
      definition=definition,
      percentile=percentile,
  )

if __name__ == '__main__':
  print('Generating.')
  words: list[Word] = []

  with open(_IN_FILE) as dict_file:
    for line in tqdm.tqdm(dict_file.readlines()):
      word = _parse_line(line)
      if word:
        words.append(word)

  print('Generated word dictionary.')
  print('Num words:', len(words))

  print('Writing parsed file to:', _OUT_FILE)
  with open(_OUT_FILE, 'w+') as out_file:
    csvwriter = csv.writer(out_file, delimiter='∙', dialect='unix', quoting=csv.QUOTE_MINIMAL)
    for word in words:
      row = [
          word.simplified,
          word.pinyin,
          word.definition,
          word.percentile,
      ]
      csvwriter.writerow(row)
