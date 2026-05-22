# CodeMoji X

> סוד קטן שנפתח עם הסימן שלך.

A zero-friction "secret bubble" that travels through WhatsApp and opens
in the recipient's browser when they draw the sender's sign. No native
app. No accounts. No backend. No database.

```text
Sender writes secret → draws sign → WhatsApp teaser → Recipient taps
→ Bubble drops in → Draws sign → Reveal → Send one back
```

## Quickstart

```bash
npm run verify    # lint, typecheck, tests, static gates, build, e2e
npm run dev       # http://127.0.0.1:5173
```

Build static bundle:

```bash
npm run build     # generates BUILD_ID, writes dist/
npm run preview   # serves dist/ on http://127.0.0.1:4173
```

## What's inside

- **Static-first PWA** — vanilla ES modules, no framework, no
  install-time dependencies, all crypto runs in the browser via
  `crypto.subtle`.
- **CM8P pattern-bound capsules** — the URL fragment carries the
  ciphertext, salt, and IV. The unlock key is derived in-browser from
  the recipient's drawn sign + a per-capsule salt (PBKDF2 → AES-GCM).
  The plaintext and the key never leave the device.
- **Viral teaser layer** — every share runs through a rotating pool of
  curiosity templates so WhatsApp messages stand out instead of getting
  swiped past. See [`docs/VIRAL_LOOP.md`](docs/VIRAL_LOOP.md).
- **Hybrid onboarding** — gentle inline hint on first visit plus an
  on-demand 3-step tour. See [`docs/ONBOARDING.md`](docs/ONBOARDING.md).
- **WhatsApp-first share order** — explicit primary CTA, with a static
  CI gate to keep it that way ([ADR
  0006](docs/ADR/0006-whatsapp-first-share.md)).

## Architecture (one screen)

```text
src/
├── app/                  bootstrap, routing, App shell
├── features/
│   ├── compose/          write a secret + draw a sign
│   ├── receive/          decode capsule, prompt for sign, decrypt
│   ├── reveal/           PatternGrid + SecretBubble + animations
│   ├── share/            WhatsApp-first ShareSheet + preview
│   ├── reply/            "send one back" CTA
│   └── onboarding/       hybrid hint + on-demand tour
├── core/
│   ├── capsule/          CM8P codec + parser + version
│   ├── crypto/           PBKDF2 + AES-GCM + base64url + unicode
│   ├── transport/        WhatsApp, Telegram, native share, clipboard
│   ├── storage/          local profile / session / onboarding stores
│   ├── config/           env + feature flags
│   └── errors/           typed errors + user-facing copy mapping
├── product/
│   ├── copy.js           Hebrew copy
│   ├── limits.js         message/pattern caps
│   ├── productTruth.js   non-negotiable product rules
│   └── viralTeaser/      template pool + pure generator
├── platform/
│   ├── browser/          viewport, clipboard, shareApi, webCrypto
│   └── pwa/              service worker registration
└── styles/               tokens, base, bubble, onboarding, motion
```

Layer rules ([ADR 0004](docs/ADR/0004-modular-boundaries.md)):

- `core/*` and `product/*` never import from `features/*` or
  `styles/*` (enforced by `tests/static/architecture-check.mjs`).
- `core/transport` cannot import `core/crypto/patternKey` — derivation
  is per-pattern UX policy, not a transport concern.
- `features/*` may import `core/*` and `product/*` freely.

## CI gates

Run `npm run verify` (CI runs the same):

| Gate                          | What it protects                                              |
| ----------------------------- | ------------------------------------------------------------- |
| `lint-basic`                  | NUL bytes, accidental secret logging, plaintext literals       |
| `check-js-syntax`             | `node --check` over every `.js` / `.mjs`                       |
| `test:unit`                   | crypto, capsule, transport, teaser, onboarding store, share   |
| `architecture-check`          | layer boundaries (import-aware, comments are ignored)         |
| `forbidden-tokens-check`      | legacy product names + mojibake patterns                       |
| `bundle-budget-check`         | JS ≤ 180 KB, CSS ≤ 80 KB                                       |
| `whatsapp-first-check`        | WhatsApp stays the primary share CTA                          |
| `teaser-presence-check`       | ≥5 templates, both moods, Hebrew + emoji per template         |
| `forbidden-emojis-check`      | blocks Emoji 13.0+ in user-visible strings (tofu prevention)  |
| `html-head-check`             | viewport, theme-color, OG tags, manifest, lang=he, dir=rtl    |
| `a11y-check`                  | every `<button>` in `features/` has text or aria-label        |
| `test:e2e`                    | capsule roundtrip + WhatsApp link integrity                   |

## Security truth (V1)

- The secret is not visible in the link.
- The unlock key is not in the link.
- Decryption happens on the recipient's device.
- The plaintext is never stored.
- This is **not** "military-grade". Do not market it as suitable for
  highly sensitive secrets. See
  [`docs/SECURITY_MODEL.md`](docs/SECURITY_MODEL.md) and
  [`docs/SECURITY_DISCLOSURE.md`](docs/SECURITY_DISCLOSURE.md).

## Deploying to production

See [`docs/RUNBOOK.md`](docs/RUNBOOK.md) and
[`docs/DEPLOY.md`](docs/DEPLOY.md). The default path is **GitHub
Pages** via the `release.yml` and `pages-deploy.yml` workflows.

## Decisions

- [ADR 0001 — Static First](docs/ADR/0001-static-first.md)
- [ADR 0002 — Pattern-bound capsule](docs/ADR/0002-pattern-bound-capsule.md)
- [ADR 0003 — No backend in V1](docs/ADR/0003-no-backend-v1.md)
- [ADR 0004 — Modular boundaries](docs/ADR/0004-modular-boundaries.md)
- [ADR 0005 — Viral teaser message](docs/ADR/0005-viral-teaser-message.md)
- [ADR 0006 — WhatsApp-first share](docs/ADR/0006-whatsapp-first-share.md)
- [ADR 0007 — Hybrid onboarding](docs/ADR/0007-hybrid-onboarding.md)
- [ADR 0008 — Safe emoji policy](docs/ADR/0008-safe-emoji-policy.md)
