import dict_client

def main():
  client = dict_client.DictClient()
  client.write_json('./functions/lib/full_dict_raw.json')


if __name__ == '__main__':
  main()

