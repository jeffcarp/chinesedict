import { assertEquals } from "https://deno.land/std@0.207.0/assert/mod.ts";
import { sizeof } from "https://deno.land/x/sizeof@v1.0.3/mod.ts";
import {
  Dictionary,
  Entry,
  processRawTextToDict,
  isChineseChar,
} from "./dictionary.ts";


export async function loadEntriesFromDisk(): Promise<Entry[]> {
  const decoder = new TextDecoder("utf-8");
  const fileContents = Deno.readFileSync("./public/cedict_parsed.csv.gz");

  const data = new Blob([fileContents]);
  const dataStream = data.stream();

  const decompStream = dataStream.pipeThrough(
    new DecompressionStream("gzip"),
  );
  const decompResp = await new Response(decompStream);
  const blob = await decompResp.blob();
  const text = await blob.text();

  return processRawTextToDict(text)
}

Deno.test("segmentText", async (t) => {
  const entries = await loadEntriesFromDisk();
  const dict = new Dictionary(entries);

  const fixtures: { [key: string]: string[] } = {
      "梦": ["梦"],
      "foo": ["foo"],
      "foo梦": ["foo", "梦"],
      "梦foo": ["梦", "foo"],
      "foo梦bar": ["foo", "梦", "bar"],
      "梦foo梦": ["梦", "foo", "梦"],
      // Words with multiple chars.
      "你好": ["你好"],
      "班门弄斧": ["班门弄斧"],
      // Two chinese words juxtaposed.
      "你好欢迎": ["你好", "欢迎"],
      "你好asdf欢迎": ["你好", "asdf", "欢迎"],
      // Long sentence.
      "你今天": ["你", "今天"],
      "你好，你今天过得怎么样": ["你好", "，", "你", "今天", "过得", "怎么样"],
      // Don't segment non-Chinese characters.
      "mmm": ["mmm"],
  };

  for (const fixture of Object.keys(fixtures)) {
    const input = fixture;
    const expected = fixtures[input];
    await t.step(`segments: ${input}`, async (t) => {
        assertEquals(dict.segmentText(input), expected);
    });
  }

});

Deno.test("isChineseChar", (t) => {
  const fixtures: { [key: string]: boolean } = {
      "a": false,
      "asdf": false,
      "你": true,
      "班门弄斧": true,
      "班门asdf弄斧": false,
  };

  for (const fixture of Object.keys(fixtures)) {
    assertEquals(isChineseChar(fixture), fixtures[fixture]);
  }
});
