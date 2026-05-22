שמור את זה בשם:

docs/CODEMOJI_X_ARCHITECTURE_CI_SPEC.md
# CodeMoji X — Architecture, CI, Modularity & Future Backend SPEC

Version: CMX-ARCH-1.0  
Status: Board/Engineering Approval Candidate  
Product Mode: Secret-first, receiver-first, static-first  
Primary Build Target: Web/PWA, mobile-first  
Initial Runtime: Static hosting  
Future Runtime: Optional backend, modular, non-monolithic  

---

# 0. Executive Decision

CodeMoji X is not a website.

CodeMoji X is a tiny secret-message ritual:

```text
Receive secret → draw sign → reveal → send one back

The architecture must preserve that simplicity while preventing the codebase from becoming a single tangled app.js.

The system will be built as a modular frontend platform with clear internal boundaries, strict CI gates, and future backend seams.

V1 ships without:

accounts
database
backend
public feed
analytics-heavy infrastructure
media upload
dashboards
marketplace

But V1 must be architected so that V2/V3 can add:

one-time reveal
expiry
abuse control
media payloads
QR
skins/packs
accounts
analytics
database
backend services

without rewriting the product.

1. North Star
Product sentence
CodeMoji — סוד קטן שנפתח עם הסימן שלך.
User loop
Sender writes a secret.
Sender draws a sign.
CodeMoji creates a secret capsule.
Sender shares via WhatsApp / Telegram / native share / copy.
Receiver taps.
Receiver sees a secret object.
Receiver draws the sign.
Secret reveals.
Receiver sends one back.
Non-negotiable UX law
The secret is the interface.

No landing page.
No explanation wall.
No technical language.
No visible encryption dashboard.
No raw URL by default.

2. Architecture Principles
2.1 Deep simplicity outside, strict boundaries inside

The user sees one magical object.

The codebase has separated modules.

User experience: simple
Internal architecture: modular
Operational pipeline: strict
Future platform: extensible
2.2 Static-first, backend-ready

V1 does not need a backend.

But V1 must not block a future backend.

The frontend should talk to interfaces, not hardcoded assumptions.

Example:

interface CapsuleStore {
  saveCapsule?(capsule: Capsule): Promise<CapsuleRef>;
  readCapsule?(ref: CapsuleRef): Promise<Capsule>;
}

In V1, this is unused or local-only.

In V2, it can become API-backed.

2.3 No monolith

Forbidden:

index.html + styles.css + app.js with everything inside forever

Allowed for quick prototype.
Not allowed for product.

The product must be organized by layers and features.

3. Recommended Stack
3.1 V1 stack
TypeScript
Vite
Vanilla Web Components or lightweight React/Preact
CSS Modules or scoped CSS
Vitest
Playwright
ESLint
Prettier
GitHub Actions
Static hosting
PWA optional
3.2 Why this stack
Fast static deployment
Easy GitHub Pages / Cloudflare Pages / Netlify
Strong CI
No vendor lock-in
No backend required
Easy migration to API-backed app later
Good browser crypto support
Small bundle possible
3.3 Framework decision

Preferred:

Preact + TypeScript + Vite

Reason:

Small
Component model
Easy state isolation
Good testability
Less weight than full React
Easier long-term than raw DOM spaghetti

Alternative:

Vanilla TS + custom components

Acceptable only if discipline is high.

4. Repository Structure
codemoji/
  .github/
    workflows/
      ci.yml
      deploy-preview.yml
      release.yml

  docs/
    CODEMOJI_X_ARCHITECTURE_CI_SPEC.md
    PRODUCT_SOURCE_OF_TRUTH.md
    SECURITY_MODEL.md
    ADR/
      0001-static-first.md
      0002-pattern-bound-capsule.md
      0003-no-backend-v1.md
      0004-modular-boundaries.md

  public/
    manifest.webmanifest
    icons/
    og/

  src/
    app/
      App.tsx
      appState.ts
      routes.ts
      bootstrap.ts

    product/
      productTruth.ts
      copy.ts
      limits.ts

    features/
      receive/
        ReceiveScreen.tsx
        receiveMachine.ts
        receive.types.ts
        receive.test.ts

      compose/
        ComposeScreen.tsx
        composeMachine.ts
        compose.types.ts
        compose.test.ts

      reveal/
        SecretBubble.tsx
        PatternGrid.tsx
        revealMachine.ts
        revealAnimations.ts
        reveal.test.ts

      share/
        ShareSheet.tsx
        shareService.ts
        share.types.ts
        share.test.ts

      reply/
        ReplyPrompt.tsx
        replyMachine.ts
        reply.test.ts

    core/
      capsule/
        capsule.types.ts
        capsuleCodec.ts
        capsuleParser.ts
        capsuleVersion.ts
        capsule.test.ts

      crypto/
        crypto.types.ts
        patternKey.ts
        aesGcm.ts
        base64url.ts
        unicode.ts
        crypto.test.ts

      transport/
        transport.types.ts
        whatsapp.ts
        telegram.ts
        nativeShare.ts
        clipboard.ts
        qr.future.ts
        transport.test.ts

      storage/
        storage.types.ts
        localProfileStore.ts
        localSessionStore.ts
        futureCapsuleStore.ts

      config/
        env.ts
        featureFlags.ts

      errors/
        errors.ts
        errorCopy.ts

    platform/
      browser/
        webCrypto.ts
        clipboard.ts
        shareApi.ts
        viewport.ts

      pwa/
        registerServiceWorker.ts

    styles/
      tokens.css
      base.css
      motion.css
      secretBubble.css

  tests/
    e2e/
      receive-reveal.spec.ts
      compose-share.spec.ts
      wrong-pattern.spec.ts
      malformed-capsule.spec.ts
      rtl-ltr.spec.ts

    fixtures/
      capsules.ts
      unicodeMessages.ts

    static/
      architecture-check.mjs
      forbidden-tokens-check.mjs
      bundle-budget-check.mjs

  scripts/
    verify-static.mjs
    generate-build-id.mjs
    validate-architecture.mjs
    smoke-live.mjs

  package.json
  tsconfig.json
  vite.config.ts
  vitest.config.ts
  playwright.config.ts
  eslint.config.js
  prettier.config.js
  BUILD_ID.txt
5. Layered Architecture
5.1 Layer Map
Presentation Layer
  ↓
Reveal Interaction Layer
  ↓
Feature State Machines
  ↓
Capsule Layer
  ↓
Crypto / Encoding Layer
  ↓
Transport Layer
  ↓
Storage / Future Backend Interfaces

No layer reaches upward.

Crypto does not know UI exists.

Transport does not know encryption exists.

UI does not know AES details.

6. Core Modules
6.1 Presentation Layer

Owns:

Secret Bubble UI
typography
motion
RTL/LTR
accessibility
visual skins
responsive layout

Does not own:

crypto
capsule format
WhatsApp details
persistence

Main files:

src/features/reveal/SecretBubble.tsx
src/features/reveal/PatternGrid.tsx
src/styles/secretBubble.css
6.2 Reveal Interaction Layer

Owns:

draw sign
pattern capture
unlock ritual
reveal animation
wrong-sign feedback
future gestures: hold, peel, drag, shake

Does not own:

actual cryptographic derivation
sharing
backend

Contract:

type RevealInput = {
  capsule: Capsule;
  pattern: Pattern;
};

type RevealResult =
  | { ok: true; message: PlainMessage }
  | { ok: false; reason: "WRONG_SIGN" | "MALFORMED_CAPSULE" | "UNSUPPORTED_VERSION" };
6.3 Capsule Layer

Owns:

capsule versioning
compact encoding
parsing
validation
metadata budget
future media references

V1 target capsule:

CM8P.skin.sign.salt.iv.cipher

Important:

The encryption key must not travel inside the URL.

Allowed capsule fields:

type CapsuleV1 = {
  v: "CM8P";
  skin: SkinId;
  hint?: string;
  salt: Base64Url;
  iv: Base64Url;
  cipher: Base64Url;
};

Forbidden:

type ForbiddenCapsule = {
  key: string;
  plainText: string;
};
6.4 Crypto / Encoding Layer

Owns:

pattern-derived key
salt
AES-GCM
base64url
UTF-8
Unicode normalization
grapheme safety
malformed payload handling

Contract:

interface CryptoEngine {
  encryptWithPattern(input: {
    plainText: string;
    pattern: Pattern;
    salt?: Uint8Array;
  }): Promise<EncryptedPayload>;

  decryptWithPattern(input: {
    capsule: CapsuleV1;
    pattern: Pattern;
  }): Promise<PlainMessage>;
}

Hard rule:

Wrong pattern must fail.

Hard rule:

No plaintext in URL.

Hard rule:

No encryption key in URL.
6.5 Transport Layer

Owns:

WhatsApp
Telegram
native share
clipboard fallback
QR later
SMS/iMessage later

Does not own:

capsule internals
UI
crypto

Contract:

interface TransportProvider {
  id: "whatsapp" | "telegram" | "native-share" | "clipboard" | "qr";
  canUse(): boolean;
  send(payload: SharePayload): Promise<ShareResult>;
}

Share payload:

type SharePayload = {
  title: string;
  text: string;
  url: string;
};

Fallback chain:

native share → WhatsApp → Telegram → clipboard → manual copy
6.6 Viral Loop Layer

Owns:

reply prompt
send-one-back CTA
forward challenge later
anti-spam boundaries later
chain logic later

V1 CTA:

שלח סוד בחזרה

Forbidden CTA:

Create encrypted capsule
6.7 Storage Layer

V1:

localStorage/sessionStorage only

Stores only:

local UI preferences
optional local sign profile
recent non-sensitive state
feature flags cache

Never store:

plaintext message history
decrypted secrets
remote user identity
sensitive analytics

Future interface:

interface LocalProfileStore {
  getProfile(): Promise<LocalProfile | null>;
  saveProfile(profile: LocalProfile): Promise<void>;
  resetProfile(): Promise<void>;
}
6.8 Future Backend Interface

Do not implement in V1.

But define seam:

interface BackendCapsuleService {
  createCapsule(input: CreateCapsuleRequest): Promise<CreateCapsuleResponse>;
  resolveCapsule(ref: CapsuleRef): Promise<RemoteCapsule>;
  markOpened?(ref: CapsuleRef): Promise<void>;
}
7. State Machines
7.1 App states
BOOT
  → HAS_CAPSULE
  → RECEIVE
  → DRAWING_PATTERN
  → DECRYPTING
  → REVEALED
  → REPLY_COMPOSE

BOOT
  → NO_CAPSULE
  → COMPOSE
  → DRAWING_SEND_PATTERN
  → ENCRYPTING
  → READY_TO_SHARE
7.2 Receive machine
idle
  → capsule_detected
  → waiting_for_pattern
  → decrypting
  → revealed
  → reply_prompt

Failure states:

wrong_pattern
malformed_capsule
unsupported_version
crypto_unavailable
7.3 Compose machine
empty
  → writing_secret
  → drawing_pattern
  → encrypting
  → ready_to_share
  → shared
8. Feature Flags

Feature flags must exist from day one.

export const FeatureFlags = {
  secretBubbleV1: true,
  patternBoundCapsule: true,
  localProfile: false,
  qrShare: false,
  oneTimeReveal: false,
  expiry: false,
  mediaPayloads: false,
  backendCapsuleStore: false,
  analytics: false,
};

Rules:

Experimental future features stay off.
CI can assert forbidden features are not active in V1.
Feature flags are not a substitute for architecture.
9. Future Database Plan
9.1 No DB in V1

Reason:

V1 must prove Open → Reveal → Reply before infrastructure grows.
9.2 DB becomes justified only when product needs one

Approved triggers:

one-time reveal
expiry
abuse control
server-side rate limits
media payload references
creator packs
accounts
group unlock
remote templates
analytics with consent
9.3 Future DB candidates
Option A — Supabase / Postgres

Best for:

fast build
auth later
row-level security
admin visibility
SQL discipline
Option B — Cloudflare D1 + R2 + Workers

Best for:

edge deployment
tiny serverless footprint
media storage via R2
cheap scale
Option C — Firebase

Best for:

fast realtime features
but risk of messy data model

Recommendation:

Cloudflare Workers + D1 + R2

Reason:

aligns with static/edge philosophy
small operational surface
good for future expiry, media, and abuse controls
does not force full backend monolith
9.4 Future DB schema

Only future. Not V1.

create table capsules (
  id text primary key,
  version text not null,
  capsule_cipher text not null,
  skin text,
  hint text,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  opened_at timestamptz,
  max_opens int default 1,
  open_count int default 0,
  abuse_score int default 0
);

create table capsule_events (
  id uuid primary key default gen_random_uuid(),
  capsule_id text references capsules(id),
  event_type text not null,
  created_at timestamptz not null default now(),
  anonymous_client_hash text,
  user_agent_family text
);

create table creator_packs (
  id text primary key,
  name text not null,
  slug text unique not null,
  config_json jsonb not null,
  created_at timestamptz not null default now()
);
9.5 Future backend API
POST /api/capsules
GET  /api/capsules/:id
POST /api/capsules/:id/opened
GET  /api/packs/:slug
POST /api/report-abuse
9.6 Backend rule

Backend stores encrypted capsules only.

Never store plaintext.

10. CI Pipeline
10.1 CI goals

Every commit must prove:

code compiles
tests pass
architecture boundaries are not violated
forbidden legacy tokens are absent
CM8P remains pattern-bound
no key-in-URL regression
UI copy remains non-technical
bundle stays small
Hebrew/RTL/emoji not broken
share flows still work
malformed capsules fail gracefully
10.2 Required CI stages
1. install
2. format check
3. lint
4. typecheck
5. unit tests
6. crypto tests
7. capsule tests
8. static architecture checks
9. forbidden token checks
10. build
11. bundle budget
12. Playwright e2e
13. artifact upload
14. deploy preview
15. live smoke after production deploy
11. GitHub Actions — ci.yml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  quality:
    name: Quality Gates
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"

      - name: Install
        run: npm ci

      - name: Format check
        run: npm run format:check

      - name: Lint
        run: npm run lint

      - name: Typecheck
        run: npm run typecheck

      - name: Unit tests
        run: npm run test:unit

      - name: Static architecture checks
        run: npm run test:static

      - name: Build
        run: npm run build

      - name: Bundle budget
        run: npm run budget

      - name: Install Playwright
        run: npx playwright install --with-deps chromium webkit

      - name: E2E tests
        run: npm run test:e2e

      - name: Upload dist artifact
        uses: actions/upload-artifact@v4
        with:
          name: codemoji-dist
          path: dist
12. GitHub Actions — release.yml
name: Release

on:
  workflow_dispatch:
  push:
    tags:
      - "v*"

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  release:
    name: Build and Release
    runs-on: ubuntu-latest
    environment:
      name: github-pages

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"

      - name: Install
        run: npm ci

      - name: Full verification
        run: npm run verify

      - name: Build
        run: npm run build

      - name: Configure Pages
        uses: actions/configure-pages@v5

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

      - name: Deploy
        uses: actions/deploy-pages@v4
13. package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "npm run build:id && vite build",
    "preview": "vite preview",

    "build:id": "node scripts/generate-build-id.mjs",

    "format": "prettier --write .",
    "format:check": "prettier --check .",

    "lint": "eslint .",
    "typecheck": "tsc --noEmit",

    "test": "npm run test:unit && npm run test:static && npm run test:e2e",
    "test:unit": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:static": "node tests/static/architecture-check.mjs && node tests/static/forbidden-tokens-check.mjs",

    "budget": "node tests/static/bundle-budget-check.mjs",

    "verify": "npm run format:check && npm run lint && npm run typecheck && npm run test:unit && npm run test:static && npm run build && npm run budget",
    "smoke:live": "node scripts/smoke-live.mjs"
  }
}
14. Static Architecture Check

File:

tests/static/architecture-check.mjs
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function fail(message) {
  console.error("ARCHITECTURE CHECK FAILED:");
  console.error(message);
  process.exit(1);
}

const requiredDirs = [
  "src/core/capsule",
  "src/core/crypto",
  "src/core/transport",
  "src/core/storage",
  "src/features/receive",
  "src/features/compose",
  "src/features/reveal",
  "src/features/share",
  "src/features/reply",
  "src/styles",
  "docs/ADR"
];

for (const dir of requiredDirs) {
  try {
    if (!statSync(join(root, dir)).isDirectory()) {
      fail(`Missing required directory: ${dir}`);
    }
  } catch {
    fail(`Missing required directory: ${dir}`);
  }
}

const forbiddenImports = [
  {
    fileGlob: "src/core/crypto",
    forbidden: ["features/", "styles/", "React", "preact"]
  },
  {
    fileGlob: "src/core/capsule",
    forbidden: ["features/", "styles/", "React", "preact"]
  },
  {
    fileGlob: "src/core/transport",
    forbidden: ["features/reveal", "core/crypto/patternKey"]
  }
];

function listFiles(dir) {
  const full = join(root, dir);
  const out = [];
  for (const item of readdirSync(full)) {
    const abs = join(full, item);
    const rel = join(dir, item);
    if (statSync(abs).isDirectory()) out.push(...listFiles(rel));
    else if (/\.(ts|tsx|js|jsx)$/.test(item)) out.push(rel);
  }
  return out;
}

for (const rule of forbiddenImports) {
  for (const file of listFiles(rule.fileGlob)) {
    const body = read(file);
    for (const token of rule.forbidden) {
      if (body.includes(token)) {
        fail(`${file} must not import or reference ${token}`);
      }
    }
  }
}

console.log("architecture-check: PASS");
15. Forbidden Token Check

File:

tests/static/forbidden-tokens-check.mjs
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function walk(dir) {
  const out = [];
  for (const item of readdirSync(join(root, dir))) {
    const rel = join(dir, item);
    const abs = join(root, rel);
    if (statSync(abs).isDirectory()) out.push(...walk(rel));
    else if (/\.(ts|tsx|js|jsx|html|css|md|json)$/.test(item)) out.push(rel);
  }
  return out;
}

function fail(message) {
  console.error("FORBIDDEN TOKEN CHECK FAILED:");
  console.error(message);
  process.exit(1);
}

const files = [
  ...walk("src"),
  "index.html",
  "public/manifest.webmanifest"
];

const forbidden = [
  "SecretMoji",
  "SM5:",
  "SM7",
  "encryptWithRandomCapsuleKey",
  "decrypt payload",
  "Decrypt payload",
  "payload error",
  "Invalid key",
  "decryption failed",
  "Decryption failed",
  "×§",
  "×¡",
  "×™",
  "ðŸ"
];

for (const file of files) {
  const body = readFileSync(join(root, file), "utf8");
  for (const token of forbidden) {
    if (body.includes(token)) {
      fail(`${file} contains forbidden token: ${token}`);
    }
  }
}

console.log("forbidden-tokens-check: PASS");
16. Bundle Budget Check

File:

tests/static/bundle-budget-check.mjs
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");

const MAX_JS_KB = 180;
const MAX_CSS_KB = 80;

function walk(dir) {
  const out = [];
  for (const item of readdirSync(dir)) {
    const abs = join(dir, item);
    if (statSync(abs).isDirectory()) out.push(...walk(abs));
    else out.push(abs);
  }
  return out;
}

function kb(bytes) {
  return Math.round(bytes / 1024);
}

let js = 0;
let css = 0;

for (const file of walk(dist)) {
  const size = statSync(file).size;
  if (file.endsWith(".js")) js += size;
  if (file.endsWith(".css")) css += size;
}

if (kb(js) > MAX_JS_KB) {
  console.error(`JS budget exceeded: ${kb(js)}KB > ${MAX_JS_KB}KB`);
  process.exit(1);
}

if (kb(css) > MAX_CSS_KB) {
  console.error(`CSS budget exceeded: ${kb(css)}KB > ${MAX_CSS_KB}KB`);
  process.exit(1);
}

console.log(`bundle-budget: PASS js=${kb(js)}KB css=${kb(css)}KB`);
17. Unit Test Requirements
17.1 Crypto tests

Must test:

same message + same pattern + same salt can decrypt
wrong pattern fails
different salt changes cipher
Hebrew survives
English survives
mixed RTL/LTR survives
emoji survives
grapheme clusters survive
malformed capsule fails gracefully
empty message rejected
over-limit message rejected
17.2 Capsule tests

Must test:

CM8P parser
unsupported version
missing salt
missing iv
missing cipher
invalid base64url
metadata budget
no plaintext leakage
no key field allowed
17.3 Transport tests

Must test:

native share available
native share unavailable
WhatsApp URL generation
Telegram URL generation
clipboard fallback
manual fallback copy
raw URL not visible by default
18. Playwright E2E Gates
18.1 Receive → Reveal
Given a valid capsule
When receiver opens URL
Then Secret Bubble appears
When receiver draws correct pattern
Then message reveals
Then CTA says "שלח סוד בחזרה"
18.2 Wrong pattern
Given a valid capsule
When receiver draws wrong pattern
Then message does not reveal
And copy says "זה לא הסימן"
18.3 Compose → Share
Given no capsule
When user writes a secret
And draws a sign
Then capsule is generated
And share CTA appears
And raw URL is not primary UI
18.4 Unicode
Messages:
שלום
hello
שלום hello
אני בא ✨
משהו קטן 🫧

All must roundtrip.

19. Security Model
19.1 User-facing truth

Allowed claim:

הסוד לא גלוי בלינק.
הוא נפתח עם הסימן.
הפיענוח קורה במכשיר.
אנחנו לא שומרים את ההודעה.

Forbidden claim:

Military-grade security.
Impossible to break.
Private forever.
Secure for highly sensitive information.
19.2 Technical rules
No plaintext in URL.
No key in URL.
No decrypted message in localStorage.
No analytics on content.
No console logging secrets.
No third-party trackers in V1.
19.3 Future backend security

If backend is added:

server stores encrypted capsules only
server never receives plaintext
server never receives raw pattern
expiry and one-time reveal are server-enforced
rate limit by anonymous metadata
abuse reporting stores capsule id, not plaintext
20. App Modularity Roadmap
V1 — Static Secret Bubble
static app
CM8P pattern-bound capsule
Secret Bubble UI
compose / receive / reveal / reply
WhatsApp / Telegram / share / copy
no backend
no DB
no accounts
V1.1 — Hardening
more tests
better malformed handling
accessibility
RTL/LTR polish
PWA install
offline shell
V1.2 — Visual Packs, Local Only
skins
themes
animations
no remote marketplace
V2 — Backend Triggered Features

Only if metrics justify it:

one-time reveal
expiry
remote capsule refs
abuse control
basic anonymous analytics
V3 — Media Architecture
image reveal
audio reveal
GIF/sticker skins
QR cards
R2/object storage
media moderation
V4 — Identity / Packs
creator packs
accounts optional
school/classroom packs
group unlock
friend chains
21. Non-Monolithic Rules
21.1 Forbidden architecture
one global state object controlling everything
crypto functions inside UI component
share URL generation inside reveal component
DOM query spaghetti
copy hardcoded across components
capsule parser inside route handler
backend URL hardcoded in components
21.2 Required architecture
feature-local state machines
core pure modules
typed contracts
no upward imports
shared product copy file
central feature flags
static checks enforcing boundaries
22. Architecture Decision Records

Create these files:

docs/ADR/0001-static-first.md
docs/ADR/0002-pattern-bound-capsule.md
docs/ADR/0003-no-backend-v1.md
docs/ADR/0004-modular-boundaries.md

Each ADR must include:

Context
Decision
Alternatives considered
Consequences
Reversal condition

Example:

# ADR 0003 — No Backend in V1

## Context

The product must prove the core loop before infrastructure grows.

## Decision

V1 uses static hosting, URL fragment capsules, local browser crypto, and no database.

## Alternatives considered

- Supabase backend
- Firebase
- Cloudflare Worker capsule store

## Consequences

Positive:
- faster launch
- less operational complexity
- no content storage liability

Negative:
- no one-time reveal
- no expiry
- no server-side abuse control
- no media payloads

## Reversal condition

Backend becomes justified when one-time reveal, expiry, media, abuse control, accounts, or analytics become necessary.
23. Release Gates

A build cannot ship unless all pass:

npm run verify
npm run test:e2e
npm run build
npm run budget

Manual QA:

iOS Safari
Android Chrome
Desktop Chrome
Hebrew
English
Mixed RTL/LTR
Emoji
WhatsApp share
Telegram share
Native share
Copy fallback
Wrong pattern
Malformed capsule
Back button
Refresh after reveal
No raw URL as primary UI

Product QA:

Time to reveal < 10 seconds
One primary action per state
No technical copy
Receiver-first if capsule exists
Reply CTA after reveal
24. Benchmark Checklist
Architecture benchmark
[ ] Layers are separated
[ ] Core modules are pure
[ ] Feature modules own their state
[ ] No crypto in UI
[ ] No UI in crypto
[ ] Transport is independent
[ ] Storage is abstracted
[ ] Future backend has interface seam
[ ] CI prevents regression
Product benchmark
[ ] Starts with secret, not app
[ ] Receiver-first
[ ] One object
[ ] One action
[ ] Reveal is the magic moment
[ ] Reply is the viral loop
[ ] No landing page
[ ] No technical words
Security benchmark
[ ] No plaintext in URL
[ ] No key in URL
[ ] Pattern derives key
[ ] Salt used
[ ] Wrong pattern fails
[ ] Malformed capsule fails gracefully
[ ] No secret logging
[ ] No content analytics
Growth benchmark
[ ] WhatsApp share works
[ ] Telegram share works
[ ] Native share works
[ ] Copy fallback works
[ ] Receiver sees reply CTA
[ ] Product loop creates next message
25. Final Engineering Instruction

Do not start by polishing the existing UI.

Start by creating the architecture skeleton.

Then implement the smallest working vertical slice:

Compose → CM8P capsule → Share → Receive → Draw pattern → Reveal → Reply

Everything else waits.

If a feature does not improve:

Open → Unlock → Reveal → Reply

defer it.

The product is not the app.

The product is the moment the secret opens.


השורה החשובה:  
**זה לא מונוליט, וזה גם לא over-engineering.**  
זה שלד קטן, נקי, עם דלתות לעתיד — אבל בלי לגרור את העתיד לתוך V1.