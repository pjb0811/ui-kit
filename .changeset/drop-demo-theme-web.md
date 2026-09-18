---
'web': patch
---

Remove the `DemoTheme` wrapper from the docs site. It toggled ui-kit's `.dark` class on `<html>`, which never took effect — Docusaurus owns that attribute through react-helmet-async and rewrites it on every route change. Dark mode was already driven entirely by Docusaurus' own `data-theme` attribute, which ui-kit's selectors accept, so rendering is unchanged.
