---
'@repo/ui': patch
---

Replace `Marquees`' manual ref-merge (`containerRef.current = node; responsiveRef(node);`) with `useMergedRef`, matching the pattern used elsewhere (#185). Fixes the per-render new-function-identity churn that caused `useResponsiveSize`'s callback ref to detach/reattach on every render.
