export function normalizeText(value) {
  return String(value ?? "").normalize("NFC");
}

export function encodeText(value) {
  return new TextEncoder().encode(normalizeText(value));
}

export function decodeText(bytes) {
  return new TextDecoder().decode(bytes).normalize("NFC");
}

export function visibleLength(value) {
  return Array.from(normalizeText(value)).length;
}
