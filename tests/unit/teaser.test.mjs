import test from "node:test";
import assert from "node:assert/strict";
import { chooseTeaser, buildTeaserPayload } from "../../src/product/viralTeaser/teaserGenerator.js";
import { teaserTemplates } from "../../src/product/viralTeaser/teaserTemplates.js";
import { TeaserChannel, TeaserMood } from "../../src/product/viralTeaser/teaser.types.js";

const oldTerms = new RegExp(["\\u05E6\\u05D9\\u05D9\\u05E8", "\\u05E6\\u05D9\\u05D5\\u05E8", "\\u05D2\\u05DC\\u05D4", "\\u05DE\\u05D5\\u05DB\\u05DF \\u05DC\\u05D3\\u05E8\\u05DA", "\\u05D2\\u05E2, \\u05E6\\u05D9\\u05D9\\u05E8, \\u05D2\\u05DC\\u05D4", "\\u05E6\\u05D9\\u05D9\\u05E8 \\u05E2\\u05DC\\u05D9\\u05D5 \\u05D0\\u05EA \\u05D4\\u05E1\\u05D9\\u05DE\\u05DF"].join("|"), "u");
const matureHook = new RegExp(["\\u05E7\\u05D5\\u05D3 \\u05E4\\u05EA\\u05D9\\u05D7\\u05D4", "\\u05E7\\u05D5\\u05D3", "\\u05E1\\u05D5\\u05D3", "\\u05E4\\u05E8\\u05D8\\u05D9", "\\u05E0\\u05E2\\u05D5\\u05DC", "\\u05D4\\u05D7\\u05DC\\u05D9\\u05E7\\u05D5", "\\u05E4\\u05EA\\u05D7\\u05D5"].join("|"), "u");

test("teaser pool has at least 5 templates with both moods", () => {
  assert.ok(teaserTemplates.length >= 5, `expected >= 5 templates, got ${teaserTemplates.length}`);
  const moods = new Set(teaserTemplates.map((t) => t.mood));
  assert.ok(moods.has(TeaserMood.PLAYFUL));
  assert.ok(moods.has(TeaserMood.MYSTERIOUS));
});

test("every template has mature Hebrew copy and stays mobile-friendly", () => {
  for (const t of teaserTemplates) {
    assert.ok(t.id && typeof t.id === "string");
    assert.equal(typeof t.emoji, "string", `${t.id} marker must be a string`);
    assert.ok(t.body.length >= 10, `${t.id} body too short`);
    assert.ok(t.body.length <= 140, `${t.id} body too long: ${t.body.length}`);
    assert.ok(/[\u05D0-\u05EA]/u.test(t.body), `${t.id} must include Hebrew`);
    assert.ok(matureHook.test(t.body), `${t.id} must include mature secret/code hook`);
    assert.equal(oldTerms.test(t.body + t.emoji), false, `${t.id} contains old drawing/discovery language`);
  }
});

test("seeded selection is deterministic", () => {
  const a = chooseTeaser({ seed: "abc-123" });
  const b = chooseTeaser({ seed: "abc-123" });
  assert.equal(a.id, b.id);
});

test("seeded mood filter respects mood", () => {
  const t = chooseTeaser({ seed: "mood-test", mood: TeaserMood.MYSTERIOUS });
  assert.equal(t.mood, TeaserMood.MYSTERIOUS);
});

test("buildTeaserPayload for WhatsApp puts URL on its own line with mature copy", () => {
  const payload = buildTeaserPayload({
    url: "https://example.com/#CM8P.bubble..s.i.c",
    channel: TeaserChannel.WHATSAPP,
    seed: "consistent"
  });
  assert.ok(payload.text.endsWith("\nhttps://example.com/#CM8P.bubble..s.i.c"));
  assert.ok(matureHook.test(payload.text), "body must carry mature secret/code hook");
  assert.equal(oldTerms.test(payload.text), false, "payload must not carry old drawing/discovery language");
  assert.equal(payload.title, "CodeMoji");
});

test("buildTeaserPayload for native share omits URL from text", () => {
  const payload = buildTeaserPayload({ url: "https://example.com/#CM8P.bubble..s.i.c", channel: TeaserChannel.NATIVE, seed: "native" });
  assert.equal(payload.text.includes("https://"), false);
});

test("buildTeaserPayload requires url", () => {
  assert.throws(() => buildTeaserPayload({}));
});

test("teaser never leaks technical jargon or old UI language", () => {
  const banned = ["encryption", "AES", "decrypt", "key=", "password", "\\u05E1\\u05D9\\u05E1\\u05DE\\u05D4", "\\u05E6\\u05D5\\u05E4\\u05DF", "\\u05D4\\u05E6\\u05E4\\u05E0", "\\u05E6\\u05D9\\u05D9\\u05E8", "\\u05E6\\u05D9\\u05D5\\u05E8", "\\u05D2\\u05DC\\u05D4", "\\u05DE\\u05D5\\u05DB\\u05DF \\u05DC\\u05D3\\u05E8\\u05DA", "\\u05E1\\u05D9\\u05DE\\u05DF"];
  for (const t of teaserTemplates) {
    for (const word of banned) {
      assert.equal(t.body.toLowerCase().includes(word.toLowerCase()), false, `${t.id} contains banned word ${word}`);
    }
  }
});
