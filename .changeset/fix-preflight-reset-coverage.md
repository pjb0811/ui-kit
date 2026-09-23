---
'@repo/ui': patch
---

Cover the rest of the library with the non-Tailwind-host preflight reset

The library ships no global preflight on purpose, so `globals.css` carries a
self-scoped normalize instead — the one thing standing between a bare
`<button>`/`<input>` and the host's UA defaults on a host that runs no Tailwind
of its own (the docs site, plain Vite, any consumer that only imports our
stylesheet). Two independent gaps let controls out from under it.

**The selector never self-matched anything but `button`.** It read
`button[data-slot], [data-slot] button, [data-slot] input, …`, so a control
that _is_ the slot root with no slotted ancestor above it matched nothing:
`core/input.tsx`'s `<input data-slot="input">` and `core/textarea.tsx`'s
`<textarea data-slot="textarea">` both fell through. Measured on the docs site,
`Input` rendered in Arial and `Input.TextArea` in monospace instead of the page
font. The prefix is now the same `:where([data-slot], [data-slot] *)` the
box-sizing rule beside it already used.

**Several components emitted no `data-slot` at all.** The whole `Layout` family
was bare, so `Layout.Sider`'s collapse trigger rendered as a UA button —
`appearance: auto`, a 2px outset border, `#efefef`, Arial 13.3px — inside an
otherwise correctly styled demo. `Input.Search`'s clear button was in the same
position. `Layout`, `Layout.Header`, `Layout.Sider` (and its trigger),
`Layout.Content`, `Layout.Footer`, `Input.Search` (and its clear button),
`Checkbox`, `Radio` and `Upload` now all carry one.

The regression net grew a matching contract. `check-ssr-smoke` used to ask only
"does this registered component still emit its `data-slot`?", which a family
that never had one passes vacuously; it now walks the rendered markup and
fails on any visible `<button>`/`<input>`/`<select>`/`<textarea>` with no
`data-slot` on itself or an ancestor. Compound parts (`Input.Search`,
`Layout.Sider`, …) are rendered individually rather than only when some
parent's fixture happens to include them — which is why neither button was
covered before.
