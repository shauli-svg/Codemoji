import test from "node:test";
import assert from "node:assert/strict";
import { encryptWithPattern } from "../../src/core/crypto/cryptoEngine.js";
import { encodeCapsule } from "../../src/core/capsule/capsuleCodec.js";
import { shareLinks, buildSharePayload } from "../../src/core/transport/shareService.js";
import { TeaserChannel } from "../../src/product/viralTeaser/teaser.types.js";

const matureShareHook = new RegExp(["\\u05E7\\u05D5\\u05D3 \\u05E4\\u05EA\\u05D9\\u05D7\\u05D4", "\\u05E7\\u05D5\\u05D3", "\\u05E1\\u05D5\\u05D3", "\\u05E4\\u05E8\\u05D8\\u05D9", "\\u05E0\\u05E2\\u05D5\\u05DC", "\\u05D4\\u05D7\\u05DC\\u05D9\\u05E7\\u05D5", "\\u05E4\\u05EA\\u05D7\\u05D5"].join("|"), "u");
const oldShareTerms = new RegExp(["\\u05E6\\u05D9\\u05D9\\u05E8", "\\u05E6\\u05D9\\u05D5\\u05E8", "\\u05D2\\u05DC\\u05D4", "\\u05DE\\u05D5\\u05DB\\u05DF \\u05DC\\u05D3\\u05E8\\u05DA", "\\u05D2\\u05E2, \\u05E6\\u05D9\\u05D9\\u05E8, \\u05D2\\u05DC\\u05D4", "\\u05E6\\u05D9\\u05D9\\u05E8 \\u05E2\\u05DC\\u05D9\\u05D5 \\u05D0\\u05EA \\u05D4\\u05E1\\u05D9\\u05DE\\u05DF"].join("|"), "u");

const pattern = [1, 2, 5, 8];

test("full vertical: compose → capsule → WhatsApp link with teaser, URL preserved", async () => {
  const capsule = await encryptWithPattern({ plainText: "🫧 רואים אותי?", pattern });
  const url = `https://example.com/#${encodeCapsule(capsule)}`;
  const links = shareLinks(url, { seed: "e2e-share" });

  assert.ok(links.whatsapp.startsWith("https://wa.me/?text="));
  assert.ok(links.telegram.startsWith("https://t.me/share/url?"));

  const decoded = decodeURIComponent(links.whatsapp.replace("https://wa.me/?text=", ""));
  assert.ok(decoded.includes(url), "WhatsApp text must carry the capsule URL");
  assert.equal(decoded.split(url).length - 1, 1, "WhatsApp text must not duplicate the capsule URL");
  assert.equal(/[\uFEFF\uFFFD]/u.test(decoded), false, "WhatsApp text must not carry BOM/replacement chars");
  assert.ok(matureShareHook.test(decoded), "share text must carry mature secret/code hook");
assert.equal(oldShareTerms.test(decoded), false, "share text must not carry old drawing/discovery language");
  assert.equal(decoded.includes("🫧 רואים אותי?"), false, "plaintext must never appear in share text");
});

test("clipboard fallback preview also contains the teaser", () => {
  const url = "https://example.com/#CM8P.bubble..A.B.C";
  const payload = buildSharePayload(url, { channel: TeaserChannel.CLIPBOARD, seed: "cb-e2e" });
  assert.ok(payload.text.includes(url));
  assert.ok(matureShareHook.test(payload.text), "share text must carry mature secret/code hook");
assert.equal(oldShareTerms.test(payload.text), false, "share text must not carry old drawing/discovery language");
});
