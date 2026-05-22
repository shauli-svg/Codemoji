import { CapsuleError, ErrorCode } from "../errors/errors.js";
import { fromBase64Url } from "../crypto/base64url.js";
import { CAPSULE_PART_COUNT, CAPSULE_VERSION } from "./capsuleVersion.js";
import { SkinIds } from "./capsule.types.js";

export function encodeCapsule(capsule) {
  const parts = [
    capsule.v,
    capsule.skin,
    encodeURIComponent(capsule.hint ?? ""),
    capsule.salt,
    capsule.iv,
    capsule.cipher
  ];
  if (parts.some((part) => typeof part !== "string" || part.includes("."))) {
    throw new CapsuleError(ErrorCode.MALFORMED_CAPSULE);
  }
  return parts.join(".");
}

export function parseCapsule(raw) {
  const clean = String(raw ?? "").replace(/^#/, "").trim();
  if (!clean || clean.length > 4096) throw new CapsuleError(ErrorCode.MALFORMED_CAPSULE);
  if (/plainText|plaintext|key=/i.test(clean)) throw new CapsuleError(ErrorCode.MALFORMED_CAPSULE);

  const parts = clean.split(".");
  if (parts.length !== CAPSULE_PART_COUNT) throw new CapsuleError(ErrorCode.MALFORMED_CAPSULE);
  const [v, skin, hint, salt, iv, cipher] = parts;
  if (v !== CAPSULE_VERSION) throw new CapsuleError(ErrorCode.UNSUPPORTED_VERSION);
  if (!SkinIds.includes(skin)) throw new CapsuleError(ErrorCode.MALFORMED_CAPSULE);
  if (!salt || !iv || !cipher) throw new CapsuleError(ErrorCode.MALFORMED_CAPSULE);

  try {
    fromBase64Url(salt);
    fromBase64Url(iv);
    fromBase64Url(cipher);
  } catch {
    throw new CapsuleError(ErrorCode.MALFORMED_CAPSULE);
  }

  return {
    v,
    skin,
    hint: decodeURIComponent(hint || ""),
    salt,
    iv,
    cipher
  };
}
