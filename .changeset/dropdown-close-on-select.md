---
'@repo/ui': patch
---

Fix a click-triggered Dropdown staying open. Selecting an item without children now closes the menu after `onClick` and `onSelect` run, and Escape closes the menu from inside it as well as from the trigger. Focus returns to the trigger in both cases. Hover-triggered dropdowns still close when the pointer leaves, as before.
