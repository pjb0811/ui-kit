# @jbpark/ui-kit

[English](./README.md) | [한국어](./README.ko.md)

A modern and reusable React UI component library built with TypeScript and Tailwind CSS, following the Atomic Design pattern for systematic organization and scalability.

## 📦 Package Information

- **Package Name**: `@jbpark/ui-kit`
- **License**: MIT
- **Package Manager**: pnpm
- **Node.js Requirement**: >= 18
- **React Requirement**: ^18.0.0 || ^19.0.0

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
├── core/             # ⚙️ Core UI logic (Radix UI based)
├── lib/
│   ├── enums/        # 📋 Enumeration types
│   └── utils/        # 🛠 Utility functions
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

Accessibility-first core components based on Radix UI:

- `accordion.tsx` - Accordion component (Radix UI based)
- `button.tsx` - Button component (variants managed with class-variance-authority)
- `dialog.tsx` - Dialog component (Radix UI based)
- `drawer.tsx` - Drawer component (Vaul based)
- `progress.tsx` - Progress component (Radix UI based)
- `skeleton.tsx` - Skeleton component
- `switch.tsx` - Switch component (Radix UI based)

### Utilities

- **`cn()`** - Class name merging utility (clsx + tailwind-merge)
- **`TEXT_LEVELS`** - Typography level constants

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
    <Layout>
      <Typography.Title>Hello!</Typography.Title>
      <Button variant="primary">Click me</Button>
    </Layout>
  );
}
```

### Import Individual Components

```tsx
// Typography component
// Menu component
import { Menu } from '@jbpark/ui-kit/Menu';
// Reveals component
import { Reveals } from '@jbpark/ui-kit/Reveals';
import { Typography } from '@jbpark/ui-kit/Typography';
```

### Import Utilities and Enums

```tsx
// Utility functions
// Enumeration constants
import { TEXT_LEVELS } from '@jbpark/ui-kit/enums';
import { cn } from '@jbpark/ui-kit/utils';
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

- **React 19.1.0** - UI library
- **TypeScript 5.9.2** - Static type checking
- **Tailwind CSS 4.1.12** - Utility-first CSS framework

### UI Libraries

- **Radix UI** - Accessible headless UI components
  - `@radix-ui/react-accordion` (1.2.12)
  - `@radix-ui/react-dialog` (1.1.15)
  - `@radix-ui/react-progress` (1.1.7)
  - `@radix-ui/react-slot` (1.2.3)
  - `@radix-ui/react-switch` (1.2.6)
- **Lucide React 0.542.0** - Icon library
- **Motion 12.23.12** - Animation library
- **Swiper 11.2.10** - Touch slider
- **Vaul 1.1.2** - Drawer component

### Utilities

- **class-variance-authority 0.7.1** - Component variants management
- **clsx 2.1.1** - Conditional class names
- **tailwind-merge 3.3.1** - Tailwind class merging
- **react-use 17.6.0** - React hooks collection
- **@uidotdev/usehooks 2.4.1** - Additional React hooks
- **uuid 11.1.0** - Unique ID generation
- **@gsap/react 2.1.2** - GSAP animation
- **tw-animate-css 1.3.7** - Tailwind animations

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
- `@jbpark/ui-kit/Menu` - Menu component
- `@jbpark/ui-kit/Reveals` - Reveals component
- `@jbpark/ui-kit/utils` - Utility functions (`cn` etc)
- `@jbpark/ui-kit/enums` - Enumeration constants (`TEXT_LEVELS` etc)
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
