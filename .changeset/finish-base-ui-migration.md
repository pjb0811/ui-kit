---
'@repo/ui': major
---

Finish the Base UI migration by replacing the remaining Radix Label and Slot
usage, removing all direct `@radix-ui/*` dependencies, and retiring the shadcn
core drift infrastructure.

`Button`, `Container`, and `Layout.Content` now use Base UI's `render` prop for
composition. Replace `asChild` plus a child element with `render={<Element />}`
and keep the content as children. For `Button`, set `nativeButton={false}` when
the rendered element is not a native button.
