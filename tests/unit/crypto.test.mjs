import test from "node:test";
import assert from "node:assert/strict";
import { encryptWithPattern, decryptWithPattern } from "../../src/core/crypto/cryptoEngine.js";
import { encodeCapsule } from "../../src/core/capsule/capsuleCodec.js";
import { unicodeMessages } from "../fixtures/unicodeMessages.mjs";

const pattern = [1, 2, 5, 8];

test("same message and same pattern decrypt", async () => {
  const capsule = await encryptWithPattern({ plainText: "שלום hello ✨", pattern });
  const plain = await decryptWithPattern({ capsule, pattern });
  assert.equal(plain, "שלום hello ✨");
});

test("wrong pattern fails", async () => {
  const capsule = await encryptWithPattern({ plainText: "secret", pattern });
  await assert.rejects(() => decryptWithPattern({ capsule, pattern: [1, 3, 6, 9] }));
});

test("different salt changes cipher", async () => {
  const a = await encryptWithPattern({ plainText: "same", pattern });
  const b = await encryptWithPattern({ plainText: "same", pattern });
  assert.notEqual(a.cipher, b.cipher);
  assert.notEqual(a.salt, b.salt);
});

test("unicode messages roundtrip", async () => {
  for (const message of unicodeMessages) {
    const capsule = await encryptWithPattern({ plainText: message, pattern });
    assert.equal(await decryptWithPattern({ capsule, pattern }), message);
  }
});

test("empty message rejected", async () => {
  await assert.rejects(() => encryptWithPattern({ plainText: "   ", pattern }));
});

test("over-limit message rejected", async () => {
  await assert.rejects(() => encryptWithPattern({ plainText: "א".repeat(161), pattern }));
});

test("capsule URL does not include plaintext or key", async () => {
  const capsule = await encryptWithPattern({ plainText: "סוד-בדיקה", pattern });
  const encoded = encodeCapsule(capsule);
  assert.equal(encoded.includes("סוד-בדיקה"), false);
  assert.equal(/key=/i.test(encoded), false);
});
