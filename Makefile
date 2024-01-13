serve:
	python3 -m http.server -d public/ 8080

serve_spa:
	python3 -m http.server -d spa/ 8080

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

TSC_ARGS=js/dictionary.ts --outDir spa/ --lib es2023 --module es2022
build_js:
	tsc $(TSC_ARGS)

build_js_watch:
	tsc -w $(TSC_ARGS)

# TODO: Merge below with above.

release_dict:
	python3 scripts/release_dict.py


update:
	python3 update.py
	find release -exec wc -c {} +

serve_watch:
	gow -e=go,mod,html,css,textproto run server/*.go

serve_nowatch:
	go run server/*.go

proto:
	protoc \
		--python_out=scripts/. \
		--go_out=server/. \
		--go_opt=paths=source_relative \
		dictionary.proto

deploy_go:
	gcloud app deploy ./server/app.yaml --project=zhongwenfyi

# Via: https://www.mdbg.net/chinese/dictionary?page=cc-cedict
download_latest_dict:
	curl https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz > ./data/cedict_1_0_ts_utf-8_mdbg.txt.gz
	gunzip ./data/cedict_1_0_ts_utf-8_mdbg.txt.gz
