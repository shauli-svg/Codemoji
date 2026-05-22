export function assertWebCrypto() {
  if (!globalThis.crypto?.subtle) throw new Error("WEB_CRYPTO_UNAVAILABLE");
}
