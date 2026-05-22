import { decodeText, encodeText } from "./unicode.js";
import { CapsuleError, ErrorCode } from "../errors/errors.js";

export async function encryptAesGcm(text, key, iv) {
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encodeText(text));
  return new Uint8Array(cipher);
}

export async function decryptAesGcm(cipher, key, iv) {
  try {
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipher);
    return decodeText(new Uint8Array(plain));
  } catch {
    throw new CapsuleError(ErrorCode.WRONG_SIGN);
  }
}
