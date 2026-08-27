---
'@repo/ui': major
---

**Breaking:** remove the `./core` subpath export, making `src/core` internal
(ui-kit#278 step ④, #294 Phase 5).

`@jbpark/ui-kit/core` is no longer importable by consumers. The `src/core`
primitives (shadcn-style Radix wrappers) were only ever an implementation detail
— nothing outside `packages/ui` imported the subpath, and after the Phase 4
absorb (#278 ③) the single-element primitives (`Button`, `Tag`) no longer even
route through it. Keeping `./core` public only invited consumers to depend on
internals that change without notice.

Internal usage is unchanged: the 17 atoms that build on core primitives still
`import { … } from '@repo/ui/core'`, resolved via the tsconfig alias, and the
per-module files still ship in `dist/core/*` as private chunks. Only the public
`./core` entry (its barrel `dist/core.mjs` + the `exports` map entry, in both
`package.json` and `package.publish.json`, and the `tsdown` entry) is removed.
The API-surface snapshot drops from 13 to 12 subpaths.
