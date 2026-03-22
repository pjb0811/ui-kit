---
'@repo/ui': minor
---

### Added

- Add `optionType` (`'default' | 'button'`) and `buttonStyle`, `size`, `disabled` props to `Radio.Group` for button-style radio rendering
- Add `type` (`'primary' | 'default' | 'dashed' | 'text' | 'link'`) and `shape` (`'default' | 'circle' | 'round'`) props to `Button`
- Add `size` (`'small' | 'medium'`) prop to `Switch`
- Add `checkedChildren` and `unCheckedChildren` props to `Switch` for animated label rendering
- Expose `children` slot in core `Switch` primitive

### Changed

- `Radio.Group` default orientation changed from `'vertical'` to `'horizontal'`
- `Button` now resolves `variant` from `type` prop via internal `typeToVariant` mapping when `variant` is not explicitly set
- `OptionValue` type moved to `Group` module and re-exported from parent for both `Radio` and `Checkbox`
- Icon-only `Button` sizing updated to include SVG size utilities via `iconClasses`
