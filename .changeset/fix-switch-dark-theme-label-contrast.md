---
'@repo/ui': patch
---

Fix Switch label text contrast against its track background. The label color is now conditional on checked state (`text-primary-foreground` when checked, `text-foreground` when unchecked) instead of a hardcoded `text-white`, which was unreadable against the light track color used in dark theme.
