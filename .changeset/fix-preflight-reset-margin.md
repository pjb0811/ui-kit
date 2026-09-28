---
'@repo/ui': patch
---

Reset UA block margins inside the library's `[data-slot]` subtree

The self-scoped preflight reset restored `box-sizing`, borders and form-control
fonts, but not `margin`, so on a host with no preflight of its own every bare
`<p>` kept the UA `margin-block: 1em`. In a flex column that margin adds to the
declared `gap-*` instead of collapsing into it: `Empty`'s 12px gaps rendered as
26px and 40px, `Result`'s 8px title→subtitle gap as 42px, `PageHeader`'s 2px
title→subtitle gap as 34px, and a title-only `Toast` sat 12px below its status
icon in a box 22px taller than designed.

`globals.css` now zeroes the margin of `p`, `h1`–`h6`, `ul`, `ol`, `dl`, `dd`,
`blockquote`, `figure` and `pre` under the same zero-specificity
`:where([data-slot], [data-slot] *)` prefix, so margin utilities still win.
`Empty`, `Result`, `PageHeader` and `Toast` had no `data-slot` at all and now
carry one, as do `Menu`, `Checkbox.Group`, `Typography.Title` and
`Typography.Paragraph`, which the extended rendered-markup contract in
`check-ssr-smoke` caught next (those four already set `m-0` themselves).

This is a visual change for consumers without a preflight: the affected
components now render at their declared spacing.
