# @repo/ui

## 5.4.6

### Patch Changes

- 4878b72: Trim the published dependency graph (#276) with no API or behaviour change:

  - **Drop the unified `radix-ui` meta-package** in favour of granular `@radix-ui/react-*` imports. The four `src/core` files that used `radix-ui` (`label`, `radio-group`, `select`, `separator`) now import from their specific packages; `@radix-ui/react-select`, `@radix-ui/react-radio-group`, and `@radix-ui/react-separator` are added as direct dependencies. This stops consumers pulling the entire Radix catalog (~22 unused primitives) for four components.
  - **Move `tailwindcss` and `postcss` to `devDependencies`.** Neither is imported at runtime — the package ships precompiled `dist/style.css` — so they no longer install for consumers.
  - **Replace `uuid` with a dependency-free monotonic counter** in `upload` and the imperative stack (`Toast`/`Modal`). These ids are internal React keys / handles, not cryptographic, so a counter is sufficient and avoids the runtime dependency (and `crypto.randomUUID`'s secure-context constraint).

  Finding 3 from the issue (gsap dual-instance) was investigated and is **not a bug** under the current `unbundle: true` build: `gsap` and `@gsap/react` both resolve the same external `gsap`, so no change was made there.

## 5.4.5

### Patch Changes

- 48d4383: Fix the `exports` map drift between `package.json` and `package.publish.json`. The published manifest exposed a `./enums` subpath that resolved to `./dist/enums.mjs` — a file that is never built (there is no `enums` entry in `tsdown.config.ts` and no `enums` source), so importing `@jbpark/ui-kit/enums` always failed. Meanwhile `./providers` — which _is_ built (`dist/providers.mjs`) and is exported in the dev manifest — was missing from the published manifest, leaving it unreachable for published consumers. Drop the dead `./enums` subpath and add the missing `./providers` subpath so the published surface matches what is actually built.

## 5.4.4

### Patch Changes

- d10bd91: Normalize the library's own components in hosts without Tailwind preflight (e.g. Docusaurus). Since the package intentionally ships no global preflight, bare interactive/form elements kept the host's UA defaults — a `<button>` rendered with a 2px `outset` border, native `appearance`, and the UA button font (Arial) instead of the page font. A self-scoped normalize in `@layer base`, limited to the `[data-slot]` subtree, restores just the needed preflight bits (box-sizing, border width/style, appearance, font/color inheritance) without touching the host's own elements.

## 5.4.3

### Patch Changes

- 1285042: Fix dark mode not activating in `[data-theme='dark']` hosts (Docusaurus/Infima). The dark theme tokens and the `dark:` variant were gated only on the `.dark` class, so consumers that toggle dark mode via `html[data-theme='dark']` never applied them — primary/token-driven buttons and other components rendered with light values on a dark page. The `dark` custom variant and the dark token block now also match `[data-theme='dark']`, while keeping the existing `.dark` convention.

## 5.4.2

### Patch Changes

- 06b8e13: Fix FieldSet/FieldLegend/FieldError's error list rendering with UA default border/margin/padding (a UA groove border around FieldSet, extra padding on the legend and error list) in non-Tailwind hosts — a spot #254 missed when it restored the preflight reset removed in #252.

## 5.4.1

### Patch Changes

- 4956b80: Fixed a regression from #252 (dropping global preflight): Checkbox.Group, Radio.Group, Upload's file list, Menu (and its submenu), and Typography.Title/Paragraph had no `list-style`/`margin`/`padding` reset of their own — they'd only ever gotten it for free from preflight. In a non-Tailwind host, they now render correctly again instead of picking up UA-default indentation and block margins.

## 5.4.0

### Minor Changes

- a880521: Stop shipping Tailwind's global preflight (and the global `body {}` rule) in `@repo/ui/style.css`.

  `@import 'tailwindcss'` pulled in preflight — a document-wide reset (`*, ::before, ::after { margin: 0; box-sizing: border-box; border: 0 }` plus bare-tag resets on headings, lists, buttons, etc.). Because the library ships this compiled into `style.css`, importing the package flattened the spacing/typography of any host page (e.g. a Docusaurus/Infima docs site) — a leak, not the library's job. The `body { background/color }` rule leaked similarly, painting the host's `<body>`.

  **What changed**

  - `style.css` now imports only Tailwind's `theme` and `utilities` layers (no `preflight`).
  - The `@layer base` now contains only the border/outline **color** defaults (`* { border-color; outline-color }`), which restore the design tokens for bare `border`/`outline` utilities. This is color-only, sits in the low-priority `base` layer, and never affects layout.

  **Consumer impact / migration**

  - Apps that run their own Tailwind (import `tailwindcss` themselves) are unaffected — they already provide preflight.
  - Consumers that relied on `@repo/ui/style.css` alone for a CSS reset should add their own preflight (`@import 'tailwindcss'`, or `tailwindcss/preflight.css`) and set their own `body` colors. This repo's Storybook (`apps/docs`) and `apps/web` were updated accordingly.

### Patch Changes

- 12d3962: Fix `Modal`/`Toast`'s shared imperative stack renderer to use `useSyncExternalStore` instead of an effect-registered `forceUpdate`. Previously, updates pushed between a container's first render and its effect mount (a real gap, since the imperative API is called outside the React render cycle) could be silently dropped, and reading the external `stack` array directly in the render body risked tearing under concurrent rendering. Also fixed a related bug where `render()` mutated `state.stack` in place via `.push()`, which would have defeated `useSyncExternalStore`'s reference-equality change detection — pushes now produce a new array.
- 83b3006: Replace `Marquees`' manual ref-merge (`containerRef.current = node; responsiveRef(node);`) with `useMergedRef`, matching the pattern used elsewhere (#185). Fixes the per-render new-function-identity churn that caused `useResponsiveSize`'s callback ref to detach/reattach on every render.
- 05a2b1e: Extract `Marquees`' and `Item`'s duplicated pause-on-hover state/handlers into a shared `usePauseOnHover` hook, and add `onFocus`/`onBlur` alongside `onMouseEnter`/`onMouseLeave` so keyboard-focused users can also pause the marquee — previously only mouse hover could pause it, leaving keyboard users with no way to stop a marquee containing links or buttons.
- 35040fc: Replace the deprecated `useThrottle` alias with `useThrottledValue` in `Marquees`. No behavior change — internal cleanup ahead of `@jbpark/use-hooks` removing the alias in a future major version.
- 4b8333c: Fix Switch label text contrast against its track background. The label color is now conditional on checked state (`text-primary-foreground` when checked, `text-foreground` when unchecked) instead of a hardcoded `text-white`, which was unreadable against the light track color used in dark theme.

## 5.3.0

### Minor Changes

- fc5318f: Update dependencies to latest versions.

## 5.2.0

### Minor Changes

- b33322e: Radio and checkbox components now support keyboard navigation with Enter and space keys.

## 5.1.0

### Minor Changes

- 0934544: Components now support internationalization with locale-aware text and aria-labels.
- 0e98d57: Imperative stack components now inherit theme and locale from the root Config, allowing for consistent styling and behavior across the app.
- e088884: A sider component now correctly handles nested layouts and sider components without intervening layouts.
- f05e281: Added support for responsive grid layout with mobile-first cascade, allowing for dynamic column and offset values based on breakpoint tiers.

## 5.0.0

### Major Changes

- 774442c: **Breaking:** `ThemeConfig.dark` is now `'light' | 'dark' | 'system'` instead of `boolean`. Migration: `dark: true` → `dark: 'dark'`, `dark: false` → `dark: 'light'`. Passing the old boolean silently resolves to "not dark" instead of erroring, so this needs a manual update, not just a type-check catch.
  - `'system'` follows `prefers-color-scheme` live via `useSyncExternalStore`
  - Unlike the old boolean, an explicit `'light'`/`'dark'` on a nested `Config` now also correctly opts out of an ancestor `Config`'s dark mode (previously impossible, since shallow theme merging couldn't distinguish "child didn't set dark" from "child wants it off")

  Also in this release:
  - `useConfig().isConfigured` distinguishes "no `Config` ancestor" from "wrapped in a `Config`, even one with no props set"
  - `ThemeToken` gains `--btn-*`/`--sidebar-*`/`--chart-*`/`--font-*` mappings

### Minor Changes

- 9bec162: Buttons now respect the global component size configuration.
- 3a8a383: Dark mode theme tokens can now be overridden on a per-key basis, allowing for more fine-grained control over dark mode styling.
- 809f220: Added support for per-component default props, allowing components to customize their default behavior.
- d4310c9: Added support for right-to-left (RTL) layouts, allowing components to automatically adapt to RTL direction.
- 07e183f: You can now pass a style object to the Config component.

## 4.1.0

### Minor Changes

- 879ba7b: All portal-based primitives (Dialog, Drawer, Popover, Select) now inherit their container from the nearest Config, allowing them to be themed and dark-mode aware.

### Patch Changes

- 8e6e350: Internal refactor: `src/providers/Config/` renamed to `src/providers/config/` (kebab-case, matching every other directory under `src`), with its implementation moved from `index.tsx` into `config.tsx` so `index.ts` is a pure re-export barrel. No public API or behavior change — `Config`/`useConfig`/`DEFAULT_LOCALE` and their exported types are unaffected.

## 4.0.0

### Major Changes

- 7dd9da6: **Breaking:** `packages/ui`'s `peerDependencies` now require `react`/`react-dom` `^19.0.0` (React 18 support dropped). This is needed so `Layout`/`Header`/`Content`/`Footer`/`Sider` can forward `ref` to their root DOM element via React 19's automatic ref-as-prop (no `forwardRef` needed) — under React 18, a plain function component silently drops `ref` without `forwardRef`, so supporting both would have meant either shipping broken ref support on React 18 or wrapping every component in `forwardRef`.

  Also in this release:
  - `Sider`'s collapse trigger now has `aria-expanded`/`aria-controls` for assistive tech
  - `Header` gains a `position?: 'sticky' | 'static' | 'fixed'` prop (defaults to the previous `sticky` behavior)
  - `templates/index.ts` now re-exports `LayoutProps`/`ContentProps`/`FooterProps`/`HeaderProps`/`SiderProps`

### Minor Changes

- 5595db9: All UI components now support localization with internationalized labels for accessibility and user experience.
- 7bbf8d3: Use the reusable Container component to standardize the mx-auto max-w-7xl px-4 wrapper for app content.
- 7efd0ec: Add support for rendering a Content component as a child element, allowing for nested layouts and improved accessibility.
- 91dec7d: Add a reusable Empty component for displaying placeholder content when no data is available.
- f912e4a: Add grid layout components, including Row and Col, for building responsive UI templates.
- 69cf10f: Add a reusable PageHeader component for displaying title, subtitle, and extra content with a back button.
- 6219b09: Add a Result component for full-page success/failure/404/403 state screens.
- 51e0dde: Add support for responsive sider component with customizable breakpoint.
- 4c7f653: Add support for placing a sider on the right side of the layout.
- 83c519c: Add ARIA attributes to list items and toast notifications for improved accessibility.
- 52aa0e9: Create a reusable imperative stack component for rendering and destroying container-scoped React roots, used by Modal and Toast components.
- 2d033c4: Add a controlled state to the Sider component, allowing users to customize the collapse behavior with the onCollapse prop.

## 3.8.0

### Minor Changes

- 3b8fcef: Add a new feature to check for dynamically-constructed class strings in cn() calls, and warn when duplicate option values are found in Radio.Group and Checkbox.Group components.
- 92f2db3: New backward-compatible features and exports have been added to the UI component library.

### Patch Changes

- e32b2cb: **Migration note for 3.4.0:** `Button`'s `htmlType` now defaults to `'button'` instead of the browser's native default of `'submit'`. This was shipped in 3.4.0 without a migration note — if your `<Button>` was relying on the old implicit-submit behavior inside a `<form>` (i.e. you never passed `type`/`onClick` and expected clicking it to submit the form), add `htmlType="submit"` explicitly to restore that behavior.

## 3.7.0

### Minor Changes

- 55cd85c: Upload component now generates unique IDs for uploaded files to prevent key collisions when removing files.

### Patch Changes

- 8ec0f37: Fixed four Layout bugs: `Sider` wrapped in a Fragment or a custom component is now detected so the layout switches to a row correctly, `Header` now has a default background so scrolled content no longer shows through it, `Sider`'s z-index no longer outranks a sticky `Header`, and `Sider`'s `trigger={null}` now actually hides the built-in trigger icon.
- 8ec0f37: `Config`'s wrapper element now uses `display: contents` so it no longer breaks flex/grid layouts or height chains in the wrapped subtree, and its theme memoization is now keyed off the serialized theme value instead of object identity, fixing unnecessary re-renders of every `useConfig()` consumer whenever an ancestor re-rendered.

## 3.6.0

### Minor Changes

- fcec8af: Added support for multiple mask-less overlays opening at once, improved accessibility for modals and toasts, and fixed issues with list rendering and swiper slide detection.
- 01f6f9c: Added support for customizing the appearance of skeleton elements with the `classNames` prop.

## 3.5.0

### Minor Changes

- 9b629da: Update @jbpark/use-hooks to version 3.0.0 and rename `isIntersecting` to `isIntersecting` in the `useIntersectionObserver` hook.

### Patch Changes

- d7fab2d: Adopt more `@jbpark/use-hooks` 3.0.0 hooks: `useMergedRef` (BackTop/Search), `useFileDrop` + `useControllableState` (Upload), `useTimeout` (Toast — fixes a stale-closure bug in the auto-dismiss timer), `useEventListener` (Marquee Item). Also removes the unused `react-use` dependency.

## 3.4.0

### Minor Changes

- 9f357fb: Color picker and date picker components now support a disabled state, preventing user interaction and visual changes to indicate the component is not interactive.
- 27e0a38: The BackTop component now correctly tracks and scrolls the window that renders it, even when portaled into an iframe.
- d4cb7aa: Update @jbpark/use-hooks to version 2.11.0.
- dbac99b: Updated checkbox, radio, and switch components to use useControllableState for controlled and uncontrolled state management.
- 04d4848: Add support for antd-style visual presets and native button types to the Button component.
- 0137c09: Add support for option groups to checkbox and radio components, enabling users to group related options together.
- dcb6851: The DatePicker component now supports a controlled open state, allowing users to customize the display of the date picker.
- 4dbba22: Add native form field names to checkboxes and radios, enabling participation in FormData when set.
- 66d42a6: Add support for disabled state to checkbox and radio components, and color picker and select components.
- a6c9944: Add support for ref to the Input component.
- 97682bb: RadioGroup components now support rendering Button elements as radio buttons, enabling real radio semantics and improved accessibility.
- e31008d: Skeleton and Spin components now support custom class names and styles.

### Patch Changes

- c49a0a1: Fix internal event handling in Checkbox and Radio components to trigger state changes directly without relying on DOM element IDs.

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
