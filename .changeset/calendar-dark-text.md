---
'@repo/ui': patch
---

Keep Calendar's dates readable under a dark `Config` when the surrounding page sets no text color. Calendar paints its own background, so it now sets the matching text color as well. Inside a popover or card, where its background is transparent, it keeps inheriting the surrounding text color.
