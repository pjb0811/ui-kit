---
'@repo/ui': minor
---

`Space` now honours the global `componentSize` from `Config`. When `size` is
left unset it falls back to `<Config componentSize>` before the built-in
`middle`, matching `Button`'s resolution order — so a single
`<Config componentSize="large">` sizes both. An explicit `size` (including
numeric/array gaps) still wins, so this is non-breaking (ui-kit#317).
