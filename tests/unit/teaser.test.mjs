import test from "node:test";
import assert from "node:assert/strict";
import {
  chooseTeaser,
  buildTeaserPayload
} from "../../src/product/viralTeaser/teaserGenerator.js";
import { teaserTemplates } from "../../src/product/viralTeaser/teaserTemplates.js";
import { TeaserChannel, TeaserMood } from "../../src/product/viralTeaser/teaser.types.js";

test("teaser pool has at least 5 templates with both moods", () => {
  assert.ok(teaserTemplates.length >= 5, `expected >= 5 templates, got ${teaserTemplates.length}`);
  const moods = new Set(teaserTemplates.map((t) => t.mood));
  assert.ok(moods.has(TeaserMood.PLAYFUL));
  assert.ok(moods.has(TeaserMood.MYSTERIOUS));
});

test("every template has emoji, body, and stays within mobile-friendly length", () => {
  for (const t of teaserTemplates) {
    assert.ok(t.id && typeof t.id === "string");
    assert.ok(t.emoji && /\p{Extended_Pictographic}/u.test(t.emoji), `${t.id} must contain an emoji`);
    assert.ok(t.body.length >= 10, `${t.id} body too short`);
    assert.ok(t.body.length <= 140, `${t.id} body too long: ${t.body.length}`);
    assert.ok(/[\u05D0-\u05EA]/.test(t.body), `${t.id} must include Hebrew`);
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

test("buildTeaserPayload for WhatsApp puts URL on its own line", () => {
  const payload = buildTeaserPayload({
    url: "https://example.com/#CM8P.bubble..s.i.c",
    channel: TeaserChannel.WHATSAPP,
    seed: "consistent"
  });
  assert.ok(payload.text.endsWith("\nhttps://example.com/#CM8P.bubble..s.i.c"));
  assert.ok(/\p{Extended_Pictographic}/u.test(payload.text), "body must carry pictographic curiosity hook");
  assert.equal(payload.title.startsWith("CodeMoji "), true);
});

test("buildTeaserPayload for native share omits URL from text", () => {
  const payload = buildTeaserPayload({
    url: "https://example.com/#CM8P.bubble..s.i.c",
    channel: TeaserChannel.NATIVE,
    seed: "native"
  });
  assert.equal(payload.text.includes("https://"), false);
});

test("buildTeaserPayload requires url", () => {
  assert.throws(() => buildTeaserPayload({}));
});

test("teaser never leaks technical jargon", () => {
  const banned = ["encryption", "AES", "decrypt", "key=", "password", "סיסמה", "צופן", "הצפנ"];
  for (const t of teaserTemplates) {
    for (const word of banned) {
      assert.equal(t.body.toLowerCase().includes(word.toLowerCase()), false, `${t.id} contains banned word ${word}`);
    }
  }
});
