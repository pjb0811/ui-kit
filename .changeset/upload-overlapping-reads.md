---
'@repo/ui': patch
---

Fix Upload losing files. A batch added while an earlier one is still being read no longer overwrites it, files stay in the order they were added, overlapping additions respect `maxCount`, and removing a file during a read sticks. The dropzone can now be reached with Tab and opened with Enter or Space, and the remove buttons are disabled when `disabled` is set.
