import test from "node:test";
import assert from "node:assert/strict";
import { whatsappUrl, cleanWhatsappText } from "../../src/core/transport/whatsapp.js";
import { telegramUrl } from "../../src/core/transport/telegram.js";

const H_SECRET = "\u05e1\u05d5\u05d3";
const H_SMALL = "\u05e7\u05d8\u05df";
const H_SECRET_SMALL = H_SECRET + " " + H_SMALL;
const H_SENT_SMALL_SECRET = "\u05e0\u05e9\u05dc\u05d7 \u05d0\u05dc\u05d9\u05da " + H_SECRET_SMALL;
const H_OPEN_CODE = "\u05e7\u05d5\u05d3 \u05e4\u05ea\u05d9\u05d7\u05d4";

function decodedWhatsappText(url) {
  assert.ok(url.startsWith("https://wa.me/?text="));
  return decodeURIComponent(url.replace("https://wa.me/?text=", ""));
}

test("WhatsApp URL generation keeps one capsule URL", () => {
  const capsuleUrl = "https://codemoji.app/#CM8P.bubble..safe.payload";
  const url = whatsappUrl({ text: H_SECRET + "\n" + capsuleUrl, url: capsuleUrl });
  const decoded = decodedWhatsappText(url);

  assert.equal(decoded.split(capsuleUrl).length - 1, 1);
  assert.equal(/[\uFEFF\uFFFD]/u.test(decoded), false);
});

test("WhatsApp text keeps readable Hebrew after encode/decode", () => {
  const capsuleUrl = "https://codemoji.app/#CM8P.bubble..hebrew";
  const original = H_SENT_SMALL_SECRET + "\n\u05e4\u05d5\u05ea\u05d7\u05d9\u05dd \u05d0\u05d5\u05ea\u05d5 \u05e2\u05dd " + H_OPEN_CODE;
  const url = whatsappUrl({ text: original, url: capsuleUrl });
  const decoded = decodedWhatsappText(url);

  assert.ok(decoded.includes(H_SENT_SMALL_SECRET));
  assert.ok(decoded.includes(H_OPEN_CODE));
  assert.equal(decoded.includes(String.fromCharCode(0xFFFD)), false);
  assert.equal(decoded.split(capsuleUrl).length - 1, 1);
});

test("WhatsApp text sanitizer removes BOM and replacement characters", () => {
  const dirty =
    String.fromCharCode(0xFEFF) +
    H_SECRET +
    String.fromCharCode(0xFFFD) +
    " " +
    H_SMALL +
    String.fromCharCode(0x0000) +
    "\r\n" +
    H_OPEN_CODE;

  const clean = cleanWhatsappText(dirty);

  assert.equal(clean.includes(String.fromCharCode(0xFEFF)), false);
  assert.equal(clean.includes(String.fromCharCode(0xFFFD)), false);
  assert.equal(clean.includes(String.fromCharCode(0x0000)), false);
  assert.ok(clean.includes(H_SECRET_SMALL));
  assert.ok(clean.includes(H_OPEN_CODE));
});

test("Telegram URL generation separates url and text", () => {
  const capsuleUrl = "https://codemoji.app/#CM8P.bubble..safe.payload";
  const url = telegramUrl({ text: H_SECRET + "\n" + capsuleUrl, url: capsuleUrl });

  assert.ok(url.startsWith("https://t.me/share/url?"));
  const parsed = new URL(url);
  assert.equal(parsed.searchParams.get("url"), capsuleUrl);
  assert.equal(parsed.searchParams.get("text").includes(capsuleUrl), false);
});
