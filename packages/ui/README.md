# @jbpark/ui-kit

[English](./README.md) | [한국어](./README.ko.md)

A modern and reusable React UI component library built with TypeScript and Tailwind CSS, following the Atomic Design pattern for systematic organization and scalability.

## 📦 Package Information

- **Package Name**: `@jbpark/ui-kit`
- **License**: MIT
- **Package Manager**: pnpm
- **Node.js Requirement**: >= 20
- **React Requirement**: ^19.0.0

## 🏗 Architecture

### Atomic Design Pattern

This library organizes components hierarchically following the Atomic Design methodology:

```
src/
├── components/
│   ├── atoms/        # 🧬 Atoms - Basic UI elements
│   ├── molecules/    # 🔬 Molecules - Combinations of atoms
│   ├── organisms/    # 🦠 Organisms - Complex UI blocks
│   └── templates/    # 📄 Templates - Page layouts
├── core/             # ⚙️ Internal Base UI primitives (not exported)
├── lib/
│   ├── utils/        # 🛠 Utility functions
│   ├── colors.ts     # 🎨 Colour token resolution
│   └── z-layers.ts   # 🪟 Shared portal z-index scale
├── providers/        # 🧩 Config provider and theming
├── globals.css       # 🎨 Global styles
└── index.ts          # 📥 Package entry point
```

## 🧬 Atoms

Basic UI building blocks

| Component          | Description                                                   | Sub-components                        |
| ------------------ | ------------------------------------------------------------- | ------------------------------------- |
| **AutoComplete**   | A text input that suggests matching options as you type       | -                                     |
| **Avatar**         | A profile image with initials or icon fallback                | -                                     |
| **Badge**          | A count or status dot attached to another element             | -                                     |
| **Button**         | Buttons with type, variant, size and loading states           | -                                     |
| **Cascader**       | Picks one value from nested option levels                     | -                                     |
| **Checkbox**       | A single checkbox, or a group sharing one value               | `Group`                               |
| **CodeEditor**     | CodeMirror 6 editing surface (subpath-only, see below)        | -                                     |
| **ColorPicker**    | A swatch that opens a popover for picking a hex colour        | -                                     |
| **DatePicker**     | A button that opens a calendar popover for a single date      | -                                     |
| **Divider**        | A horizontal or vertical separator, optionally labeled        | -                                     |
| **FloatButton**    | A circular button fixed to a corner of the viewport           | `BackTop`                             |
| **Input**          | A text input, with search, number, OTP and multiline variants | `Search`, `Number`, `OTP`, `TextArea` |
| **Mentions**       | A text area that completes `@`-prefixed tokens                | -                                     |
| **Popover**        | A floating panel anchored to a trigger element                | -                                     |
| **Progress**       | A bar that fills to a percentage, horizontal or vertical      | -                                     |
| **Radio**          | A single radio, or a group for mutually-exclusive options     | `Group`                               |
| **Rate**           | A star rating input                                           | -                                     |
| **RichTextEditor** | A TipTap-based editor over an HTML string                     | -                                     |
| **Segmented**      | A single-choice control for switching views                   | -                                     |
| **Select**         | A dropdown for choosing one or more values, with search       | -                                     |
| **Skeleton**       | A placeholder that mimics content while it loads              | `Button`, `Node`                      |
| **Slider**         | A draggable numeric value or range control                    | -                                     |
| **Spin**           | A loading indicator, standalone or as an overlay              | -                                     |
| **Switch**         | A boolean on/off toggle                                       | -                                     |
| **Tag**            | A small labeled badge for categorising content                | -                                     |
| **TimePicker**     | A button that opens a popover for picking a time              | -                                     |
| **ToggleGroup**    | A group of independently pressed action buttons               | -                                     |
| **Tooltip**        | A short text hint shown on hover or focus                     | -                                     |
| **Typography**     | Headings, body text, paragraphs and links                     | `Link`, `Paragraph`, `Text`, `Title`  |

## 🔬 Molecules

Composite components combining multiple atoms

