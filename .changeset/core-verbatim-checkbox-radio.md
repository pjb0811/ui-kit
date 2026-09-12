---
'@repo/ui': patch
---

Make `core/checkbox` and `core/radio-group` upstream-verbatim (#361)

Moves the presentational local patches out of two vendored primitives so they
match their shadcn `new-york-v4` registry entries and can be re-synced with
`shadcn add --overwrite`. Public API and rendered output are unchanged.

- `core/checkbox`: restore upstream's `rounded-[4px]`; the atom
  (`atoms/checkbox`) now contributes `rounded-sm` through its own `cn()` stack
  (same radius — Tailwind `rounded-sm` == 4px — and tailwind-merge lets it win).
- `core/radio-group`: drop the `asChild` branch; the button-style radio in
  `atoms/radio/group` renders `RadioGroupPrimitive.Item` directly (same
  `data-slot`), so the primitive is the plain dot item again.

The drift check (#362) now reports both as `in sync`.
