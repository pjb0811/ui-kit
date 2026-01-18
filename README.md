# UI-Kit Monorepo

[English](./README.md) | [한국어](./README.ko.md)

A modern monorepo containing a comprehensive React UI component library and web/documentation apps built with Turborepo. Systematically organized following the Atomic Design pattern and featuring React 19, TypeScript, Next.js 16, and Tailwind CSS 4.

## 📁 Project Structure

```
ui-kit/
├── apps/                    # Applications
│   ├── docs/               # Storybook documentation site (port: 3001)
│   └── web/                # Next.js demo/service app (port: 3000)
├── packages/               # Shared packages
│   ├── ui/                 # Main UI component library
│   ├── eslint-config/      # ESLint configuration
│   └── typescript-config/  # TypeScript configuration
└── README.md
```

## 🎨 UI Component Library

A React component library organized following the Atomic Design pattern.

- **Local Development**: `@repo/ui` (workspace package)
- **npm Publishing**: `@jbpark/ui-kit` ([npm package](https://www.npmjs.com/package/@jbpark/ui-kit))

### Atoms

Basic UI building blocks

- **Button**: Various button styles
- **Checkbox**: Checkbox and checkbox groups
- **FloatButton**: Floating action button (includes BackTop)
- **Input**: Input field component (includes Search, TextArea)
- **Progress**: Progress indicator component
- **Skeleton**: Loading skeleton (includes Button, Node)
- **Spin**: Loading spinner
- **Switch**: Toggle switch
- **Typography**: Text components (includes Link, Paragraph, Text, Title)

### Molecules

Composite components combining multiple atoms

- **Collapse**: Collapsible content area
- **Dropdown**: Dropdown menu
- **Marquees**: Infinite scrolling marquee component
- **Menu**: Navigation menu
- **Reveals**: Animation reveal component
- **Space**: Spacing adjustment component

### Organisms

Complex UI sections

- **Drawer**: Side drawer panel
- **List**: List and list items
- **Modal**: Modal dialog
- **Swiper**: Slider component

### Templates

Page layout templates

- **Layout**: Full page layout (includes Header, Sider, Content, Footer)

## 🛠 Tech Stack

### Core Technologies

- **[React 19](https://react.dev/)** - UI library
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Static type checking
- **[Next.js 16](https://nextjs.org/)** - React framework
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework

### UI Libraries

- **[Radix UI](https://www.radix-ui.com/)** - Accessible headless UI components
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Motion](https://motion.dev/)** - Animation library
- **[Swiper](https://swiperjs.com/)** - Touch slider
- **[Vaul](https://vaul.dev/)** - Drawer component

### Development Tools

- **[Turborepo](https://turborepo.com/)** - Monorepo build system
- **[pnpm](https://pnpm.io/)** - Package manager (v9.0.0)
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Storybook](https://storybook.js.org/)** - Component documentation
- **[Husky](https://typicode.github.io/husky/)** - Git hooks

## 🚀 Getting Started

### Requirements

- Node.js >= 18
- pnpm 9.0.0

### Installation

```bash
# Install dependencies
pnpm install
```

### Running Development Servers

```bash
# Run all apps/packages in development mode
pnpm dev

# Run specific app only
pnpm dev --filter=web      # Web app (port: 3000)
pnpm dev --filter=docs     # Documentation site (port: 3001)
```

### Build

```bash
# Build all apps/packages
pnpm run build

# Build specific app only
pnpm run build --filter=web
```

### Code Quality

```bash
# Linting
pnpm run lint

# Type checking
pnpm run check-types

# Code formatting
pnpm run format
```

### Deployment

```bash
# Add changes
pnpm run changeset

# Update versions
pnpm run version-packages

# Build and publish
pnpm run release
```

> **Note**: When publishing, `@repo/ui` is automatically deployed as `@jbpark/ui-kit`.

## 📚 Documentation

### Storybook

Component documentation and testing using Storybook.

```bash
# Run Storybook dev server (port: 6006)
pnpm storybook --filter=docs

# Build Storybook static site
pnpm run build-storybook --filter=docs
```

## 📦 Package Information

### Apps

- **`apps/web`**: Next.js based web demo/service
- **`apps/docs`**: Storybook based component documentation site

### Packages

- **`@repo/ui`**: Main UI component library (for local development)
  - Published as: `@jbpark/ui-kit` on npm
  - See [`packages/ui/README.md`](./packages/ui/README.md) for details
- **`@repo/eslint-config`**: ESLint configuration (base, next-js, react-internal)
- **`@repo/typescript-config`**: TypeScript configuration (base, nextjs, react-library)

## 🔧 Usage

### Within Monorepo (Local Development)

Use as a workspace package within the monorepo apps:

```tsx
import { Button, Layout, Typography } from '@repo/ui';
import '@repo/ui/style.css';

function App() {
  return (
    <Layout>
      <Typography.Title>Hello!</Typography.Title>
      <Button variant="primary">Click me</Button>
    </Layout>
  );
}
```

### External Projects (npm Package)

Install from npm for use in external projects:

```bash
npm install @jbpark/ui-kit
```

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

See [`packages/ui/README.md`](./packages/ui/README.md) for detailed usage.

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Resources

- [Turborepo Documentation](https://turborepo.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [Storybook Documentation](https://storybook.js.org/docs)
- [pnpm Documentation](https://pnpm.io/)

---
