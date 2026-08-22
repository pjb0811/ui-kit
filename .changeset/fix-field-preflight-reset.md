---
'@repo/ui': patch
---

Fix FieldSet/FieldLegend/FieldError's error list rendering with UA default border/margin/padding (a UA groove border around FieldSet, extra padding on the legend and error list) in non-Tailwind hosts — a spot #254 missed when it restored the preflight reset removed in #252.
