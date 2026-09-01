---
'@repo/ui': minor
---

Unify the semantic-state axis under `status`. `Modal` and `Toast` now take a
`status` prop (`info | success | error | warning`), matching `Result`'s
vocabulary, instead of spelling the same axis `type`. The old `type` prop stays
as a deprecated alias, so this is **non-breaking** — existing
`type="error"` usage and every `Modal.*` / `Toast.*` call keep working.

`Modal.confirm` is unchanged: `confirm` is an interaction mode (the two-button
footer), not a status, so it stays on its own axis rather than being folded into
`status` (ui-kit#318).
