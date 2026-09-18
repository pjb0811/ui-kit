---
'@repo/ui': patch
---

Add a `check-data-theme-dark` regression check that asserts the built stylesheet still keys dark mode off `[data-theme='dark']`, the marker every Docusaurus host depends on. No runtime change.
