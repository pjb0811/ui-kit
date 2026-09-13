---
'@repo/ui': major
---

Update Accordion component to use Base UI primitives with repo-owned styling.

Base UI reshapes the accordion API: Radix's `Accordion.Content` becomes
`Accordion.Panel`, and the root drops `type="single" | "multiple"` in favour of
a `multiple` boolean while modelling the open set as an array for both modes.
`molecules/collapse` is updated accordingly (its public `activeKey`/`onChange`
array contract is unchanged). Single-open mode is now collapsible — clicking the
open panel closes it. The `@radix-ui/react-accordion` dependency is dropped.
