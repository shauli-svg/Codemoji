# ADR 0003 — No Backend in V1

## Context

CodeMoji X must prove the secret ritual before infrastructure grows.

## Decision

V1 uses no database, no accounts, and no remote capsule store.

## Alternatives considered

- Full backend from day one
- Account-based messaging
- Public feed / dashboard-first product

## Consequences

Positive:
- faster launch
- smaller operational surface
- easier local/static hosting

Negative:
- no one-time reveal, no server rate limits, no remote moderation tools

## Reversal condition

The product needs expiry, media, abuse control, or identity.
