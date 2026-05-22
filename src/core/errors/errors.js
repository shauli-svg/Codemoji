export class CapsuleError extends Error {
  constructor(code, message = code) {
    super(message);
    this.name = "CapsuleError";
    this.code = code;
  }
}

export const ErrorCode = Object.freeze({
  WRONG_SIGN: "WRONG_SIGN",
  MALFORMED_CAPSULE: "MALFORMED_CAPSULE",
  UNSUPPORTED_VERSION: "UNSUPPORTED_VERSION",
  EMPTY_MESSAGE: "EMPTY_MESSAGE",
  MESSAGE_TOO_LONG: "MESSAGE_TOO_LONG",
  CRYPTO_UNAVAILABLE: "CRYPTO_UNAVAILABLE"
});
