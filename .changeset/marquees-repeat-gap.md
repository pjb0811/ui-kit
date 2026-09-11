---
'@repo/ui': minor
---

Add `gap` to `Marquees`, the space between the repeated copies of a row.

`autoFill` duplicates each row until it covers the container, and those copies
were laid out flush against one another. Any row that spaces its own children —
the common case, a flex row of pills — therefore rendered a visibly tighter seam
than the rest of the track: 12px between pills inside a copy, 0px between the
last pill of one copy and the first pill of the next, repeating at every
boundary.

```tsx
<Marquees speed={40} gap={12} items={[{ key: 0, children: row }]} />
```

`gap` is a px number, defaults to `0` (the previous layout), and is available
per-row through `ItemProps` like `speed` and `autoFill`. It is applied as
trailing padding on every copy rather than a flex `gap` on the track, so the
spacing is uniform at both the copy seam and the boundary between the two loop
halves, with no special case at either end. Because `offsetWidth` is the
border-box width, the measured copy width already includes that padding and the
loop distance stays exact — the scroll remains seamless. Changing `gap` rewinds
the measurement to the container width so the repeat count is recomputed instead
of reusing a count derived from the old copy width.
