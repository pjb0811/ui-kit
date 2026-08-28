---
'@repo/ui': minor
---

`Button`'s `type` prop is now proper syntactic sugar for a `(color, variant)`
pair, matching antd's spec — and is no longer deprecated.

Previously `type` only mapped to a `variant` and left `color` untouched, so
`type="primary"` rendered a _grey_ solid button instead of a primary-coloured
one, and `type="link"` rendered a link-styled button in the default colour.
Measured against antd's documented behaviour (`<Button type="primary">` ≡
`<Button color="primary" variant="solid">`), that mapping was incomplete.

| `type`    | now equivalent to                    | previously           |
| --------- | ------------------------------------ | -------------------- |
| `primary` | `color="primary" variant="solid"`    | `variant="solid"`    |
| `default` | `color="default" variant="outlined"` | `variant="outlined"` |
| `dashed`  | `color="default" variant="dashed"`   | `variant="dashed"`   |
| `text`    | `color="default" variant="text"`     | `variant="text"`     |
| `link`    | `color="primary" variant="link"`     | `variant="link"`     |

**Visible change:** `type="primary"` and `type="link"` now pick up the primary
colour. The other three values are unchanged. Explicit `color` and `variant`
still win over whatever `type` maps to, so `type="primary" variant="filled"`
keeps the primary colour but renders filled, and `danger` still overrides the
resolved colour.

The `@deprecated` marker added in the previous release is withdrawn: `type` and
`variant` are not duplicates on one axis — `type` sets two axes at once, which
is exactly why its value names overlap with `variant`'s.
