---
'@repo/ui': patch
---

Stop `Button` from emitting hardcoded `data-variant="default"` / `data-size="default"`
(ui-kit#308).

The two attributes were literals that never reflected the component's actual props:
a Button rendered with `variant="outlined" size="large"` still emitted
`data-variant="default" data-size="default"`. They were a leftover from the Phase 4
absorb (ui-kit#304), which inlined `core/button.tsx`'s `data-variant={variant}` /
`data-size={size}` while the atom happened to be passing the literal `"default"`.

No consumer-visible behaviour change: because the values were constant, any selector
using them matched exactly the same elements as `[data-slot='button']`, which is
unchanged and remains the documented styling hook. `data-slot="button"` itself is
untouched — the 20 `[data-slot='button'][data-color=…]` rules in `globals.css` that
define the preset-color system depend on it.

This also clears a false positive in the smell check documented in `CLAUDE.md`, which
matched `data-variant="` on the very component it exists to police.
