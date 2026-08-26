---
---

Extend the SSR smoke guard (ui-kit#301) — CI-only tooling, no published package change.

`check-ssr-smoke.mjs` now captures the rendered markup (previously discarded)
and asserts two rendered-output contracts, closing the gap that lets the Phase 4
Button/Tag absorb (#278 ③) drop styling/a11y silently:

- **data-slot contract** — every `[data-slot='X']` selector in `globals.css`
  must have a matching `data-slot="X"` in some component's SSR output. Derived
  from `globals.css`, so it self-maintains as new rules are added. Catches a
  dropped `data-slot="button"` (which would silently unset all 16 button color
  variables and the non-Tailwind-host reset).
- **a11y/state chassis** — `Button` and `Tag` must keep their focus-ring /
  aria-invalid (and, for Button, `disabled:*`) classes in the rendered markup.
  Asserted per-component because Tag's chassis is a strict subset of Button's.

No new dependency, CI step, or turbo task — the check already rendered every
component. Scripts aren't shipped (`files: ["dist"]`), so no release.
