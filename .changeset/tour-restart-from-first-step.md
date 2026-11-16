---
'@repo/ui': patch
---

Restart an uncontrolled Tour from `defaultCurrent` each time it opens. Reopening used to resume at the step the tour was closed on, so after Finish it showed only the last step. The reset calls `onChange` with `defaultCurrent`. A controlled `current` is unchanged; control it to resume where the user left off.
