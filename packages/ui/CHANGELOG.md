# @repo/ui

## 3.3.0

### Minor Changes

- 4687e9e: Add a new Toast organism component with a shadcn/sonner-style notification card, using ui-kit's existing imperative stack+portal mechanism (matching Modal's pattern). Exposes `Toast.info()`, `.success()`, `.error()`, and `.warning()` trigger functions plus a controlled `<Toast>` component.

## 3.2.1

### Patch Changes

- 061c902: Fix Drawer close button not working: it was rendered via `renderConditional`, which short-circuits on already-valid React elements and skipped the `onClick={onClose}` wrapper, leaving a click handler-less icon.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 3.2.0

### Minor Changes

- e0870f5: Refactor DatePicker and Upload components to use the new Button component, enhancing consistency across the UI.
- 60d8744: Update calendar component to use parentheses for CSS custom properties, improving consistency in styling.

### Patch Changes

- e0870f5: Fix `Upload` and `DatePicker` to compose the existing `Button` atom instead of a raw `<button>`/`buttonVariants` from `src/core`. No public API changes.
- 60d8744: Fix `Calendar`/`DatePicker` rendering squished — `--cell-size` references used square-bracket arbitrary values (`h-[--cell-size]`) which compile without `var()` in this repo's Tailwind v4 setup, producing invalid CSS. Switched to the parenthesis syntax (`h-(--cell-size)`) already used elsewhere in the codebase (e.g. `atoms/button.tsx`).

## 3.1.0

### Minor Changes

