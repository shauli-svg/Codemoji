# ADR 0002 — Pattern Bound Capsule

## Context

CodeMoji X must prove the secret ritual before infrastructure grows.

## Decision

The unlock key is derived from the receiver pattern plus salt. The key never travels in the URL.

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
- lost sign means the secret cannot be opened

## Reversal condition

A different unlock ritual proves safer and equally low-friction.
