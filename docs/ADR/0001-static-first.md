# ADR 0001 — Static First

## Context

CodeMoji X must prove the secret ritual before infrastructure grows.

## Decision

V1 ships as a static app with URL-fragment capsules and local browser crypto.

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
- no server-side expiry or one-time reveal in V1

## Reversal condition

A backend becomes justified by expiry, abuse control, media, accounts, or analytics with consent.
