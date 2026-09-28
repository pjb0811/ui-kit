---
'@repo/ui': patch
---

Delegate the system dark-mode subscription to `@jbpark/use-hooks`' `useMediaQuery`

`Config`'s `theme.dark: 'system'` resolution used a hand-rolled
`matchMedia` + `useSyncExternalStore` subscription that `useMediaQuery` was
extracted from. It now calls `useMediaQuery('(prefers-color-scheme: dark)')`
instead, and the `@jbpark/use-hooks` dependency moves to `^4.1.0`, the first
release that ships the hook. Behaviour is unchanged: the server snapshot is
still `false` (light), and the client value follows the OS setting live.
