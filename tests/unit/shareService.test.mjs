import test from "node:test";
import assert from "node:assert/strict";
import { buildSharePayload, shareLinks } from "../../src/core/transport/shareService.js";
import { TeaserChannel } from "../../src/product/viralTeaser/teaser.types.js";

const matureShareHook = new RegExp(["\\u05E7\\u05D5\\u05D3 \\u05E4\\u05EA\\u05D9\\u05D7\\u05D4", "\\u05E7\\u05D5\\u05D3", "\\u05E1\\u05D5\\u05D3", "\\u05E4\\u05E8\\u05D8\\u05D9", "\\u05E0\\u05E2\\u05D5\\u05DC", "\\u05D4\\u05D7\\u05DC\\u05D9\\u05E7\\u05D5", "\\u05E4\\u05EA\\u05D7\\u05D5"].join("|"), "u");
const oldShareTerms = new RegExp(["\\u05E6\\u05D9\\u05D9\\u05E8", "\\u05E6\\u05D9\\u05D5\\u05E8", "\\u05D2\\u05DC\\u05D4", "\\u05DE\\u05D5\\u05DB\\u05DF \\u05DC\\u05D3\\u05E8\\u05DA", "\\u05D2\\u05E2, \\u05E6\\u05D9\\u05D9\\u05E8, \\u05D2\\u05DC\\u05D4", "\\u05E6\\u05D9\\u05D9\\u05E8 \\u05E2\\u05DC\\u05D9\\u05D5 \\u05D0\\u05EA \\u05D4\\u05E1\\u05D9\\u05DE\\u05DF"].join("|"), "u");

const url = "https://example.com/#CM8P.bubble..AAA.BBB.CCC";

test("WhatsApp link encodes teaser + exactly one URL", () => {
  const links = shareLinks(url, { seed: "wa-test" });
  assert.ok(links.whatsapp.startsWith("https://wa.me/?text="));
  const decoded = decodeURIComponent(links.whatsapp.replace("https://wa.me/?text=", ""));
  assert.ok(decoded.includes(url));
  assert.equal(decoded.split(url).length - 1, 1);
  assert.equal(/[\uFEFF\uFFFD]/u.test(decoded), false);
  assert.ok(matureShareHook.test(decoded), "decoded WhatsApp text must carry mature secret/code hook");
  assert.equal(oldShareTerms.test(decoded), false, "decoded WhatsApp text must not carry old drawing/discovery language");
  assert.ok(/[\u05D0-\u05EA]/.test(decoded));
});

test("Telegram link carries URL in url param without duplicating it in text param", () => {
  const links = shareLinks(url, { seed: "tg-test" });
  assert.ok(links.telegram.startsWith("https://t.me/share/url?"));
  const parsed = new URL(links.telegram);
  assert.equal(parsed.searchParams.get("url"), url);
  assert.equal(parsed.searchParams.get("text").includes(url), false);
});

test("native channel payload omits the URL from text (Web Share handles it)", () => {
  const payload = buildSharePayload(url, { channel: TeaserChannel.NATIVE, seed: "native" });
  assert.equal(payload.text.includes(url), false);
  assert.equal(payload.url, url);
});

test("clipboard channel payload includes URL inside text (fallback ergonomics)", () => {
  const payload = buildSharePayload(url, { channel: TeaserChannel.CLIPBOARD, seed: "cb" });
  assert.ok(payload.text.includes(url));
});

test("payload exposes the teaser id for analytics-free experiments", () => {
  const a = buildSharePayload(url, { channel: TeaserChannel.WHATSAPP, seed: "same" });
  const b = buildSharePayload(url, { channel: TeaserChannel.WHATSAPP, seed: "same" });
  assert.equal(a.teaserId, b.teaserId);
});
