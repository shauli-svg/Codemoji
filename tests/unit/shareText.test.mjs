import test from "node:test";
import assert from "node:assert/strict";
import { cleanTransportText, textWithSingleUrl, textWithoutUrl } from "../../src/core/transport/shareText.js";

const url = "https://example.com/#CM8P.bubble..AAA.BBB.CCC";

test("transport text removes BOM and replacement characters", () => {
  assert.equal(cleanTransportText(`\uFEFFקיבלת\uFFFD סוד`), "קיבלת סוד");
});

test("textWithSingleUrl keeps one URL even when payload text already includes it", () => {
  const text = textWithSingleUrl({ text: `קיבלת סוד\n${url}`, url });
  assert.equal(text.split(url).length - 1, 1);
});

test("textWithSingleUrl appends the URL when payload text is body-only", () => {
  const text = textWithSingleUrl({ text: "קיבלת סוד", url });
  assert.equal(text, `קיבלת סוד\n${url}`);
});

test("textWithoutUrl removes URL from channel text body", () => {
  assert.equal(textWithoutUrl({ text: `קיבלת סוד\n${url}`, url }), "קיבלת סוד");
});
