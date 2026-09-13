---
'@repo/ui': major
---

Update Switch component to use Base UI primitives with repo-owned styling.

The underlying element changes from Radix's `<button>` to Base UI's `<span>`
(plus a hidden `<input>`), so `atoms/switch` now forwards span-based host props
instead of button-based ones, and its native `value` attribute is no longer
accepted.
