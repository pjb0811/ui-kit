---
'@repo/ui': minor
---

Let DatePicker, Checkbox, Select and RichTextEditor take `aria-label`, `aria-labelledby`, `aria-describedby` and `aria-invalid` on the element that receives focus, so an external label or error message can be linked to them. DatePicker also accepts `id` for its trigger. Checkbox now puts `id` and these `aria-*` props on the checkbox control instead of the wrapper `div`. With `icons`, the focusable icon is named by its visible label.
