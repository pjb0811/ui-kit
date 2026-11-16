---
'@repo/ui': patch
---

Fix the Steps error indicator's icon colour. It used `text-destructive-foreground`, which the theme does not define, so the icon fell back to the inherited colour on the red fill. It is now white, as on a danger Button. Also remove the undefined `text-black-70` class from Modal's imperative body, which had no effect.
