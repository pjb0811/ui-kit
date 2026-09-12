---
---

Docs-only: documents the irreducible local patches on `core/switch`,
`core/progress`, and `core/accordion` (#361). Each carries a change that reaches
into the primitive's sub-tree — the switch thumb/label, the progress indicator's
inline style for vertical direction, and the accordion's chevron replacement —
so it can't be moved out to a consumer like `checkbox`/`radio-group` were, and
is documented in place (as #363 did for the four structural primitives). No
behaviour, API, or declaration change — intentionally no release.
