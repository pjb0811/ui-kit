---
'@repo/ui': patch
---

Fix `Marquees` briefly painting its track at the viewport width before the
measurement lands.

`width` was seeded with `'100vw'`. `useResponsiveSize` measures in a layout
effect, so the real container width is known before the first paint, but
`Marquees` copies it into state in a passive effect and then passes it through
`useThrottledValue(width, 200)` — whose leading edge is spent on mount by the
seed itself, pushing the first real value onto the trailing timer. So the seed
is what paints for roughly the first 200ms.

On the docs page that drew the track 1280px wide inside a 703px column: the
whole track was visible for ~190ms, the page grew a transient horizontal
scrollbar (`scrollWidth` 1596 vs `clientWidth` 1280), and then it snapped to the
column width and clipped. Measured from first paint:

|                           | Before                       | After   |
| ------------------------- | ---------------------------- | ------- |
| Track width, first ~190ms | `1280px` (column is `703px`) | `703px` |
| Page horizontal overflow  | `+316px`                     | `0px`   |

The seed is now `'100%'`, which resolves against the container to the same value
the measurement produces (`size.width` minus the container's horizontal
padding), so there is nothing left to snap. Verified at 420 / 768 / 1280 /
1920px viewports: no page overflow on any frame, and the track renders at its
final width from the first paint.

This does not change the throttle, which is still wanted for resize; it only
stops the pre-measurement frames from being wrong.
