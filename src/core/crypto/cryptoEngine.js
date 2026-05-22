import { CapsuleError, ErrorCode } from "../errors/errors.js";
import { toBase64Url, fromBase64Url } from "./base64url.js";
import { encryptAesGcm, decryptAesGcm } from "./aesGcm.js";
import { derivePatternKey } from "./patternKey.js";
import { normalizeText, visibleLength } from "./unicode.js";

export const CryptoLimits = Object.freeze({
  maxMessageLength: 160
});

export function validatePlainText(plainText) {
  const normalized = normalizeText(plainText).trim();
  if (!normalized) throw new CapsuleError(ErrorCode.EMPTY_MESSAGE);
  if (visibleLength(normalized) > CryptoLimits.maxMessageLength) {
    throw new CapsuleError(ErrorCode.MESSAGE_TOO_LONG);
  }
  return normalized;
}

export async function encryptWithPattern({ plainText, pattern, skin = "bubble", hint = "" }) {
  const normalized = validatePlainText(plainText);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await derivePatternKey(pattern, salt);
  const cipher = await encryptAesGcm(normalized, key, iv);

  return {
    v: "CM8P",
    skin,
    hint,
    salt: toBase64Url(salt),
    iv: toBase64Url(iv),
    cipher: toBase64Url(cipher)
  };
}

export async function decryptWithPattern({ capsule, pattern }) {
  const salt = fromBase64Url(capsule.salt);
  const iv = fromBase64Url(capsule.iv);
  const cipher = fromBase64Url(capsule.cipher);
  const key = await derivePatternKey(pattern, salt);
  return decryptAesGcm(cipher, key, iv);
}
