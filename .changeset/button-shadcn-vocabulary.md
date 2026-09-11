---
'@repo/ui': minor
---

Accept shadcn's `variant` / `size` words on `Button`, and rewire it onto
`core/button`

`Button` keeps its own vocabulary and its orthogonal `color` × `variant` axes.
shadcn's words are accepted _in addition_, as sugar in exactly the sense `type`
already is: each expands to a `(color, variant)` pair, and an explicit `color`
still wins over the one the word implies. Nothing existing changes — verified
identical across a 94-case matrix covering every `variant`, `type`, `size`,
`color` and `shape` combination plus `block` / `danger` / `disabled` /
`loading` / icon-only / `htmlType` / custom `className`: zero class differences
and zero attribute differences.

- `variant` also takes `default`, `destructive`, `outline`, `secondary` and
  `ghost`. `link` is deliberately not remapped — it is already one of this
  component's own variants and already renders what shadcn's `link` renders, so
  aliasing it would have changed `variant="link"`'s resolved colour from
  `default` to `primary` for existing callers.
- `size` also takes `xs`, `sm`, `default`, `lg` and the four `icon*` words,
  mapped onto the `small` / `middle` / `large` scale. The `icon*` sizes force
  the icon-only treatment, so the shadcn idiom of passing the icon as
  _children_ (`<Button size="icon"><Trash /></Button>`) renders square — it
  previously needed the `icon` prop with no children.
- `Button` now emits `data-variant` and `data-size` alongside the existing
  `data-color`, matching the core primitive and `Tag`.

**Fixes:** `asChild` threw `Slot failed to slot onto its children` on _every_
call, with or without an icon. A Button renders two children (the icon slot and
the caller's content) and Radix's `Slot` accepts multiple children only when
one is marked `Slottable`; that marker was missing, so `<Button asChild>` was
unusable. Confirmed against 8.1.0 before the fix.

`Button` wraps `core/button` again rather than carrying an absorbed copy of its
cva base. It pins no core variant: passing `variant={null} size={null}` makes
cva skip those axes entirely, so the primitive contributes only its base string
and the atom keeps every colour and size class. `lib/chassis.ts` had no
consumers left after this and is removed — the focus/aria/disabled classes it
held now come from the primitive, and the SSR smoke test still asserts they
survive in the rendered markup.
