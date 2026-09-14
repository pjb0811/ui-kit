---
'@repo/ui': major
---

Update Dialog component to use Base UI primitives with repo-owned styling.

Radix's `Dialog.Overlay`/`Dialog.Content` become Base UI's `Dialog.Backdrop`/
`Dialog.Popup`, and open/close styling moves to Base UI's `data-starting-style`/
`data-ending-style` transition hooks (the old Radix `data-[state]:animate-*`
classes were inert here). Pointer-outside dismissal (antd's `maskClosable`) is
now a root-level `disablePointerDismissal` concern rather than a
`Content`-level `onPointerDownOutside` handler; `organisms/modal` is updated to
match. The themed portal container, `OVERLAY_LAYER`, and the
`closable`/`closeIcon`/`classNames.mask` custom props are preserved. The direct
`@radix-ui/react-dialog` dependency is dropped (it remains transitively via
`vaul`, which the drawer still uses).
