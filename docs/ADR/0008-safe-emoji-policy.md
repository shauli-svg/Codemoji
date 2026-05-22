# ADR 0008 — Safe Emoji Policy for User-Visible Strings

## Context

CodeMoji X is delivered to recipients through WhatsApp. The viral hook
is a single emoji that signals "an unusual object has arrived for you".
If that emoji renders as a tofu box (`U+FFFD`, the "diamond with a
question mark inside" replacement glyph), the entire viral loop
collapses — the recipient sees a malformed message and ignores the link.

Real failure observed in production: a share line built with `🫧`
(BUBBLE, Emoji 14.0, 2021) and `🪩` (DISCO BALL, Emoji 13.0, 2020)
rendered as tofu on Android 10–11 devices, on iOS 14 and below, and on
WhatsApp Desktop installations with stale system fonts. None of these
are exotic configurations; they're a non-trivial slice of the user base.

## Decision

User-visible product strings may only contain emojis from **Emoji 5.0
(2017) or earlier**. This rule applies to:

- `src/product/copy.js`
- `src/features/onboarding/onboardingCopy.js`
- `src/product/viralTeaser/teaserTemplates.js` (`emoji` field and
  `body` field)

A CI gate (`tests/static/forbidden-emojis-check.mjs`) enumerates known
fragile codepoints and fails the build on any reintroduction. The list
is conservative and grows over time as new fragile codepoints are
identified in the wild.

Secret message content typed by users is **not** subject to this rule:
people may write whatever Unicode they want; that text is end-to-end
opaque to the share pipeline.

## Alternatives considered

- Restricting to BMP-only symbols (✦ ✧ ❤ ★ ♥ ♪ etc.). Rejected — the
  visual register is too cold for a playful product.
- Falling back to a colored SVG sprite per emoji and rendering inline.
  Rejected — increases bundle size and breaks WhatsApp's preview line,
  which is plain text and cannot embed SVG.
- Detecting recipient platform via UA sniffing and serving different
  teaser text. Rejected — wa.me does not give us a hook to do that;
  the message is composed before any recipient context exists.

## Consequences

Positive:

- Universal rendering on every WhatsApp surface, including stale
  desktop installations.
- A bright-line rule that's easy for new contributors to follow.
- CI fails fast on regression, well before any user is affected.

Negative:

- Some "fresh" emojis (e.g. 🫧 bubble, 🪩 disco ball, 🪄 magic wand) are
  off the table even though they fit the brand. We accept this; the
  product magic comes from the secret-opening ritual, not from the
  novelty of a specific codepoint.

## Reversal condition

When telemetry (post-consent) shows < 1% of the recipient population
running an OS or WhatsApp build that predates Emoji 13.0, the rule
may be relaxed to Emoji 13.0+. Until then, the static gate is law.
