---
'@repo/ui': patch
---

Make `RichTextEditor` follow the active theme

The editor stayed a white card with dark text in dark mode. Its shell and
content styles were written against fixed palette steps — `bg-white`,
`text-gray-800`, `border-gray-200`, `bg-gray-100`, `text-blue-600` — which
render identically in both schemes, so nothing about it responded to the theme.
Measured on the docs page: with `data-theme="dark"` the page background went to
`oklch(0.145 0 0)` while the editor stayed `rgb(255, 255, 255)`.

Every colour now resolves from the same tokens the rest of the library uses, so
the editor inherits any theme a `Config` supplies rather than only the default
light one:

- shell: `bg-background text-foreground border-input`, toolbar divider
  `border-input`
- content: `border-border` / `text-muted-foreground` on blockquote, `bg-muted`
  on inline code, `border-border` on `hr`, `text-muted-foreground` on the
  placeholder
- code blocks invert deliberately (`bg-foreground` / `text-background`) — that
  block wants to contrast with the surface, and inverting the tokens keeps it
  legible in either scheme without a `dark:` override
- links drop their colour and keep the underline, matching `Typography.Link`.
  This theme's `--primary` is achromatic, so colouring them would have rendered
  the link at almost the body colour and bought nothing

`RichTextEditor` was the only component in `src/components` still using a fixed
palette this way.
