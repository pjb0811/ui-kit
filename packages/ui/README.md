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
├── core/             # ⚙️ Core UI logic (Base UI based)
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

| Component       | Description                  | Sub-components                       |
| --------------- | ---------------------------- | ------------------------------------ |
| **Button**      | Various button styles        | -                                    |
| **Checkbox**    | Checkbox and checkbox groups | `Group`                              |
| **ColorPicker** | Color selection component    | -                                    |
| **FloatButton** | Floating action button       | `BackTop`                            |
| **Input**       | Input field component        | `Search`, `TextArea`                 |
| **Popover**     | Popover tooltip component    | -                                    |
| **Progress**    | Progress indicator component | -                                    |
| **Radio**       | Radio button component       | -                                    |
| **Select**      | Select dropdown component    | -                                    |
| **Skeleton**    | Loading skeleton             | `Button`, `Node`                     |
| **Spin**        | Loading spinner              | -                                    |
| **Switch**      | Toggle switch component      | -                                    |
| **Tag**         | Pill-style label/tag         | -                                    |
| **Typography**  | Text components              | `Link`, `Paragraph`, `Text`, `Title` |

## 🔬 Molecules

Composite components combining multiple atoms

| Component    | Description                | Sub-components |
| ------------ | -------------------------- | -------------- |
| **Collapse** | Collapsible content area   | -              |
| **Dropdown** | Dropdown menu              | -              |
| **Marquees** | Infinite scrolling marquee | `Item`         |
| **Menu**     | Navigation menu            | -              |
| **Reveals**  | Animation reveal component | `Item`         |
| **Space**    | Spacing adjustment         | -              |

## 🦠 Organisms

Complex UI sections

| Component  | Description               | Sub-components |
| ---------- | ------------------------- | -------------- |
| **Drawer** | Side drawer panel         | -              |
| **List**   | List and list items       | `Item`         |
| **Modal**  | Modal dialog              | -              |
| **Swiper** | Slider/carousel component | `Slide`        |

## 📄 Templates

Page layout templates

| Component  | Description      | Sub-components                         |
| ---------- | ---------------- | -------------------------------------- |
| **Layout** | Full page layout | `Header`, `Sider`, `Content`, `Footer` |

## 🛠 Core Features

### Core Module

Accessibility-first core components based on Base UI:

- `accordion.tsx` - Accordion component (Base UI based)
- `button.tsx` - Button component (variants managed with class-variance-authority)
- `dialog.tsx` - Dialog component (Base UI based)
- `drawer.tsx` - Drawer component (Base UI dialog based)
- `progress.tsx` - Progress component (Base UI based)
- `skeleton.tsx` - Skeleton component
- `switch.tsx` - Switch component (Base UI based)

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

### Import Individual Components

```tsx
// Typography component
// Button component
import Button from '@jbpark/ui-kit/Button';
// Card component
import Card from '@jbpark/ui-kit/Card';
// Layout component
import Layout from '@jbpark/ui-kit/Layout';
// Menu component
import Menu from '@jbpark/ui-kit/Menu';
// Reveals component
import Reveals from '@jbpark/ui-kit/Reveals';
// Space component
import Space from '@jbpark/ui-kit/Space';
// Tag component
import Tag from '@jbpark/ui-kit/Tag';
import Typography from '@jbpark/ui-kit/Typography';
```

> Each of these deep-import paths only has a default export -- import the
> component itself, not `{ ComponentName }`. Prefer these paths over the
> root `@jbpark/ui-kit` entry when you don't need every component: the root
> entry re-exports all organisms, including `Swiper`, which pulls in
> `swiper`'s CSS as a side effect and can break Node/SSR builds (e.g. an
> Astro static build) that don't expect a bare `.css` import.

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

This package exports the following modules:

- `@jbpark/ui-kit` - Main package (all components)
- `@jbpark/ui-kit/Typography` - Typography component
- `@jbpark/ui-kit/Button` - Button component
- `@jbpark/ui-kit/Tag` - Tag component
- `@jbpark/ui-kit/Card` - Card component
- `@jbpark/ui-kit/Space` - Space component
- `@jbpark/ui-kit/Menu` - Menu component
- `@jbpark/ui-kit/Reveals` - Reveals component
- `@jbpark/ui-kit/CodeEditor` - CodeEditor component
- `@jbpark/ui-kit/Layout` - Layout template
- `@jbpark/ui-kit/utils` - Utility functions (`cn`, `renderConditional`)
- `@jbpark/ui-kit/providers` - Config provider and theming
- `@jbpark/ui-kit/style.css` - Global styles (required)

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
