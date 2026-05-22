import { parseCapsule } from "./capsuleCodec.js";

export function readCapsuleFromLocation(location = window.location) {
  const raw = location.hash?.slice(1) ?? "";
  if (!raw) return null;
  return parseCapsule(raw);
}

export function hasCapsuleInLocation(location = window.location) {
  return Boolean(location.hash?.startsWith("#CM8P."));
}
