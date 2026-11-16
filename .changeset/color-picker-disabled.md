---
'@repo/ui': patch
---

Keep a disabled ColorPicker closed. Clicking it used to open the popover (the colour could not be changed, but the picker appeared and the trigger reported `aria-expanded="true"`). A disabled picker now stays closed even with a controlled `open`, and setting `disabled` closes a picker that is open.
