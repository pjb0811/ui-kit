---
'@repo/ui': patch
---

Improve keyboard focus in Menu. Each menu level keeps one Tab stop that follows the last focused item, so Tabbing out and back returns to where you left off. Arrow keys wrap at the ends, Home and End move to the first and last item, and Left/Right are mirrored in right-to-left layouts. Submenus move with Up/Down, including under a horizontal menu.
