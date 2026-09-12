---
---

Tooling-only: adds `check-core-drift` (#362), a script that reports when a
vendored `core/*` primitive falls behind its shadcn `new-york-v4` registry
entry, plus a weekly advisory workflow and a baseline snapshot. Lives under
`scripts/` / `.github/` — not shipped in `dist`, so no release is needed.
