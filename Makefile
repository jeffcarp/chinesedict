proto:
	protoc \
		--python_out=scripts/. \
		dictionary.proto

# Via: https://www.mdbg.net/chinese/dictionary?page=cc-cedict
download_latest_dict:
	curl https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz > ./data/cedict_1_0_ts_utf-8_mdbg.txt.gz
	gunzip ./data/cedict_1_0_ts_utf-8_mdbg.txt.gz
