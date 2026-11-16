---
'@repo/ui': patch
---

Fix Anchor losing the clicked link. The scroll-position recalculation ran right after a click and replaced the link, so a short last section could never become current and a smooth scroll briefly highlighted the old section. A clicked link now stays current until its scroll ends (or the user scrolls by hand), at the end of the scroll range the last section in view is current, and `onChange` reports each change once.
