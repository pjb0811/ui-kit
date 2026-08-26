---
'@repo/ui': patch
---

Trim the published dependency graph (#276) with no API or behaviour change:

- **Drop the unified `radix-ui` meta-package** in favour of granular `@radix-ui/react-*` imports. The four `src/core` files that used `radix-ui` (`label`, `radio-group`, `select`, `separator`) now import from their specific packages; `@radix-ui/react-select`, `@radix-ui/react-radio-group`, and `@radix-ui/react-separator` are added as direct dependencies. This stops consumers pulling the entire Radix catalog (~22 unused primitives) for four components.
- **Move `tailwindcss` and `postcss` to `devDependencies`.** Neither is imported at runtime — the package ships precompiled `dist/style.css` — so they no longer install for consumers.
- **Replace `uuid` with a dependency-free monotonic counter** in `upload` and the imperative stack (`Toast`/`Modal`). These ids are internal React keys / handles, not cryptographic, so a counter is sufficient and avoids the runtime dependency (and `crypto.randomUUID`'s secure-context constraint).

Finding 3 from the issue (gsap dual-instance) was investigated and is **not a bug** under the current `unbundle: true` build: `gsap` and `@gsap/react` both resolve the same external `gsap`, so no change was made there.
