const TOKEN = /^[A-Za-z0-9_-]+$/;

export function toBase64Url(bytes) {
  if (!(bytes instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function fromBase64Url(input) {
  if (typeof input !== "string" || !input || !TOKEN.test(input)) {
    throw new Error("INVALID_BASE64URL");
  }
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
}
