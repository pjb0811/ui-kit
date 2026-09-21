---
'web': patch
---

Stop the docs demos from overflowing narrow viewports

Seven demo pages pushed the whole page sideways on a phone, found by
rendering all 39 pages at 390 / 360 / 320 / 280px and measuring
horizontal overflow: `collapse` (`w-100`, 400px inside a 358px column),
`rich-text-editor` (`w-96`), `skeleton` (`w-80` card), `upload`
(`w-80`), `slider` (`w-72`), plus `modal` and `toast`, whose `Space`
rows never wrapped.

Each fixed width is now `w-full` with a `max-w-*` cap, so desktop
rendering is unchanged while narrow viewports shrink. The
`Skeleton.Node` wrapper takes `w-64 max-w-full` instead — it sits inside
a horizontal `Space`, where `w-full` would make it a flex item that
shrinks to a sliver — and the `modal`/`toast` demos gain `wrap`, which
the `skeleton` demo already had.
