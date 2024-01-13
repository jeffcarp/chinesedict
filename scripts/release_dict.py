"""Takes dictionary.textproto and converts to specific formats.

For example, if dictionary.textproto is updated manually, this will update
the files used by the site.
"""

import dict_client


def main():
  client = dict_client.DictClient()
  client.write()


if __name__ == '__main__':
  main()
