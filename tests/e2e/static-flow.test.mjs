import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";
import { encryptWithPattern, decryptWithPattern } from "../../src/core/crypto/cryptoEngine.js";
import { encodeCapsule, parseCapsule } from "../../src/core/capsule/capsuleCodec.js";

const index = readFileSync("index.html", "utf8");

test("static shell loads the app module and styles", () => {
  assert.match(index, /src\/app\/main\.js/);
  assert.match(index, /secretBubble\.css/);
  assert.match(index, /onboarding\.css/);
  assert.match(index, /app\.webmanifest/);
});

test("vertical crypto slice works: compose capsule to receive reveal", async () => {
  const pattern = [1, 2, 5, 8];
  const capsule = await encryptWithPattern({ plainText: "משהו קטן 🫧", pattern });
  const encoded = encodeCapsule(capsule);
  assert.equal(encoded.startsWith("CM8P."), true);
  const parsed = parseCapsule(encoded);
  const plain = await decryptWithPattern({ capsule: parsed, pattern });
  assert.equal(plain, "משהו קטן 🫧");
});
