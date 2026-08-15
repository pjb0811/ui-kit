---
'@repo/ui': patch
---

Fix `Modal`/`Toast`'s shared imperative stack renderer to use `useSyncExternalStore` instead of an effect-registered `forceUpdate`. Previously, updates pushed between a container's first render and its effect mount (a real gap, since the imperative API is called outside the React render cycle) could be silently dropped, and reading the external `stack` array directly in the render body risked tearing under concurrent rendering. Also fixed a related bug where `render()` mutated `state.stack` in place via `.push()`, which would have defeated `useSyncExternalStore`'s reference-equality change detection — pushes now produce a new array.
