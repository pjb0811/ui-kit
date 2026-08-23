---
'@repo/ui': patch
---

Fix dark mode not activating in `[data-theme='dark']` hosts (Docusaurus/Infima). The dark theme tokens and the `dark:` variant were gated only on the `.dark` class, so consumers that toggle dark mode via `html[data-theme='dark']` never applied them — primary/token-driven buttons and other components rendered with light values on a dark page. The `dark` custom variant and the dark token block now also match `[data-theme='dark']`, while keeping the existing `.dark` convention.
