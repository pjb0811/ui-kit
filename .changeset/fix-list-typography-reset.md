---
'@repo/ui': patch
---

Fixed a regression from #252 (dropping global preflight): Checkbox.Group, Radio.Group, Upload's file list, Menu (and its submenu), and Typography.Title/Paragraph had no `list-style`/`margin`/`padding` reset of their own — they'd only ever gotten it for free from preflight. In a non-Tailwind host, they now render correctly again instead of picking up UA-default indentation and block margins.
