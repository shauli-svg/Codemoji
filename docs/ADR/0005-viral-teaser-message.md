# ADR 0005 — Viral Teaser Message

## Context

CodeMoji's primary distribution surface is WhatsApp. The default share
text ("קיבלת סוד. צייר את הסימן כדי לפתוח.") is correct but generic. In
a noisy chat feed, a generic line is easy to ignore. Curiosity, not
explanation, is what makes a stranger tap.

## Decision

Every share goes through a pure, deterministic teaser generator
(`src/product/viralTeaser/`). The generator selects one of a curated
template pool (Hebrew first, mobile-line short, includes an emoji
curiosity hook). Selection is random at runtime; tests pass a seed for
determinism.

The generator is product-policy, not transport-policy: it lives under
`src/product/`. The transport layer composes the final shape per
channel (WhatsApp / Telegram / native share / clipboard).

## Alternatives considered

- A single hardcoded share string. Rejected — easy to ignore, no room
  to iterate or A/B.
- AI-generated teaser per share. Rejected for V1 — adds a network
  dependency that breaks the "zero friction, no backend" north star and
  introduces content moderation risk.
- Emoji-only message. Rejected — no micro-instruction; receivers don't
  know what to do.

## Consequences

Positive:

- Variation by default (8 templates today, easy to grow).
- Pure module, fully testable, no DOM or network.
- Per-channel formatting is centralised.
- CI gate (`teaser-presence-check`) enforces ≥5 templates, both moods,
  Hebrew + pictographic content.

Negative:

- The pool is hand-curated. Quality depends on us.
- Without analytics (V1 has none) we cannot yet learn which template
  performs best. The `teaserId` is returned to the caller so future
  experiments can attribute outcomes once consented analytics ships.

## Reversal condition

If telemetry (post-consent) shows a single template clearly dominates
across audiences, collapse the pool to that template plus 1-2 backups.
