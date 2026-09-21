---
'@repo/ui': patch
---

Let `Reveals` and `Skeleton` shrink inside narrow containers

All three components pinned a width that ignored the container, so any
consumer narrower than that width was overflowed outright rather than
reflowed. Measured on the docs pages at a 390px viewport (358px content
column): the `Reveals` demo overflowed by 146px and `Skeleton` by 15px.

`Reveals`' root row was `flex gap-5` with no wrap and no overflow
handling, so it always laid its children out on one line — the demo's
three 160px cards needed 520px. It now wraps.

`Skeleton.Node` carried `min-w-80` over from d2e227d, when those classes
still sat on the `role="status"` wrapper. On the placeholder item it
pins the bar at 320px regardless of the container — it was even
protruding from its own 256px wrapper on desktop. Dropped; the `w-full`
alongside it already does the sizing.

`Skeleton`'s `SIZES` are fixed widths too, so the item now carries
`max-w-full` and the grow wrapper `min-w-0`, letting the bars narrow
instead of overflowing below ~280px.

Verified by re-rendering all 39 docs pages at 390 / 360 / 320 / 280px:
zero horizontal overflow, and no visual change at 1280px.
