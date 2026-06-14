# Stage B - WhatsApp Transport Contract

Stage:
STAGE_B_WHATSAPP_TRANSPORT_ONLY

Base commit:
917f187190729e41bcef35a4e946d840142630e5

Hard workflow rule:
Before every fix, create/update a contract and scan stale contracts/paths/tests first.
No symptom-by-symptom repair loop.
No deletion or replacement of old contracts/paths without explicit scan evidence.

Scope:
WhatsApp transport only.

Allowed:
- Fix replacement characters such as U+FFFD replacement character in WhatsApp text.
- Ensure WhatsApp receives clean UTF-8 text.
- Ensure WhatsApp opens directly to the send/share flow.
- Ensure exactly one capsule URL is included.
- Preserve URL fragment/capsule integrity.
- Keep mature Stage A teaser copy.
- Update tests that still encode old WhatsApp assumptions.

Forbidden:
- No visual redesign.
- No neon/dark/CSS changes.
- No owner-code onboarding.
- No crypto format changes unless a test proves transport corruption.
- No broad refactor.
- No emoji/pictographic teaser rollback.
- No human-click simulation as product logic.

Required gates:
- Unit tests for WhatsApp URL/text encoding.
- Static scan for replacement character and stale contracts.
- E2E share flow.
- verify:deep PASS.
- Worktree clean before commit.
- Screenshot/visual gate only if rendered UI text changes.

Known Stage A stable:
- Commit: 917f187
- Rollback tag: rollback-codemoji-stage-a-hebrew-copy-917f187

Definition of Done:
1. WhatsApp text has no U+FFFD replacement character / replacement characters.
2. WhatsApp share URL decodes to readable Hebrew.
3. Exactly one capsule URL exists.
4. Share preview remains mature and non-childish.
5. No old pictographic/emoji contract returns.
6. verify:deep PASS.
7. Small Stage B commit only.

## Repair 01 - Static self-scan contract

Problem:
The new static gate must detect forbidden runtime/output text without containing those forbidden literals as visible source text.

Rule:
- Static tests may construct forbidden patterns from Unicode escapes or string parts.
- Unit tests may generate U+FFFD at runtime using Unicode escapes.
- Source files, docs, and served copy must not contain visible replacement characters or retired teaser contracts.

## Repair 02 - Runtime bad-character test construction

Problem:
The unit test must exercise BOM / U+FFFD / control-character cleanup without storing a visible U+FFFD character in source.

Rule:
- Generate U+FFFD at runtime with String.fromCharCode(0xFFFD).
- Static scans may forbid visible U+FFFD in source.
- Unit tests must assert readable Hebrew after cleanup.

