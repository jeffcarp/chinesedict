import { assertEquals } from "https://deno.land/std@0.207.0/assert/mod.ts";
import {
  Entry,
  entriesForKeyword,
  splitWords,
  loadDictionaryFromDisk,
} from "./search.ts";

Deno.test("Single word", () => {
  assertEquals(
    splitWords("迟到"),
    ["迟到"],
  );
});

Deno.test("Two words simple", () => {
  assertEquals(
    splitWords("你好欢迎"),
    ["你好", "欢迎"],
  );
});

// Can we do segmentation in a dumb way?

Deno.test("entriesForKeyword", async (t) => {
  const dict = await loadDictionaryFromDisk();
  const actualEntries = await entriesForKeyword("nihao", dict);
  assertEquals(
    actualEntries,
    [
      {
        pinyin: ["nǐ", "hǎo"],
        searchablePinyin: "nihao",
      }
    ],
  );
});
