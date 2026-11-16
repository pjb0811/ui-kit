---
'@repo/ui': patch
---

Stop Menu from selecting a parent item. Clicking or pressing Enter on an item with `children` (expanding a group in `inline` mode, for example) used to call `onSelect` and replace the current selection with the group. It now only toggles or opens the submenu and calls `onClick`; `onSelect` fires for leaf items only. A parent is still shown as selected when one of its descendants is.
