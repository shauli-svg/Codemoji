# Security Disclosure Policy

## Scope

This policy covers the CodeMoji X static web application:

- the released GitHub Pages site (and any equivalent host),
- the source in this repository.

It does **not** cover:

- WhatsApp, Telegram, or any third-party messenger CodeMoji is shared
  through,
- the recipient's browser or device.

## What CodeMoji X promises

- The secret is not visible in the URL.
- The unlock key is not visible in the URL.
- The plaintext is never sent to a server (V1 has no server).
- The plaintext is never stored in `localStorage` or `sessionStorage`.

## What CodeMoji X does **not** promise

- It is not military-grade.
- It is not suitable for highly sensitive personal, financial, legal,
  or medical information.
- It is not safe from someone who guesses or brute-forces a short
  4-9 dot sign.
- It is not safe from an attacker with control over the recipient's
  device.

## Reporting a vulnerability

Please email **security@codemoji.app** (or open a confidential GitHub
security advisory) with:

1. A description of the issue.
2. Steps to reproduce.
3. Affected versions / build IDs (`BUILD_ID.txt`).
4. Suggested fix or workaround, if any.

We aim to acknowledge within 72 hours and to address verified issues
within 14 days. We will credit you in the release notes unless you
prefer to remain anonymous.

## Out of scope (please do not report)

- Brute-force attacks against a captured CM8P link with very short
  signs. PBKDF2 + per-capsule salt slows this but cannot prevent it.
- Social-engineering the recipient into drawing a specific sign.
- Sharing a CodeMoji link in a chat where unauthorized people can also
  read the chat.
