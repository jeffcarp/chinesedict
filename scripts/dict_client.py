"""Interface for dictionary on disk."""

from typing import Optional

from google.protobuf import json_format
from google.protobuf import text_format
import json
import io
import yaml

import dictionary_pb2


RELEASE_PATH = './data/dictionary.textproto'


class DictClient:

  def __init__(self):
    with open(RELEASE_PATH, 'r') as f:
      self.dict = text_format.Parse(
          f.read(), dictionary_pb2.Dictionary(),
      )

    print(f'Loaded dict at {RELEASE_PATH}')
    print(f'with {len(self.dict.entries)} entries.')
    print('Building index...')
    self._build_index()
    print('Index built.')

  def write(self):
    print(f'Writing {len(self.dict.entries)} to {RELEASE_PATH}.')

    print('Writing textproto.')
    with io.open(RELEASE_PATH, "w") as f:
      f.write(text_format.MessageToString(self.dict, as_utf8=True))

  def write_json(self, path):
    print(f'Writing JSON to {path}')
    # Ensure entries are sorted on write.
    entries = sorted(self.dict.entries, key=lambda entry: entry.traditional)
    dict_entries = [json_format.MessageToDict(entry) for entry in entries]
    for entry in dict_entries:
      entry['pinyin'] = entry['pinyin'].split(' ')
    with io.open(path, "w") as f:
      json.dump(dict_entries, f)

  def write_search_index_json(self, path):
    print(f'Writing search index JSON to {path}')
    # Ensure entries are sorted on write.
    entries = sorted(self.dict.entries, key=lambda entry: entry.traditional)
    dict_entries = [
      {
        'traditional': entry.traditional,
        'simplified': entry.simplified,
        'pinyin': entry.pinyin.split(' '),
        'definitions': [json_format.MessageToDict(definition) for definition in entry.definitions],
        'percentile': entry.percentile,
      }
      for entry in entries
      if hasattr(entry, 'percentile') and entry.percentile > 1
    ]
    print(f'Writing {len(dict_entries)} search index entries to {path}')
    with io.open(path, "w") as f:
      json.dump(dict_entries, f)

  def _build_index(self):
    self._word_index = {}
    for index, entry in enumerate(self.dict.entries):
      self._word_index[entry.traditional] = index
      self._word_index[entry.simplified] = index

  def word_exists(self, word) -> bool:
    return word in self._word_index

  def word_index(self, word) -> Optional[int]:
    return self._word_index.get(word, None)

