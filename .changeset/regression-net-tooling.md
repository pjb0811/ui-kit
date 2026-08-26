---
---

Phase 3 regression net (ui-kit#294): CI-only tooling, no published package change.

Adds three mechanical guards that run after `build` in CI, extending the same
"one cheap tripwire per proven failure class" pattern as
`check-dynamic-classes`:

- **`check-api-surface`** — asserts `package.json` and `package.publish.json`
  expose the same `exports` subpaths (the exact drift that shipped as #277)
  and snapshots the exported names + subpaths, failing on unrecorded changes.
- **`check-preflight-reset`** — asserts the built `dist/style.css` still
  carries the `[data-slot]`-scoped preflight reset that non-Tailwind hosts
  depend on (regression of #253/#256).
- **`check-ssr-smoke`** — server-renders every exported component with minimal
  props and fails on throw (SSR-safety, class of #228).

These live in `packages/ui/scripts/` and are not shipped (`files: ["dist"]`),
so there is no change to the published package — hence an empty changeset.
