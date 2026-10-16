---
'@repo/ui': minor
---

Add placement, update by ID, a loading status, and a visible-toast limit to Toast. Pass `placement` (`top-start`, `top`, `top-end`, `bottom-start`, `bottom`, `bottom-end`) to show toasts in separate stacks; the default stays `bottom-end`. Calling a trigger with the `id` of a shown toast updates it in place and restarts its duration, and `Toast.loading` stays until it is updated or closed. `Toast.config({ maxCount, placement, duration })` sets defaults, with toasts beyond `maxCount` queued rather than dropped. `onClose` now runs at most once per toast, and toasts fit narrow screens.
