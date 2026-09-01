---
'@repo/ui': patch
---

`Radio.Group`'s first option no longer looks misaligned in horizontal
orientation on hosts that style prose lists.

The `<ul>` these groups render already reset `margin`/`padding`/`list-style`
(#253), but their `<li>` children did not. Without preflight, a host's own
list rules still reach the items — Docusaurus/Infima ships
`.markdown li + li { margin-top: 0.25rem }`, which gives every option but the
first a top margin. In a horizontal (flex-row) group that pushes options 2..n
down 4px and stretches the first item's flex line, so the first radio sits
higher than the rest; with `optionType="button"` the first segment ends up 4px
taller than its neighbours. Measured on this repo's own docs site: item 1 at
`y=288.3, h=23.3` vs items 2/3 at `y=292.3, h=19.3`.

The list items in `Radio.Group`, `Checkbox.Group`, `Menu` and `Upload` now
carry that `m-0` reset themselves. `classNames.wrapper`/`classNames.item`
still win, so per-item margins remain overridable.

`Checkbox.Group` also spaces its options with `flex` + `gap` in both
orientations instead of `space-y-2` when vertical. `space-y` works by putting
margins _on the children_, which is exactly what the new reset clears — the
rendered spacing (8px) is unchanged.
