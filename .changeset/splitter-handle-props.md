---
'@repo/ui': minor
---

Add `handleProps` to `Splitter` so you can set your own attributes and handlers (`aria-label`, `id`, `data-*`, `onKeyDown` and so on) on the separators between panels. Pass an object for every separator, or a function that receives the separator's index. `handleProps.className` is merged with `handleClassName`. The `SplitterHandleProps` type is exported.
