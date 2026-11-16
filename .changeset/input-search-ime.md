---
'@repo/ui': patch
---

Fix Input.Search running a search when Enter confirms an IME composition (Korean, Japanese, Chinese input). A search now also skips when the caller's `onKeyDown` calls `preventDefault()`.
