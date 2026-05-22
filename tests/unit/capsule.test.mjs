import test from "node:test";
import assert from "node:assert/strict";
import { encodeCapsule, parseCapsule } from "../../src/core/capsule/capsuleCodec.js";

const capsule = {
  v: "CM8P",
  skin: "bubble",
  hint: "",
  salt: "YWJjZA",
  iv: "MTIzNDU2Nzg5MDEy",
  cipher: "Y2lwaGVy"
};

test("CM8P parser roundtrips", () => {
  assert.deepEqual(parseCapsule(encodeCapsule(capsule)), capsule);
});

test("unsupported version rejected", () => {
  assert.throws(() => parseCapsule("CM7.bubble..YWJj.MTIz.Y2lwaGVy"));
});

test("missing salt rejected", () => {
  assert.throws(() => parseCapsule("CM8P.bubble...MTIz.Y2lwaGVy"));
});

test("invalid base64url rejected", () => {
  assert.throws(() => parseCapsule("CM8P.bubble..not+url.MTIz.Y2lwaGVy"));
});

test("plaintext/key-shaped payload rejected", () => {
  assert.throws(() => parseCapsule("CM8P.bubble..salt.iv.cipher.key=abc"));
});
