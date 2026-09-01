---
'@repo/ui': minor
---

Widen `Config`'s `defaultProps` beyond `button.shape`. Apps can now set
library-wide defaults for more of the settled prop surface in one place:

- `defaultProps.button.variant` / `defaultProps.button.color`
- `defaultProps.tag.variant` / `defaultProps.tag.color`
- `defaultProps.modal.maskClosable`

Each resolves `explicit prop ?? Config default ?? built-in`, the same order
`Button` already used for `shape` (for `Button`, a call-site `type` shorthand
still wins over the `Config` default). Additive and non-breaking — components
behave exactly as before when no default is set (ui-kit#319).
