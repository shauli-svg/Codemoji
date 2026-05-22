# Security Model

## User-facing truth

Allowed:

- הסוד לא גלוי בלינק.
- הוא נפתח עם הסימן.
- הפיענוח קורה במכשיר.
- אנחנו לא שומרים את ההודעה.

Forbidden:

- Military-grade security.
- Impossible to break.
- Private forever.
- Secure for highly sensitive information.

## Technical rules

- No plaintext in URL.
- No key in URL.
- No decrypted message in localStorage.
- No analytics on content.
- No console logging secrets.
- No third-party trackers in V1.

## Future backend rule

If a backend is added, it stores encrypted capsules only and never receives plaintext or the raw pattern.
