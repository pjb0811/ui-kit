---
'@repo/ui': minor
---

Align `Tag`'s `variant`/`color` vocabulary with `Button` (ui-kit#320), **without
breaking existing `Tag` usage**:

- `variant="filled"` is the new canonical spelling of what used to be
  `variant="default"`. `"default"` still works as a **deprecated alias** (renders
  identically) and will be removed in a future major.
- `color` now also accepts `Button`'s shared preset palette (`blue`, `purple`,
  `cyan`, `green`, `magenta`, `pink`, `red`, `orange`, `yellow`, `volcano`,
  `geekblue`, `lime`, `gold`) alongside the existing named states
  (`primary`/`success`/`warning`/`danger`). Presets are backed by the same
  `data-color` custom-property system as `Button` (`--tag-*` mirrors `--btn-*`),
  so a colour word renders the same hue on either component.

The preset list is now shared from `lib/colors` and consumed by both `Button`
and `Tag`. Existing named-state tags render byte-identical (they keep their
bespoke classes and never emit `data-color`), so this is additive and
non-breaking — the vocabulary alignment ships as a minor with a deprecation
window rather than waiting for a major.