- b90770b: Add DatePicker and Upload components to the library, providing users with new options for date selection and file uploads.
- b90770b: Add `Upload` (molecule) and `DatePicker` (atom) components.
  - `Upload`: multi-file drag-and-drop upload with a file list (thumbnail preview + remove), using `@jbpark/use-hooks`'s `useFileToDataUrl` to convert selected files to data URLs
  - `DatePicker`: a `Popover` + `Calendar` composition (shadcn's `react-day-picker`-based `Calendar` core primitive, newly added under `src/core/calendar.tsx`) for single-date selection
  - Add `react-day-picker` and `date-fns` dependencies for the new `Calendar` core primitive

### Patch Changes

- 97f27c1: Switch `List` and `FloatButton.BackTop` to use `@jbpark/use-hooks` instead of `@uidotdev/usehooks` internally (removes the `@uidotdev/usehooks` dependency). No public API or behavior changes.

## 3.0.0

### Major Changes

- 5738070: **BREAKING**: `Swiper` no longer bundles or activates any Swiper feature module. `Autoplay`, `EffectCards`, `Navigation` and `Scrollbar` (and their stylesheets) used to be imported statically and always enabled, which meant every carousel autoplayed by default via `initialOptions`. The component now ships only `swiper/css` and exposes a new `modules` prop (default `[]`) — import the modules you need from `swiper/modules` along with `swiper/css/<module>` and pass them explicitly, otherwise `autoplay` / `navigation` / `scrollbar` / `effect` options are inert. See `packages/ui/src/components/organisms/swiper/README.md` for the migration guide.

  Other changes in this release:
  - `RadioGroup` now owns a single shared Radix radiogroup root instead of wrapping each option in its own, so arrow keys move focus between options. Standalone `Radio`, the `icons` variant and `optionType="button"` groups are unaffected. `Radio` also accepts an optional `id` prop.
  - `Button` no longer calls `preventDefault()` on `mousedown`, restoring native focus-on-click behaviour (buttons now keep focus after a mouse click).
  - `Drawer` reference-counts `document.body.style.pointerEvents` so concurrent mask-less drawers no longer restore a stale value.
  - `List` documents the `scroll.next()` contract: callers must reset `loading` to `false` when a fetch settles, including on failure.

## 2.12.0

### Minor Changes

- 15d7508: Add new props to several components for improved customization and accessibility, including role attributes and keyboard interactions for checkboxes and radios.
- 7fec05c: Remove the unused `enums` subpath export (`TEXT_LEVELS`), which was not referenced by any component internally.

## 2.11.3

### Patch Changes

- f9b81ae: Fix Layout's Footer rendering mid-page instead of after the content when Content is taller than the viewport.
- cc22483: Fix several component bugs found in a follow-up audit: Marquees now measures against its own container instead of `document.body`, Skeleton no longer throws when `loading={false}` with no children, and Checkbox/Radio no longer generate colliding DOM ids when separate instances share the same option value.

## 2.11.2

### Minor Changes

- Add aria-label to BackTop component
- Add role and aria-label to Skeleton component
- Add target and rel props to Link component
- Add context for nested Layout

### Patch Changes

- Update FloatButton styles to remove unnecessary class
- Refactor Search component to manage uncontrolled state
- Simplify Text component className logic
- Update Layout component to handle nested contexts

## 2.11.1

### Minor Changes

- Add aria-label to BackTop component

### Patch Changes

- Remove background color from FloatButton component

## 2.11.0

### Minor Changes

- Add sideEffects configuration for CSS files
- Implement responsive typography scaling for title component

## 2.10.0

### Minor Changes

- Add role attribute to list item component
- Add titleLevel prop to List component
- Add itemKey prop to List component

### Patch Changes

- Change title rendering to use Title component
- Change list rendering to use role attribute

## 2.9.7

### Patch Changes

- Bump version to 2.9.6

## 2.9.6

### Patch Changes

- Version bump only, no code changes. Skips 2.9.0-2.9.5: those version numbers are already published on npm and can't be reused, so this release picks up the next clean number.

## 2.9.0

### Minor Changes

- Add Tag component to documentation
- Add default export paths for Button, Tag, Card, Space, and Layout components

## 2.8.0

### Patch Changes

- Change Typography component path
- Change Menu component path
- Change Reveals component path
- Remove Checkbox.Group
- Change Checkbox.Group path
- Change ColorPicker component path
- Change FloatButton.BackTop component path
- Remove Typography component

## 2.7.0

### Minor Changes

- Add gsap dependency
- Add extra prop to Drawer component
- Add size prop to Drawer component

### Patch Changes

- Improve Drawer component's size style handling

## 2.6.0

### Minor Changes

- Add Splitter component
- Add AGENTS.md documentation
- Add react-resizable-panels dependency

### Patch Changes

- Change Content component from div to main

## 2.5.0

### Minor Changes

- Add `ConfigProvider` export (supports nested theme token overrides and dark mode configuration)

### Patch Changes

- Update Button, Switch, and shared theme styles to reflect provider-based theme values
- Add Storybook stories covering token overrides, dark mode, and nested provider usage

## 2.4.0

### Minor Changes

- Add `optionType` (`'default' | 'button'`), `buttonStyle`, `size`, `disabled` props to `Radio.Group` (button-style radio rendering)
- Add `type` (`'primary' | 'default' | 'dashed' | 'text' | 'link'`), `shape` (`'default' | 'circle' | 'round'`) props to `Button`
- Add `size` (`'small' | 'medium'`) prop to `Switch`
- Add `checkedChildren`, `unCheckedChildren` props to `Switch` (animated label rendering)
- Expose `children` slot on core `Switch` primitive

### Patch Changes

- Change `Radio.Group` default orientation from `'vertical'` to `'horizontal'`
- Change `Button` to derive `variant` from `type` via the internal `typeToVariant` mapping when `variant` is not specified
- Move `OptionValue` type to the `Group` module, re-export from both `Radio` and `Checkbox`
- Apply `iconClasses`-based SVG sizing utility to icon-only `Button` size handling

## 2.3.4

### Patch Changes

- Clean up build pipeline: switch to tsdown config, adjust CSS output naming, update TS build settings

## 2.3.3

### Patch Changes

- Fix core export destructuring error in field component

## 2.3.2

### Patch Changes

- Support both namespace and direct import styles for core primitives

## 2.3.1

### Minor Changes

- Expose core primitives via package exports

## 2.3.0

### Minor Changes

- Add new components

### Patch Changes

- Improve component API

## 2.2.2

### Patch Changes

- Clean up versioning (no functional changes)

## 2.2.1

### Patch Changes

- Clamp Progress value to the 0–100 range for rendering stability

## 2.2.0

### Minor Changes

- Add Radio, Select, ColorPicker components

### Patch Changes

- Improve Popover, Progress, Switch, Textarea styles and options

## 2.1.0

### Minor Changes

- Add Popover placement option

### Patch Changes

- Refactor component architecture to a centralized core export structure
- Improve conditional rendering pattern in Card, Drawer
- Change Button, Checkbox, Input, Progress, Skeleton, Switch to use the new core import structure

## 2.0.1

### Patch Changes

- Clean up versioning

## 2.0.0

### Major Changes

- **(Breaking change)** Improve `Button` variant and color handling

## 1.1.7

### Patch Changes

- Improve Marquees width handling and responsiveness

## 1.1.6

### Minor Changes

- Add `Input` component export

## 1.1.5

### Patch Changes

- Remove unused external dependency from tsdown config

## 1.1.4

### Patch Changes

- Update README language links

## 1.1.3

### Patch Changes

- Restrict CI to main branch only

## 1.1.2

### Patch Changes

- Update publish workflow and scripts

## 1.1.1

### Patch Changes

- Clean up changesets used for versioning

## 1.1.0

### Minor Changes

- Add `Card`, `Label` components

### Patch Changes

- Improve `Button`, `Checkbox`

## 1.0.1

### Patch Changes

- Update build configuration, improve deploy script error handling
- Fix `.gitignore` rules
