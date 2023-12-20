from typing import Optional

import argparse
import csv
import os
import json
import io
import re
import yaml
import jieba
import tqdm
import pinyin

import dict_client
import dictionary_pb2
from google.protobuf import json_format


CEDICT_PATH = './data/cedict_1_0_ts_utf-8_mdbg.txt'
CHENGYU_PATH = './data/chengyu.txt'
HSK_PATH = './data/hsk.tsv'
TATOEBA_PATH = './data/tatoeba_examples.txt'


def update_cedict(client):
  print('Reading CEDICT...')
  new_entries = []
  with open(CEDICT_PATH, 'r') as f:
    for line in tqdm.tqdm(f.readlines()):
      if line.startswith('#'):
        continue
      line = line.strip()
      line = line.rstrip('/')
      parts = line.split('/')
      char_and_pinyin = parts[0]
      definitions = parts[1:]
      matches = re.findall(r'(.+)\s(.+)\s\[(.+)\]', char_and_pinyin)
      matches = matches[0]
      if len(matches) != 3:
        print('No match for:', char_and_pinyin)
        continue
      traditional, simplified, old_pinyin = matches
      # Add new entries.
      # TODO: even if word exists, need to make sure the definitions are different
      # Also do we treat different tones as different entries?
      if (not client.word_exists(traditional)
          and not client.word_exists(simplified)):
        new_entries.append(dictionary_pb2.Entry())
        client.dict.entries.append(entry)
      # TODO: Merge updated content for existing entries.

  print(f'Added {len(new_entries)} new entries from CEDICT.')


def apply_chengyu_tags(client):
  print('Adding chengyu tags...')
  with open(CHENGYU_PATH, 'r+') as f:
    all_chengyu = [line.rstrip('\n') for line in f]

  for entry in client.dict.entries:
    if (entry.traditional in all_chengyu
        or entry.simplified in all_chengyu
        and 'chengyu' not in entry.tags):
      entry.tags.append('chengyu')


def apply_hsk_tags(client):
  print('Adding HSK tags...')
  hsk_by_trad = {}
  hsk_by_simp = {}

  with open(HSK_PATH, 'r+') as f:
    tsv_file = csv.reader(f, delimiter='\t')
    for hsk_trad, hsk_simp, hsk_level in tsv_file:
      hsk_by_trad[hsk_trad] = hsk_level
      hsk_by_simp[hsk_simp] = hsk_level

  for entry in client.dict.entries:
    if entry.traditional in hsk_by_trad:
      level = hsk_by_trad[entry.traditional]
      tag = f'HSK{level}'
      if tag not in entry.tags:
        entry.tags.append(tag)
    if entry.simplified in hsk_by_simp:
      level = hsk_by_simp[entry.simplified]
      tag = f'HSK{level}'
      if tag not in entry.tags:
        entry.tags.append(tag)


def add_example_sentences(client):
  print('Adding example sentences...')
  with open(TATOEBA_PATH, 'r+') as f:
    for line in tqdm.tqdm(list(f.readlines())):
      words = jieba.lcut(line)
      for word in words:
        entry_index = client.word_index(word)
        if entry_index:
          client.dict.entries[entry_index].examples.append(line)


def main(args: argparse.Namespace):
  client = dict_client.DictClient()

  print('UPDATE FLAG', args.update)
  if 'cedict' in args.update:
    update_cedict(client)
  if 'chengyu' in args.update:
    apply_chengyu_tags(client)
  if 'hsk' in args.update:
    apply_hsk_tags(client)
  if 'examples' in args.update:
    add_example_sentences(client)
  client.write()


if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument(
      '--debug',
      action=argparse.BooleanOptionalAction,
      default=False,
  )
  parser.add_argument('-u', '--update', nargs='+', help='What to update', default=['examples', 'chengyu'])
  args = parser.parse_args()
  main(args)
