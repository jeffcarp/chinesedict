#! /usr/bin/env python3
import dict_client


def main():
  client = dict_client.DictClient()
  # Create dictionary.json
  client.write_json('./svelte/static/full_dictionary.json')
  # Create search_index.json
  client.write_search_index_json('./svelte/static/full_search_index.json')

if __name__ == '__main__':
  main()