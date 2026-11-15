---
'@repo/ui': patch
---

Keep keyboard focus on a Button while it is loading. A loading button now stays focusable with `aria-disabled="true"` instead of the native `disabled` attribute, so focus no longer drops to the page body when `loading` turns on. Clicks and key presses are still ignored while loading, and the button looks the same. `disabled` without `loading` still renders a natively disabled button.
