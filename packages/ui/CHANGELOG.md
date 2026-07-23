# @repo/ui

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.11.0] - 2026-07-23

### Added

- Add sideEffects configuration for CSS files
- Implement responsive typography scaling for title component

## [2.10.0] - 2026-07-22

### Added

- Add role attribute to list item component
- Add titleLevel prop to List component
- Add itemKey prop to List component

### Changed

- Change title rendering to use Title component
- Change list rendering to use role attribute

## [2.9.7] - 2026-07-22

### Changed

- Bump version to 2.9.6

## [2.9.6] - 2026-07-22

### Changed

- Version bump only, no code changes. Skips 2.9.0-2.9.5: those version numbers are already published on npm and can't be reused, so this release picks up the next clean number.

## [2.9.0] - 2026-07-22

### Added

- Add Tag component to documentation
- Add default export paths for Button, Tag, Card, Space, and Layout components

## [2.8.0] - 2026-07-19

### Changed

- Change Typography component path
- Change Menu component path
- Change Reveals component path
- Remove Checkbox.Group
- Change Checkbox.Group path
- Change ColorPicker component path
- Change FloatButton.BackTop component path

### Removed

- Remove Typography component

## [2.7.0] - 2026-07-12

### Added

- Add gsap dependency
- Add extra prop to Drawer component
- Add size prop to Drawer component

### Changed

- Improve Drawer component's size style handling

## [2.6.0] - 2026-07-05

### Added

- Add Splitter component
- Add AGENTS.md documentation
- Add react-resizable-panels dependency

### Changed

- Change Content component from div to main

## [2.5.0] - 2026-04-05

### Added

- Add `ConfigProvider` export (supports nested theme token overrides and dark mode configuration)

### Changed

- Update Button, Switch, and shared theme styles to reflect provider-based theme values
- Add Storybook stories covering token overrides, dark mode, and nested provider usage

## [2.4.0] - 2026-03-22

### Added

- Add `optionType` (`'default' | 'button'`), `buttonStyle`, `size`, `disabled` props to `Radio.Group` (button-style radio rendering)
- Add `type` (`'primary' | 'default' | 'dashed' | 'text' | 'link'`), `shape` (`'default' | 'circle' | 'round'`) props to `Button`
- Add `size` (`'small' | 'medium'`) prop to `Switch`
- Add `checkedChildren`, `unCheckedChildren` props to `Switch` (animated label rendering)
- Expose `children` slot on core `Switch` primitive

### Changed

- Change `Radio.Group` default orientation from `'vertical'` to `'horizontal'`
- Change `Button` to derive `variant` from `type` via the internal `typeToVariant` mapping when `variant` is not specified
- Move `OptionValue` type to the `Group` module, re-export from both `Radio` and `Checkbox`
- Apply `iconClasses`-based SVG sizing utility to icon-only `Button` size handling

## [2.3.4] - 2026-02-10

### Changed

- Clean up build pipeline: switch to tsdown config, adjust CSS output naming, update TS build settings

## [2.3.3] - 2026-02-06

### Fixed

- Fix core export destructuring error in field component

## [2.3.2] - 2026-02-05

### Fixed

- Support both namespace and direct import styles for core primitives

## [2.3.1] - 2026-02-05

### Added

- Expose core primitives via package exports

## [2.3.0] - 2026-02-05

### Added

- Add new components

### Changed

- Improve component API

## [2.2.2] - 2026-02-03

### Changed

- Clean up versioning (no functional changes)

## [2.2.1] - 2026-02-03

### Fixed

- Clamp Progress value to the 0–100 range for rendering stability

## [2.2.0] - 2026-02-03

### Added

- Add Radio, Select, ColorPicker components

### Changed

- Improve Popover, Progress, Switch, Textarea styles and options

## [2.1.0] - 2026-01-28

### Added

- Add Popover placement option

### Changed

- Refactor component architecture to a centralized core export structure
- Improve conditional rendering pattern in Card, Drawer
- Change Button, Checkbox, Input, Progress, Skeleton, Switch to use the new core import structure

## [2.0.1] - 2026-01-26

### Changed

- Clean up versioning

## [2.0.0] - 2026-01-24

### Changed

- **(Breaking change)** Improve `Button` variant and color handling

## [1.1.7] - 2026-01-24

### Changed

- Improve Marquees width handling and responsiveness

## [1.1.6] - 2026-01-18

### Added

- Add `Input` component export

## [1.1.5] - 2026-01-18

### Removed

- Remove unused external dependency from tsdown config

## [1.1.4] - 2026-01-18

### Changed

- Update README language links

## [1.1.3] - 2026-01-17

### Changed

- Restrict CI to main branch only

## [1.1.2] - 2026-01-17

### Changed

- Update publish workflow and scripts

## [1.1.1] - 2026-01-17

### Changed

- Clean up changesets used for versioning

## [1.1.0] - 2026-01-17

### Added

- Add `Card`, `Label` components

### Changed

- Improve `Button`, `Checkbox`

## [1.0.1] - 2026-01-10

### Changed

- Update build configuration, improve deploy script error handling
- Fix `.gitignore` rules
