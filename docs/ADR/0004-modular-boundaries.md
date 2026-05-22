# ADR 0004 — Modular Boundaries

## Context

CodeMoji X must prove the secret ritual before infrastructure grows.

## Decision

UI, reveal, capsule, crypto, transport, storage, and future backend seams remain separated.

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
- more files than a single prototype app

## Reversal condition

The product remains throwaway and never moves beyond prototype.
