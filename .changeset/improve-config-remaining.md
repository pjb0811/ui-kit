---
'@repo/ui': major
---

**Breaking:** `ThemeConfig.dark` is now `'light' | 'dark' | 'system'` instead of `boolean`. Migration: `dark: true` → `dark: 'dark'`, `dark: false` → `dark: 'light'`. Passing the old boolean silently resolves to "not dark" instead of erroring, so this needs a manual update, not just a type-check catch.

- `'system'` follows `prefers-color-scheme` live via `useSyncExternalStore`
- Unlike the old boolean, an explicit `'light'`/`'dark'` on a nested `Config` now also correctly opts out of an ancestor `Config`'s dark mode (previously impossible, since shallow theme merging couldn't distinguish "child didn't set dark" from "child wants it off")

Also in this release:

- `useConfig().isConfigured` distinguishes "no `Config` ancestor" from "wrapped in a `Config`, even one with no props set"
- `ThemeToken` gains `--btn-*`/`--sidebar-*`/`--chart-*`/`--font-*` mappings
