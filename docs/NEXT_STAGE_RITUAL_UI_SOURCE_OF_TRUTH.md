# CodeMoji X - Next Stage Source of Truth

Stage: RITUAL_UI_SECURITY_CI
Status: Applied by local DESIGN-gated patch
Design Source: C:\Users\Lior\Desktop\DESIGN
Product Source: docs/PRODUCT_SOURCE_OF_TRUTH.md

## Product truth

CodeMoji is not a landing page and not a dashboard.
It is a tiny secret object that travels through chat and opens with a sign.

Core loop:

Receive secret -> draw sign -> reveal -> send one back

## Stage goal

Improve the existing product without changing its product type.
This stage is a ritual/tactile pass, not a feature expansion.

Focus:

- one-card mobile flow
- clearer write -> draw -> reveal -> reply ritual
- stronger pattern feedback
- safer reveal state
- no technical UI copy
- no backend
- no landing page
- no plaintext/key in URL
- no content analytics

## Design contract

Mood: private, small, warm, magical, tactile.
Visual metaphor: a sealed secret bubble that responds to a hand-drawn sign.
Depth level: 2.5D soft cinematic depth.
Stack: vanilla modular JS + CSS motion. No R3F/Three in this stage.

Reason: real 3D would add weight and risk to a tiny mobile ritual.

## Motion contract

Entrance: soft card/bubble arrival.
Draw: every point gives immediate visual feedback and connects into a trace.
Ready: action becomes visibly available after message + sign.
Unlocking: short breath/pulse.
Wrong sign: short soft shake, then reset.
Reveal: message appears as the reward.
Reduced motion: all animation disabled by media query.

## Security contract

- no plaintext in URL
- no key in URL
- no decrypted message in localStorage
- no secret/message/capsule/pattern logging
- no third-party scripts
- no backend in V1
- share text never includes plaintext

## CI contract

Required checks:

- npm run lint
- npm run typecheck
- npm run test:unit
- npm run test:static
- npm run test:design
- npm run test:security
- npm run build
- npm run test:e2e

No design PASS without product reality + visual reality review.
