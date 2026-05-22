# ADR 0006 — WhatsApp-First Share Order

## Context

CodeMoji V1 is shipped as a static PWA with no native integration. The
"floating bubble inside WhatsApp" experience is achieved indirectly: a
sender taps a WhatsApp button on the share sheet → `wa.me` opens with
the teaser + capsule URL pre-filled → the recipient taps the link →
their browser opens the CodeMoji secret bubble.

In Hebrew-speaking audiences, WhatsApp is far and away the dominant
chat surface. If the share sheet treats every channel equally, the
primary path becomes ambiguous.

## Decision

WhatsApp is the primary CTA on the share sheet. It uses the `primary`
button styling and is rendered first in the DOM order. Native share is
the secondary path so iOS/Android users who prefer iMessage / Signal /
Telegram still have a fast route. Telegram and clipboard remain
visible.

A static check (`whatsapp-first-check.mjs`) asserts that no future
refactor reorders the buttons or downgrades the WhatsApp button to a
non-primary style.

## Alternatives considered

- Native share first. Rejected — on desktop Chrome, `navigator.share`
  is unavailable; the primary CTA would silently break.
- A single mega-button "Share". Rejected — too generic; users like to
  pick their app.

## Consequences

Positive:

- Sender's optimal path is one tap from "secret ready" to a WhatsApp
  draft.
- Recipient sees the same teaser the sender saw (preview block).

Negative:

- The decision is Hebrew-market-biased. If we expand to markets where
  Telegram dominates, this ADR must be revisited.

## Reversal condition

If retention or share-completion telemetry (post-consent) shows native
share converting materially better than WhatsApp on iOS / Android, swap
the order behind a feature flag `FeatureFlags.whatsappFirstShare`.
