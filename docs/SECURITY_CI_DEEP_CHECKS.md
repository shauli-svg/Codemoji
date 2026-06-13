# CodeMoji X - Deep Security CI

This file documents the security checks added in the ritual UI stage.

Static checks should detect:

- third-party scripts in index.html
- forbidden localStorage writes involving secret/message/plaintext/cipher/pattern/capsule
- console logging of sensitive values
- technical copy in visible product strings
- missing crypto/security docs
- missing DESIGN binding docs

Security truth remains:

- V1 is static-first.
- No backend.
- No plaintext in URL.
- No key in URL.
- Pattern derives the unlock key.
- Decryption happens on device.
- Do not claim military-grade security.
