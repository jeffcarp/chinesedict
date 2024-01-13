"""Interface for dictionary on disk."""

from typing import Optional

from google.protobuf import json_format
from google.protobuf import text_format
import json
import io
import yaml

import dictionary_pb2


RELEASE_PATH = './data/dictionary.textproto'
RELEASE_PATH_JSON = './spa/dictionary.json'


class DictClient:

  def __init__(self):
    with open(RELEASE_PATH, 'r') as f:
      self.dict = text_format.Parse(
          f.read(), dictionary_pb2.Dictionary(),
      )

    print(f'Loaded dict at {RELEASE_PATH}')
    print(f'with {len(self.dict.entries)} entries.')
    self._build_index()

  def write(self):
    print(f'Writing {len(self.dict.entries)} to {RELEASE_PATH}.')
    # Ensure entries are sorted on write.
    #self.entries = sorted(self.entries, key=lambda entry: entry.traditional)
    #dict_entries = [json_format.MessageToDict(entry) for entry in self.entries]

    print('Writing textproto.')
    with io.open(RELEASE_PATH, "w") as f:
      f.write(text_format.MessageToString(self.dict, as_utf8=True))

    print('Writing JSON.')
    with io.open(RELEASE_PATH_JSON, "w") as f:
      f.write(json_format.MessageToJson(self.dict, ensure_ascii=False))

  def _build_index(self):
    self._word_index = {}
    for index, entry in enumerate(self.dict.entries):
      self._word_index[entry.traditional] = index
      self._word_index[entry.simplified] = index

  def word_exists(self, word) -> bool:
    return word in self._word_index

  def word_index(self, word) -> Optional[int]:
    return self._word_index.get(word, None)

