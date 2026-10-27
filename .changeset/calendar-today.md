---
'@repo/ui': minor
---

Fix a hydration mismatch in Calendar when the server and the browser are in different time zones. Calendar now marks today from the browser's clock after hydration, so the server-rendered HTML carries no today marker. A new `today` prop sets the date to mark from the first render; pass the same value on the server and in the browser. When no month, value or default is given, Calendar also opens on `today`'s month.
