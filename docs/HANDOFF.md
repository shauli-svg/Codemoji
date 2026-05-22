# CodeMoji X — HANDOFF

## What was built

A static-first, receiver-first CodeMoji X MVP, production-ready and
distributed without a native app or backend.

Implemented vertical slice:

```text
Compose → Pattern → CM8P capsule → WhatsApp-first Share (rotating teaser)
       → Receive → Onboarding hint → Pattern → Reveal → Reply
```

## How to run

```bash
npm run verify
npm run dev
```

Default port: `5173`. The verify pipeline is the same gate CI uses.

## What's new vs. the baseline spec

- `src/product/viralTeaser/` — pure curiosity-teaser generator with 8
  templates (playful + mysterious). [ADR
  0005](ADR/0005-viral-teaser-message.md).
- `src/features/onboarding/` — inline hint + on-demand 3-step tour, with
  per-flag feature toggles. [ADR
  0007](ADR/0007-hybrid-onboarding.md).
- `src/core/storage/onboardingStore.js` — first-run state with safe
  fallback to memory.
- WhatsApp is the primary share CTA, frozen by a static CI gate.
  [ADR 0006](ADR/0006-whatsapp-first-share.md).
- New CI gates: `whatsapp-first-check`, `teaser-presence-check`,
  `html-head-check`, `a11y-check`. Architecture check is now
  import-aware.
- Service worker bumped to `codemoji-x-shell-v2` and now removes stale
  caches on activation.
- Auto-deploy workflow on push to `main`
  (`.github/workflows/pages-deploy.yml`), with a post-deploy live
  smoke step.

## Implementation note

The product remains dependency-free vanilla ES modules. This is
intentional: the ZIP is immediately runnable without installs and
nothing in the build pipeline depends on the network at runtime. The
architecture preserves the Preact/Vite migration seam if we ever need
a richer component model.

## CI

`.github/workflows/ci.yml` runs `npm run verify` on every PR and push
to `main`. `.github/workflows/release.yml` ships to GitHub Pages on
tag pushes. `.github/workflows/pages-deploy.yml` ships to GitHub Pages
on every push to `main` and follows up with a live smoke test.

## Known V1 limits

- No backend.
- No one-time reveal.
- No expiry.
- No server-side abuse control.
- No media upload.
- No accounts.
- No analytics (the share pipeline returns `teaserId` so future
  consented analytics can attribute outcomes without logging content).


## 2026-05 Sharing Transport Fix

### What changed

- Added `src/core/transport/shareText.js` as the single transport-text sanitizer.
- `whatsappUrl()` now guarantees the capsule URL appears exactly once, even when the payload text already contains it.
- `whatsappUrl()` strips `U+FEFF` BOM and `U+FFFD` replacement characters before encoding the WhatsApp draft text.
- `telegramUrl()` now sends the URL through Telegram's `url` parameter and removes it from the text parameter to avoid duplication.
- Manual-link textareas now use aggressive wrapping so long fragment URLs do not push mobile layout horizontally.
- Added unit/e2e tests for URL de-duplication and BOM/replacement-character sanitation.

### Product decision

The current static-first product cannot produce a truly short WhatsApp link because the ciphertext lives inside the URL fragment. A real short link requires a capsule store: `https://app/s/{id}#k={key}`. See `docs/ADR/0009-link-compaction-and-device-vault.md`.

### CI status

`npm test` passes after the patch.
