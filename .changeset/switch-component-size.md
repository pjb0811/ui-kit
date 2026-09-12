---
'@repo/ui': minor
---

Align `Switch.size` with the shared `ComponentSize` contract (#350)

`Switch` now uses the library-wide `small | middle | large` vocabulary and reads
`Config`'s `componentSize` as its fallback, like `Button` and `Space`.

- Adds a `large` step and honours `<Config componentSize="large">` (previously
  ignored — `Switch` stayed at its own default).
- `middle` is the canonical spelling; `medium` keeps working as a deprecated
  alias of it (to be removed in the next major). `size="medium"` and
  `size="small"` render exactly as before.