| Component        | Description                                                | Sub-components |
| ---------------- | ---------------------------------------------------------- | -------------- |
| **Alert**        | An inline message with a status colour and optional action | -              |
| **Anchor**       | In-page navigation that highlights the current section     | -              |
| **Breadcrumb**   | The path to the current page                               | -              |
| **Card**         | A content container with an optional title                 | -              |
| **Collapse**     | Expandable panels, with an optional accordion mode         | -              |
| **ContextMenu**  | A menu opened by right-clicking an area                    | -              |
| **Descriptions** | Labeled record details in a responsive grid                | -              |
| **Dropdown**     | Reveals a floating `Menu` from a trigger                   | -              |
| **Empty**        | An inline placeholder for the "loaded, but empty" state    | -              |
| **Marquees**     | Rows of content scrolling in a continuous loop             | `Item`         |
| **Menu**         | Navigation menu with nested submenus                       | -              |
| **Pagination**   | Page navigation for long lists                             | -              |
| **Popconfirm**   | A popover that asks for confirmation before an action      | -              |
| **Reveals**      | Animates children into view with a staggered cascade       | `Item`         |
| **ScrollArea**   | A scroll container with styled scrollbars                  | -              |
| **Space**        | Lays out children in a row or column with gaps             | -              |
| **Splitter**     | Resizable panels with a draggable handle between them      | `Panel`        |
| **Statistic**    | A formatted metric with a title and unit                   | -              |
| **Steps**        | The stages of an ordered workflow                          | -              |
| **Tabs**         | Switches between panels of related content                 | -              |
| **Timeline**     | Ordered events with timestamps                             | -              |
| **Transfer**     | Moves items between two lists                              | -              |
| **Upload**       | A click-or-drag dropzone with a removable file list        | -              |

## 🦠 Organisms

Complex UI sections

| Component      | Description                                                                       | Sub-components                                                                              |
| -------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Calendar**   | A month view for picking dates or showing date content                            | -                                                                                           |
| **Drawer**     | A controlled panel that slides in from any edge                                   | -                                                                                           |
| **Form**       | Form layout with labeled fields, descriptions and error messages                  | `Field`, `Control`                                                                          |
| **List**       | A collection with loading, empty and infinite-scroll states                       | `Item`                                                                                      |
| **Modal**      | A dialog, controlled or fired imperatively                                        | `confirm`, `info`, `success`, `warning`, `error`, `destroy`, `destroyAll`                   |
| **Swiper**     | A touch-friendly carousel over Swiper.js                                          | `Slide`                                                                                     |
| **Table**      | A data table with custom cells, loading and empty states, and optional pagination | -                                                                                           |
| **Toast**      | Imperative, auto-dismissing notifications                                         | `open`, `info`, `success`, `warning`, `error`, `loading`, `config`, `destroy`, `destroyAll` |
| **Tour**       | A guided walkthrough of steps anchored to elements                                | -                                                                                           |
| **Tree**       | A hierarchical list with expand, select and lazy loading                          | -                                                                                           |
| **TreeSelect** | A select whose options are a tree                                                 | -                                                                                           |

## 📄 Templates

Page layout templates

| Component      | Description                                           | Sub-components                         |
| -------------- | ----------------------------------------------------- | -------------------------------------- |
| **Container**  | Centres page content at a capped width with gutters   | -                                      |
| **Grid**       | A 24-column responsive grid (`Row` and `Col` exports) | -                                      |
| **Layout**     | The page scaffold: header, sider, content and footer  | `Header`, `Sider`, `Content`, `Footer` |
| **PageHeader** | A page title block with back button and actions       | -                                      |
| **Result**     | A full-page screen for an operation's outcome         | -                                      |

## 🛠 Core Features

### Built on Base UI

