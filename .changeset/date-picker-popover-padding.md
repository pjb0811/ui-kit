---
'@repo/ui': patch
---

Remove the doubled padding inside `DatePicker`'s popover

`PopoverContent` carries `p-4` and `Calendar` carries its own `p-3`, so a
`DatePicker` popup stacked both and sat on 28px of inset. Measured in the docs
app: the popup was 336×406 with a 28px gap between its edge and the first
calendar cell; it is now 312×382 with an even 16px inset.

`Calendar` now zeroes its own padding when it renders inside a popover, using
the same `[[data-slot=popover-content]_&]` hook it already used to drop its
background there. Keeping the override scoped this way — rather than removing
`p-3` outright — means a standalone `Calendar` is unaffected.

The popover's `p-4` is left alone on purpose: it is the only padding the other
two consumers get. `ColorPicker` wraps `react-colorful`, which renders with no
padding of its own (verified: still 234×234 with a 16px inset after this
change), and the rich-text-editor link popover holds a bare input row.
