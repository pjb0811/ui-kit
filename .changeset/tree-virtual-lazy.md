---
'@repo/ui': minor
---

Add opt-in virtual rendering, lazy branch loading, and click-to-expand to Tree. Nodes accept `leaf` to mark unloaded or forced-leaf branches; `loadData` loads children with per-node pending, failure, and retry states and an abort signal; `virtual` with `height`, `itemHeight`, and `overscan` renders a bounded window; `actionRef.scrollTo` scrolls to a visible key; and `onExpand` also receives the requested node and state. Config `locale` gains `loadFailed` and `retry`.
