import unicodedata


def normalize_pinyin(pinyin: str) -> str:
  """Removes diacritics from pinyin strings."""
  return unicodedata.normalize('NFKD', pinyin).encode('ASCII', 'ignore').decode()