Components are built on [Base UI](https://base-ui.com) primitives, which handle focus management, portals, `aria-*` wiring and popup positioning. The internal primitive layer (`src/core`) is not part of the public API and cannot be imported.

### Utilities

- **`cn()`** - Class name merging utility (clsx + tailwind-merge)
- **`renderConditional()`** - Conditional render helper

## 🚀 Installation & Usage

### Installation

```bash
# npm
npm install @jbpark/ui-kit

# yarn
yarn add @jbpark/ui-kit

# pnpm
pnpm add @jbpark/ui-kit
```

### Basic Usage

```tsx
import { Button, Layout, Typography } from '@jbpark/ui-kit';

import '@jbpark/ui-kit/style.css';

function App() {
  return (
    <div data-ui-root>
      <Layout>
        <Typography.Title>Hello!</Typography.Title>
        <Button variant="primary">Click me</Button>
      </Layout>
    </div>
  );
}
```

Put `data-ui-root` on your application layout root. The included stylesheet
applies `isolation: isolate` there so Base UI portals render above page content
without competing with z-index values inside the app.

It also works in the other direction. Overlays (Modal, Drawer, Select,
Popover) and in-flow chrome (sticky/fixed `Layout.Header`, `FloatButton`,
Dropdown menus) share `z-index: 1000`. Without an isolated root, that
chrome paints over your own dialogs if they use a lower z-index (for example
shadcn's `z-50`). With `data-ui-root`, any overlay you portal to `body`
covers the whole app, including this chrome.

### Import Individual Components

Every component can also be imported from a subpath named after its export (see below for `Row`/`Col` and `CodeEditor`).

```tsx
import Button from '@jbpark/ui-kit/Button';
import Input from '@jbpark/ui-kit/Input';
import Modal from '@jbpark/ui-kit/Modal';
import Typography from '@jbpark/ui-kit/Typography';
```

> Each of these deep-import paths only has a default export -- import the
> component itself, not `{ ComponentName }`. Prefer these paths over the
> root `@jbpark/ui-kit` entry when you don't need every component: the root
> entry re-exports all organisms, including `Swiper`, which pulls in
> `swiper`'s CSS as a side effect and can break Node/SSR builds (e.g. an
> Astro static build) that don't expect a bare `.css` import.

- `Row`/`Col` are named exports and have no subpath. Import them from the root: `import { Row, Col } from '@jbpark/ui-kit'`.
- `CodeEditor` is the opposite: it is **subpath-only** (`@jbpark/ui-kit/CodeEditor`). CodeMirror is an optional peer dependency, so the root entry does not include it.
- Import types from the root entry: `import type { ButtonProps } from '@jbpark/ui-kit'`.

### Import Utilities and Providers

```tsx
// Utility functions
import { Config } from '@jbpark/ui-kit/providers';
import { cn, renderConditional } from '@jbpark/ui-kit/utils';
```

### Import Styles

```tsx
// Global styles (required)
import '@jbpark/ui-kit/style.css';
```

## 🎨 Styling

### Tailwind CSS

- **Tailwind CSS 4** based
- **PostCSS** processing
- **class-variance-authority** for component variants management
- **tailwind-merge** for resolving class conflicts

### Customization

```tsx
// Import global styles (required)
import '@jbpark/ui-kit/style.css';

// Customize theme in tailwind.config.js
// PostCSS configuration needed for Tailwind CSS 4
```

## 📚 Key Dependencies

### Core Libraries

- **React 19.2** - UI library
- **TypeScript 6.0** - Static type checking
- **Tailwind CSS 4.3** - Utility-first CSS framework

### UI Libraries

- **Base UI 1.8** - Accessible headless UI primitives
- **Lucide React 1.45** - Icon library
- **Motion 13.1** - Animation library
- **Swiper 14.1** - Touch slider
- **TipTap 3.30** - RichTextEditor engine
- **react-day-picker 10.0** - DatePicker calendar
- **react-resizable-panels 4.12** - Splitter panels

### Utilities

- **class-variance-authority 0.7.1** - Component variants management
- **clsx 2.1.1** - Conditional class names
- **tailwind-merge 3.6** - Tailwind class merging
- **@jbpark/use-hooks 4.0** - React hooks collection
- **date-fns 4.4** - Date formatting and parsing
- **react-colorful 5.8** - ColorPicker input
- **GSAP 3.15 / @gsap/react 2.1** - GSAP animation

## 🔧 Development

This package is developed in a monorepo environment (pnpm workspaces).

### Type Checking

```bash
pnpm run check-types
```

### Linting

```bash
pnpm run lint
```

### Build

```bash
pnpm run build
```

### Generate Component

```bash
pnpm run generate:component
```

## 📦 Package Exports

- `@jbpark/ui-kit` - Main entry (every component except `CodeEditor`, their types, and the `providers` exports such as `Config`)
- `@jbpark/ui-kit/<ComponentName>` - One subpath per component (default export only), named as in the tables above
- `@jbpark/ui-kit/utils` - Utility functions (`cn`, `renderConditional`)
- `@jbpark/ui-kit/providers` - Config provider and theming
- `@jbpark/ui-kit/style.css` - Global styles (required)

The `exports` field of the package's `package.json` is the full, authoritative list.

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-component`)
3. Place your component in the appropriate folder following Atomic Design
4. Define TypeScript types
5. Write Storybook stories
6. Commit your changes (`git commit -m 'Add amazing component'`)
7. Push to the branch (`git push origin feature/amazing-component`)
8. Create a Pull Request

## 📄 License

Licensed under the MIT License.

---
