# ADR 0009 — Link Compaction and Device Vault Path

## Context

The current static-first capsule places the encrypted capsule in the URL fragment:

```text
https://app.example/#CM8P....
```

That keeps V1 backend-free, but it creates a visibly long link in WhatsApp. It also means every message must carry its own encrypted payload. A truly short link is not possible without moving the ciphertext out of the URL and storing it somewhere.

## Decision

V1 keeps the static fragment transport, but the share transport must never duplicate the capsule URL and must strip BOM/replacement characters before opening chat apps.

For the next production step, introduce a remote capsule store:

```text
https://app.example/s/{shortId}#k={decryptKey}
```

- `/s/{shortId}` resolves ciphertext only.
- `#k=...` remains client-side and is not sent in normal HTTP requests.
- The server must never receive plaintext.
- The browser decrypts locally.
- Optional server rules: expiry, one-time-open, abuse throttling, delete-after-open.

## Why not local cache only?

A local phone cache helps the sender, but it does not help a recipient opening the link on another phone. If the ciphertext is not in the URL and not in a remote store, the recipient has nothing to decrypt.

## Device vault direction

A local device vault is useful for convenience only:

- remember this device
- save sender drafts
- save local profile/device id
- keep recently created capsule metadata
- later: passkey/WebAuthn gate for sensitive local data

Do not store the user's raw unlock pattern by default. If we add a "remember my sign on this phone" mode, it must be opt-in, visibly marked as weaker privacy, and preferably gated behind a passkey/biometric unlock where supported.

## MVP next implementation

Add a `CapsuleStore` abstraction with two implementations:

1. `FragmentCapsuleStore` — current static mode, full capsule in URL fragment.
2. `RemoteCapsuleStore` — stores ciphertext under a short id and returns a compact share URL.

The feature flag should select the mode:

```js
FeatureFlags.backendCapsuleStore = false; // static V1
```

When it flips to `true`, share URLs should become short-id links.

## Acceptance criteria

- WhatsApp share text contains the capsule URL exactly once.
- WhatsApp share text contains no `U+FEFF` or `U+FFFD` characters.
- Telegram text parameter does not duplicate the URL parameter.
- Manual links wrap inside the mobile UI and never push the layout horizontally.
- Short links are only enabled when a real store exists.
