---
'web': patch
---

Fix dark mode toggle not reaching `<body>` — the page background/text color stayed light while ui-kit components inside it went dark, because the `.dark` class was only applied to a wrapper nested inside the page content instead of `<html>`.
