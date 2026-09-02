---
'@repo/ui': minor
---

Add a `Slider` atom. A numeric-range control built on the Radix `Slider`
primitive (draggable + keyboard-operable), following the existing
`Checkbox`/`Switch` shape: controlled/uncontrolled via `useControllableState`,
with `value`/`defaultValue`/`onChange`, `min`/`max`/`step`, `disabled`, and
`orientation`. Pass a bare `number` for a single thumb or a `[min, max]` tuple
for a two-thumb range — `onChange` returns the same shape. Consumers no longer
need to hand-roll `<input type="range">` (ui-kit#315).
