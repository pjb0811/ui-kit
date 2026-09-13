---
'@repo/ui': patch
---

Migrate Popover to Base UI while preserving its public props and themed portal container. Delegate arrow positioning to Base UI so it follows collision-adjusted placement, including in DatePicker.

For custom trigger components that render a non-button element, pass `nativeButton={false}`. Intrinsic non-button elements are detected automatically.
