# Onboarding

CodeMoji has no signup. The first session is almost always involuntary:
someone got a WhatsApp link. They open the page with no context.

The job of onboarding is to make the bubble feel obvious in under a
second, and to make the "send one back" loop visible without ever
showing a wall of text.

## Surfaces

### 1. Inline hint (default)

A 2-line note rendered above the bubble:

```
השארתי לך סוד
גע בבועה וצייר את הסימן שמישהו רמז עליו
```

- One "איך זה עובד?" link → opens the tour.
- One × button → dismisses the hint, marks `receiveIntroSeen=true`.
- Lives in `src/features/onboarding/OnboardingHint.js`.

For composers (no capsule in the URL) the lead copy is:

```
🔮 סוד אחד. רק עם הסימן שלך הוא נפתח.
```

### 2. On-demand tour

A 3-step modal triggered by the help link. Steps live in
`src/features/onboarding/onboardingCopy.js`:

1. **קח את הבועה** — the secret is not in the link; it's bound to a
   sign.
2. **צייר את הסימן** — drag across the 9-dot grid; the sign is the
   key.
3. **החזר סוד משלך** — the reply CTA is the viral loop.

Esc, backdrop click, or the "דלג" button all close the modal. On
close, `tourSeen=true` is persisted.

## State

`src/core/storage/onboardingStore.js`:

```ts
type OnboardingState = {
  composeIntroSeen: boolean;
  receiveIntroSeen: boolean;
  tourSeen: boolean;
  firstRunAt: string | null; // ISO timestamp, set once
};
```

- Backed by `localStorage` key `cmx.onboarding.v1`.
- Safe fallback: a private-mode / disabled-storage browser keeps state
  in memory so the UI never throws.
- `__resetOnboardingMemory()` is exposed only for tests.

## Feature flags

- `FeatureFlags.onboardingHint` — render the inline hint on first
  visit. Default **on**.
- `FeatureFlags.onboardingTour` — allow the help link to open the
  modal. Default **on**.

Toggle both off to ship an "experts only" build for friends-of-the-team
who already know the flow.

## Adding a tour step

1. Append to `onboardingCopy.tour` in
   `src/features/onboarding/onboardingCopy.js`.
2. Run `npm run verify` — the existing tests assert the modal renders
   each step in order.
