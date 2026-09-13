---
'@repo/ui': major
---

Update RadioGroup component to use Base UI primitives with repo-owned styling.

Base UI splits Radix's `RadioGroup.Item` into a standalone `Radio.Root` +
`Radio.Indicator`, and its radio renders a `<span>` (plus a hidden `<input>`)
rather than Radix's `<button>`. The button-style `Radio.Group` option now wires
its `Button` through Base UI's `render` prop instead of `asChild`, and the
`Radio` atom forwards div-based host props. The `@radix-ui/react-radio-group`
dependency is dropped.
