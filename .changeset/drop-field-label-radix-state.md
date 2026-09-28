---
'@repo/ui': patch
---

Drop `FieldLabel`'s dead Radix-era `has-data-[state=checked]` classes

`core/field.tsx`'s `FieldLabel` still carried shadcn's choice-card checked
highlight keyed off Radix's `data-state="checked"`. Since the Base UI migration
nothing emits that attribute (Base UI marks checked controls with a bare
`data-checked`), and the only consumer, `Radio`, renders the label beside its
item rather than around it, so the three classes could never match. They are
removed, which also drops three unused rules from `dist/style.css`. No visual
change.
