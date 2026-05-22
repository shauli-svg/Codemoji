# ADR 0007 — Hybrid Onboarding (Inline Hint + On-Demand Tour)

## Context

CodeMoji's typical first session is involuntary: a friend sent a
WhatsApp link, the recipient tapped it, and now they're staring at an
animated bubble. They have no account, no password, and no context.

A wall-of-text tutorial would violate the "no landing page" rule. Zero
onboarding leaves first-time receivers wondering what to do with the
9-dot grid.

## Decision

Hybrid:

1. **Inline hint** — a single short note ("השארתי לך סוד · גע בבועה
   וצייר את הסימן…") rendered above the bubble, with a discreet "איך
   זה עובד?" link and a dismiss × button.
2. **On-demand tour** — a 3-step modal that explains "take · draw ·
   reply back". Triggered only when the user taps the help link. Esc
   / backdrop / skip all close it.

The state is persisted in `cmx.onboarding.v1` (localStorage with safe
in-memory fallback). Three flags: `composeIntroSeen`, `receiveIntroSeen`,
`tourSeen`. The first run timestamp is set once.

## Alternatives considered

- Automatic 4-second pop-up. Rejected — interrupts the magic moment
  ("a bubble just landed for me").
- Coach marks on every UI element. Rejected — heavy for a single
  9-dot interaction.
- No onboarding. Rejected — first-time receivers ask "what is this?"
  more often than not.

## Consequences

Positive:

- The hint is gentle, dismissable, and never blocks the bubble.
- Returning users see no friction.
- The tour content lives in `onboardingCopy.js` so product can rewrite
  it without code changes.

Negative:

- Two surfaces (hint + tour) means two code paths to test. Both have
  dedicated unit tests.

## Reversal condition

If session telemetry (post-consent) shows the help link is tapped <1%
of the time, retire the modal tour and keep only the inline hint.
