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

The per-module files still ship in `dist/core/*` as private chunks. Only the
public `./core` entry (its barrel `dist/core.mjs` + the `exports` map entry, in
both `package.json` and `package.publish.json`, and the `tsdown` entry) is
removed. The API-surface snapshot drops from 13 to 12 subpaths.

Internally, the 17 components that build on core primitives now import it by
relative path (`../../core`) instead of the `@repo/ui/core` specifier. That
specifier resolves for `packages/ui`'s own build via the tsconfig alias, but
apps that bundle `@repo/ui` from source (the Docusaurus `docs`/`web` apps)
resolve it through the package `exports` map, so it fails once `./core` is no
longer exported. A `no-restricted-imports` lint rule now enforces this, since
the specifier otherwise passes `check-types`, `lint`, and the `@repo/ui` build
and only fails later in the app builds. `packages/ui`'s `lint` script gained
`--max-warnings 0` (matching `apps/web`) so the rule can actually fail CI —
the shared config routes every rule through `eslint-plugin-only-warn`, so
without it a violation is reported but exits 0.
