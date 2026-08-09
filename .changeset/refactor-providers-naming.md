---
'@repo/ui': patch
---

Internal refactor: `src/providers/Config/` renamed to `src/providers/config/` (kebab-case, matching every other directory under `src`), with its implementation moved from `index.tsx` into `config.tsx` so `index.ts` is a pure re-export barrel. No public API or behavior change — `Config`/`useConfig`/`DEFAULT_LOCALE` and their exported types are unaffected.
