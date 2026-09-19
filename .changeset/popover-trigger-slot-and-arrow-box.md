---
'@repo/ui': patch
---

Fix `Popover`'s trigger losing its button styling and its arrow rendering inside the popup

Two regressions from the Base UI migration, both visible on the docs site's
Popover page.

**Trigger.** `atoms/popover.tsx` passed `data-slot="popover-trigger"` to
`Popover.Trigger`. Base UI merges the trigger's own props _over_ the element
given to `render`, so that attribute replaced the child's `data-slot="button"`
— and every `[data-slot='button']…` rule in `globals.css` stopped matching.
`--btn-bg`, `--btn-fg` and `--btn-border` were then all undefined, so
`border-[color-mix(in_oklch,var(--btn-border),transparent_50%)]` became invalid
at computed-value time and fell back to `currentColor`: measured on the docs
site, an outlined trigger rendered `rgb(10, 10, 10)` where the same button on
the Button page renders `oklch(0.5555 0 none / 0.5)`. A colored trigger
(`bg-(--btn-bg)`, `text-(--btn-fg)`) lost its fill entirely. The attribute was
referenced nowhere in the repo, so it is simply dropped; Base UI still marks
the element with `data-base-ui-click-trigger` and the `aria-*` pair.

**Arrow.** The arrow's `<svg>` was inline, so it sat on a text baseline and the
wrapper took the popup's line-height rather than the SVG's height — measured
18×26 instead of 18×9. That broke both offsets and rotation: the
`data-[side=…]:-top-2` / `-bottom-2` offsets are sized for a 9px box, and
`rotate-90`/`rotate-180` spin about the box centre. On all four placements the
triangle landed _inside_ the popup (11px past the top edge on `bottom`) instead
of protruding from it. Marking the SVG `block` collapses the line box; the
existing offsets — including the `13px` on the horizontal sides, which is half
of 18 plus 4 — then resolve as originally intended, an ~8px protrusion with a
1px overlap that hides the popup border.
