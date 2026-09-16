---
'@repo/ui': patch
---

Center the checked dot inside `Radio`

The selected dot sat 7px above the middle of its control, hard against the top
edge. Measured on the docs page: the 8px dot's centre was 7px off the 16px
control's centre.

Base UI's `Radio.Root` renders a `<span role="radio">` where Radix rendered a
`<button>`, and the markup carried over from the Radix version unchanged in
#381. That markup centered the dot by absolutely positioning it at `top-1/2`
inside the indicator — which collapses to zero height, since its only child is
out of flow. A `<button>` centers its content through the UA's own anonymous
box, so a zero-height indicator still landed on the centre line; a span gets no
such treatment, and as a flex item of the surrounding `Field` its display is
blockified to `block`, so the indicator stacked at the top and took the dot
with it.

`RadioGroupItem` now centers explicitly with `inline-flex items-center
justify-center` — matching `core/checkbox`, which was adapted this way during
the same migration — and the dot stays in flow instead of being positioned
against a zero-height parent. Verified in the docs app: the dot is now exactly
centred on both axes, and the indicator measures 8px tall rather than 0.
