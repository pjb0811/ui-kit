---
'@repo/ui': patch
---

Document how `data-ui-root` and the shared overlay z-index interact

The README now explains the other half of the `data-ui-root` recommendation.
Overlays and in-flow chrome (sticky/fixed `Layout.Header`, `FloatButton`,
Dropdown menus) share `z-index: 1000`, so without an isolated root that chrome
paints over a host dialog with a lower z-index, such as shadcn's `z-50`.
Marking the root lets any overlay the host portals to `body` cover the whole
app. No runtime change.
