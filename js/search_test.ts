import { assertEquals } from "https://deno.land/std@0.207.0/assert/mod.ts";
import { splitWords } from "./search.ts";

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
