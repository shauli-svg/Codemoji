# Viral Loop

CodeMoji's growth model is one tap on WhatsApp, one tap to open a
bubble, one tap to send a secret back. Everything in this document
exists to keep that loop frictionless.

## Stages

```text
[Sender]      Compose secret → Draw sign → Share sheet (WhatsApp first)
   ↓
[WhatsApp]    Teaser line + URL appears in chat
   ↓
[Recipient]   Tap link → Bubble drops in → Inline hint
   ↓          Draw sign → Reveal animation
   ↓
[Recipient]   "שלח סוד בחזרה 🫧" → becomes a sender
```

## Teaser pool

Located in `src/product/viralTeaser/teaserTemplates.js`.

- **Playful mood**: crystal+sparkles, shush+crystal, gift+unlock, finger+dizzy
- **Mysterious mood**: crystal+shush, gem+lock, moon+scroll, candle+shush

Each template:

- Hebrew first (UI audience).
- ≤ 140 chars (single mobile preview line).
- Includes a mature secret/code hook and must not require pictographic or emoji hooks.
- Uses **only Emoji 5.0 or older codepoints** — recipients on stale
  Android / iOS / WhatsApp Desktop fonts render Emoji 13.0+ as
  `U+FFFD` ("diamond with question mark"). The static gate
  `forbidden-emojis-check` enforces this list.
- Never uses technical jargon (`teaser-presence-check` enforces).
- Pairs an emoji opening with a one-line "tap & draw" instruction so
  even a stranger on WhatsApp knows what to do.

Selection is uniform-random at runtime; tests pass a `seed` for
determinism. Add a template by appending to the array — the CI gate
re-validates structure and emoji content automatically.

### Forbidden emoji (production hazard)

If any of these slip into a template body, copy.js, or onboardingCopy,
CI fails immediately:

| Codepoint  | Emoji | Name         | First in   |
| ---------- | ----- | ------------ | ---------- |
| U+1FAE7    | 🫧    | BUBBLE       | Emoji 14.0 |
| U+1FAA9    | 🪩    | DISCO BALL   | Emoji 13.0 |
| U+1FA84    | 🪄    | MAGIC WAND   | Emoji 13.0 |
| U+1FA9E    | 🪞    | MIRROR       | Emoji 13.0 |
| U+1FAE0    | 🫠    | MELTING FACE | Emoji 14.0 |
| U+1FA77    | 🩷    | PINK HEART   | Emoji 15.0 |

See [ADR 0008](ADR/0008-safe-emoji-policy.md) for the rationale.

## Channels

| Channel    | URL contained in text? | Notes                                              |
| ---------- | ---------------------- | -------------------------------------------------- |
| WhatsApp   | yes (separate line)    | `wa.me/?text=…` — preview unfurls the link.        |
| Telegram   | yes (in `url=` param)  | `t.me/share/url?url=…&text=…`.                     |
| Native     | no                     | `navigator.share` appends the URL itself.          |
| Clipboard  | yes                    | Manual fallback; whole teaser + URL is copied.     |

The `buildSharePayload(url, { channel })` API is the single source of
truth. The ShareSheet renders a `<pre>` preview block of the WhatsApp
variant so the sender sees what the recipient will see.

## Telemetry roadmap

V1 ships **no analytics**. The teaser generator already returns a
`teaserId` so a future consented-analytics layer can attribute
clickthroughs without ever logging content. Activation is gated by
`FeatureFlags.analytics` (currently `false`).

## Anti-spam roadmap

V1 has no server, therefore no rate limit. Future server-side controls
(expiry, one-time reveal, abuse score) are seamed via
`src/core/storage/futureCapsuleStore.js` but disabled in V1. See
[ADR 0003](ADR/0003-no-backend-v1.md).
