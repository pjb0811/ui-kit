---
'@repo/ui': patch
---

Absorb the `Button` and `Tag` single-element primitives (ui-kit#278 ③, #294
Phase 4). Both atoms now render their own native element instead of wrapping
`core/button` / `core/badge`, and the shared a11y/state chassis (focus ring,
`aria-invalid`, flex centering) is extracted to `INTERACTIVE_CHASSIS` so the
absorb relocates that treatment rather than dropping it. `Button` extends the
chassis with `disabled:*`, `outline-none` and icon sizing; `Tag` does not (it is
not disableable). `solid` now carries its `bg-primary` fill explicitly instead
of inheriting it from the core default variant.

Pure refactor: rendered output is byte-identical across the full Button matrix
(6 variants × 3 sizes × 3 shapes × colors + states) and every Tag variant/color,
verified against a pre-refactor render capture. `core/button` stays (its
`buttonVariants` is still used by `core/calendar`); `./core` remains public.
