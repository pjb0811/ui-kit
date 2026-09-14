---
'@repo/ui': major
---

Rebuild Drawer on Base UI's Dialog primitives and drop the `vaul` dependency
(#375, Decision #2). The side-sheet is now a Dialog whose popup is anchored to
an edge and slides in/out via `data-starting-style`/`data-ending-style`.

Breaking:

- `vaul`'s drag-to-dismiss and snap points are gone. The `handlebar` remains as
  a visual affordance on bottom drawers but is no longer draggable, and the
  `Drawer` organism's `draggable` prop is removed.
- The core `Drawer` speaks Base UI's Dialog API (`Backdrop`/`Popup`); `direction`
  is a `DrawerContent` prop surfaced as `data-direction` (replacing vaul's
  `data-vaul-drawer-direction`). Outside-press dismissal is a root concern
  (`disablePointerDismissal`), and `mask` maps to Base UI's `modal`.

Removing `vaul` also drops the last transitive `@radix-ui/react-dialog`, so the
package no longer depends on any Radix primitive.
