---
'@repo/ui': patch
---

Fix `Calendar`/`DatePicker` rendering squished — `--cell-size` references used square-bracket arbitrary values (`h-[--cell-size]`) which compile without `var()` in this repo's Tailwind v4 setup, producing invalid CSS. Switched to the parenthesis syntax (`h-(--cell-size)`) already used elsewhere in the codebase (e.g. `atoms/button.tsx`).
