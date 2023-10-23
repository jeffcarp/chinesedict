serve:
	python3 -m http.server -d docs/ 8080

deploy:
	firebase deploy --project chinesedict2

# Via: https://www.mdbg.net/chinese/dictionary?page=cc-cedict
download_latest_dict:
	curl -O https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz
	gunzip cedict_1_0_ts_utf-8_mdbg.txt.gz

generate_dict:
	python3 generate_dict.py
	echo "Final file size:"
	du ./data/cedict_parsed.csv
	gzip -c ./data/cedict_parsed.csv > ./docs/cedict_parsed.csv.gz
	echo "Gzipped final file size:"
	du ./docs/cedict_parsed.csv.gz
