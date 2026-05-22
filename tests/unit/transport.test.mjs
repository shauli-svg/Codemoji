import test from "node:test";
import assert from "node:assert/strict";
import { whatsappUrl } from "../../src/core/transport/whatsapp.js";
import { telegramUrl } from "../../src/core/transport/telegram.js";

test("WhatsApp URL generation keeps one capsule URL", () => {
  const capsuleUrl = "https://example.com/#CM8P.x";
  const url = whatsappUrl({ text: `קיבלת סוד\n${capsuleUrl}`, url: capsuleUrl });
  assert.ok(url.startsWith("https://wa.me/?text="));
  const decoded = decodeURIComponent(url.replace("https://wa.me/?text=", ""));
  assert.equal(decoded.split(capsuleUrl).length - 1, 1);
});

test("Telegram URL generation separates url and text", () => {
  const capsuleUrl = "https://example.com/#CM8P.x";
  const url = telegramUrl({ text: `קיבלת סוד\n${capsuleUrl}`, url: capsuleUrl });
  const parsed = new URL(url);
  assert.equal(parsed.searchParams.get("url"), capsuleUrl);
  assert.equal(parsed.searchParams.get("text"), "קיבלת סוד");
});
