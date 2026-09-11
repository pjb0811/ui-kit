---
'@repo/ui': major
---

Rebuild `Tag` on the shadcn `badge` primitive and free the `badge` slot

**Breaking:** `Tag`'s root `data-slot` changed from `badge` to `tag`. CSS that
themed a Tag through `[data-slot='badge']` — the hook documented on the Tag
page — must be updated to `[data-slot='tag']`. Nothing else about the rendered
output changed: same element, same classes, same `--tag-bg` / `--tag-fg` /
`--tag-tint` custom properties, verified identical across a 68-case matrix of
every `variant` × `color` combination plus `asChild` and a custom `className`.

`Tag` keeps its name and its props. The two ecosystems cross here: what shadcn
calls a Badge is what antd — and this library — calls a Tag, and antd's own
`Badge` (a count/dot decorator attached to another element) has no shadcn
counterpart. Renaming `Tag` would have left that component with no name, so the
slot moved instead and `badge` is now free for it.

- `core/badge.tsx` is re-synced with the upstream `new-york-v4` registry entry,
  which it was three changes behind: `rounded-full` and `border-transparent` in
  the base, the added `ghost` and `link` variants, and the emitted
  `data-variant`. Two local adaptations are documented in the file — `Slot`
  comes from `@radix-ui/react-slot` (this repo installs the individual Radix
  packages and has no unified `radix-ui` dependency) and `cn` from
  `@repo/ui/utils`.
- `Tag` wraps that primitive again instead of carrying an absorbed copy of its
  base classes, so it no longer needs `INTERACTIVE_CHASSIS`; `Button` is that
  helper's only remaining consumer.
- The core membership rule in `CLAUDE.md` gains a third criterion for exactly
  this case: a single-element primitive belongs in `core` when keeping the
  upstream file verbatim is what makes shadcn version syncs diffable. The
  absorbed arrangement it replaces is why `core/badge` sat orphaned and stale.
- The SSR smoke test's reset-slot registry is now empty: `[data-slot='tag']` is
  keyed by name in `globals.css`, so the data-slot contract already covers it.
