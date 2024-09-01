serve:
	python3 -m http.server -d public/ 8080

deploy:
	firebase deploy --project chinesedict2

generate_dict:
	python3 generate_dict.py
	echo "Final file size:"
	du ./data/cedict_parsed.csv
	gzip -c ./data/cedict_parsed.csv > ./public/cedict_parsed.csv.gz
	echo "Gzipped final file size:"
	du ./public/cedict_parsed.csv.gz

test:
	deno test --allow-read

test_watch:
	deno test --watch --allow-read

push:
	deno fmt --check
	git push

TSC_ARGS=js/dictionary.ts --outDir public/js/ --lib es2023 --module es2022
build_js:
	tsc $(TSC_ARGS)

build_js_watch:
	tsc -w $(TSC_ARGS)

update:
	python3 update.py
	find release -exec wc -c {} +

proto:
	protoc \
		--python_out=scripts/. \
		--js_out=functions/lib/. \
		dictionary.proto

# Via: https://www.mdbg.net/chinese/dictionary?page=cc-cedict
download_latest_dict:
	curl https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz > ./data/cedict_1_0_ts_utf-8_mdbg.txt.gz
	gunzip ./data/cedict_1_0_ts_utf-8_mdbg.txt.gz
