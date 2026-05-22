import { encodeText } from "./unicode.js";
import { CapsuleError, ErrorCode } from "../errors/errors.js";

export function normalizePattern(pattern) {
  if (!Array.isArray(pattern)) throw new CapsuleError(ErrorCode.WRONG_SIGN);
  const unique = [];
  for (const n of pattern) {
    const point = Number(n);
    if (!Number.isInteger(point) || point < 1 || point > 9) throw new CapsuleError(ErrorCode.WRONG_SIGN);
    if (!unique.includes(point)) unique.push(point);
  }
  if (unique.length < 4) throw new CapsuleError(ErrorCode.WRONG_SIGN);
  return unique;
}

export async function derivePatternKey(pattern, salt) {
  if (!globalThis.crypto?.subtle) throw new CapsuleError(ErrorCode.CRYPTO_UNAVAILABLE);
  const normalized = normalizePattern(pattern).join("-");
  const material = await crypto.subtle.importKey("raw", encodeText(normalized), "PBKDF2", false, [
    "deriveKey"
  ]);

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 180000,
      hash: "SHA-256"
    },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}
