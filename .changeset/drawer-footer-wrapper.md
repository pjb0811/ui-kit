---
'@repo/ui': patch
---

`Drawer`'s `footer` is wrapped in the footer bar again, and `classNames.footer` /
`classNames.extra` do something again.

`Drawer` rendered its `footer` and `extra` slots through
`renderConditional(value, wrapper)`, which returns the value **unwrapped** when
it is already a React element and only calls `wrapper` for strings, numbers and
arrays. A footer is practically always an element, so the wrapper was skipped in
the common case: `DrawerFooter` never mounted, and `classNames.footer` — a
documented prop — silently did nothing. `extra` lost its `shrink-0` wrapper and
`classNames.extra` the same way.

Measured on the docs Drawer demo (`direction="right"`, `size="small"`, 1280px
viewport, so a 384px panel):

|                               | Before                           | After           |
| ----------------------------- | -------------------------------- | --------------- |
| `[data-slot="drawer-footer"]` | absent                           | present         |
| Footer button width           | `384px` (full panel)             | `352px`         |
| Inset from the panel edges    | `0px` / `0px`                    | `16px` / `16px` |
| Pinned to the panel bottom    | no — sat directly under the body | yes (`mt-auto`) |

Without the wrapper the button became a direct child of `drawer-content`, which
is `flex flex-col`; `align-items: stretch` blew it out to the full panel width
with no padding.

`PageHeader`'s `extra` had the identical bug and is fixed the same way — note its
sibling `title`/`subTitle` were already written as plain conditionals.

Both now render as `{value != null && <Wrapper>{value}</Wrapper>}`.
`renderConditional` itself is unchanged: the element opt-out is deliberate for
content slots like `Card`/`Popover`/`List`'s `title`, where forcing the wrapper
would nest a caller-supplied heading inside `<h6>`. It now carries a doc comment
saying so, so a layout wrapper doesn't get routed through it again.

The footer keeps its stacked full-width layout (`flex flex-col`), so a footer
with two buttons still stacks them rather than switching to `Modal`'s
right-aligned row. Override with `classNames.footer` — which now works.
