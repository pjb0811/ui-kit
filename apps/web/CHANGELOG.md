# web

## 1.3.0

### Minor Changes

- 13ee60a: Add a controlled panel that slides in from any edge, the Drawer component, with various customization options and a demo.
- 1bd1741: Add a new List component for rendering titled, accessible collections with infinite scroll support.
- f00ccc6: Add a new Modal component with controlled and imperative usage, including a demo and documentation.
- be699ff: Add a Swiper component for rendering touch-friendly carousels from a data array.
- b5e84ce: Add Toast component for imperative, non-blocking notifications with customizable options and API.

## 1.2.0

### Minor Changes

- 1f910c4: New UI components, including Card, Collapse, and Space, have been added to the library, providing users with a set of reusable and customizable UI elements to enhance their application's user interface.
- fafc621: Add a new Dropdown component with hover and click triggers, and a demo page showcasing its usage.
- a62ea91: Add Marquees component for scrolling content and demo page to showcase its usage.
- c20776a: Add a new Menu component with a navigation menu driven by an items array, and update the dropdown documentation to link to the new Menu page.
- a2d6b2b: Add a new Reveals component for animating children into view as they enter the viewport, with customizable effects and staggering.
- 42af265: Add a Splitter component for splitting areas into resizable panels with a draggable handle between each one.
- 862db63: Add a new Upload component with a click-or-drag dropzone that reads selected files into data URLs and renders a removable list, with image previews.

## 1.1.1

### Patch Changes

- Updated dependencies [d10bd91]
  - @repo/ui@5.4.4

## 1.1.0

### Minor Changes

- 40153d3: Add docs pages for 8 more atoms: Progress, Spin, Select, Date Picker, Float Button, Color Picker, Typography, and Switch.
- 561b31e: Add docs pages for the last 6 atoms: Skeleton, Input, Button, Popover, Checkbox, and Radio — finishing every atom. Also regroup the docs sidebar by function (General/Data Entry/Data Display/Feedback/Navigation) instead of atomic-design tier.
- ee7e661: Add a docs/ section (was disabled) with the first component page, Tag — description, live demo, and props table. More components will be added incrementally.

### Patch Changes

- 48dc397: Fix dark mode toggle not reaching `<body>` — the page background/text color stayed light while ui-kit components inside it went dark, because the `.dark` class was only applied to a wrapper nested inside the page content instead of `<html>`.
- Updated dependencies [1285042]
  - @repo/ui@5.4.3

## 1.0.0

### Major Changes

- 03a91d0: Migrated the landing page from Next.js to Docusaurus, keeping the same content and design. apps/docs (Storybook) is unaffected.

### Patch Changes

- a5910eb: Fix Tailwind preflight leaking into the Docusaurus theme (was resetting Infima's navbar/footer/heading styles), and update the production domain to ui-kit-web.vercel.app.
- Updated dependencies [06b8e13]
  - @repo/ui@5.4.2

## 0.3.2

### Patch Changes

- Updated dependencies [4956b80]
  - @repo/ui@5.4.1

## 0.3.1

### Patch Changes

- Updated dependencies [12d3962]
- Updated dependencies [83b3006]
- Updated dependencies [05a2b1e]
- Updated dependencies [35040fc]
- Updated dependencies [4b8333c]
- Updated dependencies [a880521]
  - @repo/ui@5.4.0

## 0.3.0

### Minor Changes

- fc5318f: Added a custom GitHub icon to replace the one removed by lucide-react in v1, allowing users to still access the GitHub repository.

### Patch Changes

- Updated dependencies [fc5318f]
  - @repo/ui@5.3.0

## 0.2.12

### Patch Changes

- Updated dependencies [b33322e]
  - @repo/ui@5.2.0

## 0.2.11

### Patch Changes

- Updated dependencies [0934544]
- Updated dependencies [0e98d57]
- Updated dependencies [e088884]
- Updated dependencies [f05e281]
  - @repo/ui@5.1.0

## 0.2.10

### Patch Changes

- Updated dependencies [9bec162]
- Updated dependencies [3a8a383]
- Updated dependencies [809f220]
- Updated dependencies [d4310c9]
- Updated dependencies [07e183f]
- Updated dependencies [774442c]
  - @repo/ui@5.0.0

## 0.2.9

### Patch Changes

- Updated dependencies [879ba7b]
- Updated dependencies [8e6e350]
  - @repo/ui@4.1.0

## 0.2.8

### Patch Changes

- Updated dependencies [5595db9]
- Updated dependencies [7bbf8d3]
- Updated dependencies [7efd0ec]
- Updated dependencies [91dec7d]
- Updated dependencies [f912e4a]
- Updated dependencies [69cf10f]
- Updated dependencies [6219b09]
- Updated dependencies [51e0dde]
- Updated dependencies [4c7f653]
- Updated dependencies [83c519c]
- Updated dependencies [52aa0e9]
- Updated dependencies [7dd9da6]
- Updated dependencies [2d033c4]
  - @repo/ui@4.0.0

## 0.2.7

### Patch Changes

- Updated dependencies [e32b2cb]
- Updated dependencies [3b8fcef]
- Updated dependencies [92f2db3]
  - @repo/ui@3.8.0

## 0.2.6

### Patch Changes

- Updated dependencies [55cd85c]
- Updated dependencies [8ec0f37]
- Updated dependencies [8ec0f37]
  - @repo/ui@3.7.0

## 0.2.5

### Patch Changes

- Updated dependencies [fcec8af]
- Updated dependencies [01f6f9c]
  - @repo/ui@3.6.0

## 0.2.4

### Patch Changes

- Updated dependencies [9b629da]
- Updated dependencies [d7fab2d]
  - @repo/ui@3.5.0

## 0.2.3

### Patch Changes

- Updated dependencies [c49a0a1]
- Updated dependencies [9f357fb]
- Updated dependencies [27e0a38]
- Updated dependencies [d4cb7aa]
- Updated dependencies [dbac99b]
- Updated dependencies [04d4848]
- Updated dependencies [0137c09]
- Updated dependencies [dcb6851]
- Updated dependencies [4dbba22]
- Updated dependencies [66d42a6]
- Updated dependencies [a6c9944]
- Updated dependencies [97682bb]
- Updated dependencies [e31008d]
  - @repo/ui@3.4.0

## 0.2.2

### Patch Changes

- Updated dependencies [4687e9e]
  - @repo/ui@3.3.0

## 0.2.1

### Patch Changes

- Updated dependencies [061c902]
  - @repo/ui@3.2.1

## 0.2.0

### Minor Changes

- b55ec42: Replace the create-turbo scaffold with a landing page for `@jbpark/ui-kit`: hero with npm version badge and copy-to-clipboard install command, a feature grid, a component-category grid linking to Storybook, and dark mode.
