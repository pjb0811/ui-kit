# Documentation Site

[English](./README.md) | [한국어](./README.ko.md)

This is the documentation site for the UI-Kit component library. Built with Next.js and Storybook, it provides interactive documentation and examples for React components organized following the Atomic Design pattern.

## 📁 Project Structure

```
apps/docs/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── stories/               # Storybook stories
│   ├── atoms/            # Atom component stories
│   ├── molecules/        # Molecule component stories
│   ├── organisms/        # Organism component stories
│   └── templates/        # Template component stories
├── .storybook/           # Storybook configuration
│   ├── main.ts           # Storybook main config
│   └── preview.ts        # Storybook preview config
├── public/               # Static assets
└── package.json
```

## 🚀 Getting Started

### Requirements

- **Node.js** >= 18
- **pnpm** 9.0.0

### Installation

```bash
# From root directory
pnpm install

# Or from docs directory
cd apps/docs
pnpm install
```

### Running Development Servers

#### Next.js Development Server

```bash
# From root
pnpm dev --filter=docs

# Or from docs directory
cd apps/docs
pnpm run dev
```

- **Port**: 3001
- **URL**: http://localhost:3001

#### Storybook Development Server

```bash
# From root
pnpm storybook --filter=docs

# Or from docs directory
cd apps/docs
pnpm run storybook
```

- **Port**: 6006
- **URL**: http://localhost:6006

## 🛠 Available Scripts

### Development

```bash
# Run Next.js dev server (with Turbopack)
pnpm run dev

# Run Storybook dev server
pnpm run storybook

# Run Next.js production server
pnpm run start
```

### Build

```bash
# Build Next.js app
pnpm run build

# Build Storybook static site
pnpm run build-storybook
```

### Code Quality

```bash
# Run ESLint
pnpm run lint

# Check TypeScript types
pnpm run check-types
```

## 📚 Component Documentation

This documentation site systematically documents React components organized using the Atomic Design pattern. Each component is documented through Storybook with interactive examples and usage guidelines.

### 🧬 Atoms

Basic UI building blocks

| Component       | Description                  | Sub-components                       |
| --------------- | ---------------------------- | ------------------------------------ |
| **Button**      | Various button styles        | -                                    |
| **Checkbox**    | Checkbox and checkbox groups | `Group`                              |
| **FloatButton** | Floating action button       | `BackTop`                            |
| **Progress**    | Progress indicator component | -                                    |
| **Skeleton**    | Loading skeleton             | `Button`, `Node`                     |
| **Spin**        | Loading spinner              | -                                    |
| **Switch**      | Toggle switch component      | -                                    |
| **Typography**  | Text components              | `Link`, `Paragraph`, `Text`, `Title` |

### 🔬 Molecules

Composite components combining multiple atoms

| Component    | Description                | Sub-components |
| ------------ | -------------------------- | -------------- |
| **Collapse** | Collapsible content area   | -              |
| **Dropdown** | Dropdown menu              | -              |
| **Marquees** | Infinite scrolling marquee | `Item`         |
| **Menu**     | Navigation menu            | -              |
| **Reveals**  | Animation reveal component | `Item`         |
| **Space**    | Spacing adjustment         | -              |

### 🦠 Organisms

Complex UI sections

| Component  | Description               | Sub-components |
| ---------- | ------------------------- | -------------- |
| **Drawer** | Side drawer panel         | -              |
| **List**   | List and list items       | `Item`         |
| **Modal**  | Modal dialog              | -              |
| **Swiper** | Slider/carousel component | `Slide`        |

### 📄 Templates

Page layout templates

| Component  | Description      | Sub-components                         |
| ---------- | ---------------- | -------------------------------------- |
| **Layout** | Full page layout | `Header`, `Sider`, `Content`, `Footer` |

## 🎨 Styling

This project uses the latest Tailwind CSS 4 for styling:

- **Tailwind CSS 4.1.12** - Utility-first CSS framework

## 🛠 Tech Stack

### Core Technologies

- **Next.js 16.1.3** - React framework with Turbopack
- **React 19.1.0** - UI library
- **TypeScript 5.9.2** - Static type checking

### Documentation Tools

- **Storybook 10.1.11** - Component documentation and testing
- **@storybook/nextjs-vite 10.1.11** - Next.js integration

### Development Tools

- **ESLint 9.34.0** - Code linting
- **eslint-plugin-storybook 10.1.11** - Storybook ESLint plugin

## 📦 Dependencies

### Internal Packages

- **@repo/ui** - Main UI component library
- **@repo/eslint-config** - Shared ESLint configuration
- **@repo/typescript-config** - Shared TypeScript configuration

### External Dependencies

- **next** - Next.js framework
- **react** - React library
- **react-dom** - React DOM renderer
- **tailwindcss** - CSS framework

## 📖 Storybook Configuration

### Story File Structure

```
stories/
├── atoms/           # Atom component stories
├── molecules/       # Molecule component stories
├── organisms/       # Organism component stories
└── templates/       # Template component stories
```

### Story Writing Guidelines

1. **File Naming**: Use `index.stories.tsx` format
2. **Story Structure**: Include examples for all component variants and props
3. **Accessibility**: Include ARIA attributes and keyboard navigation testing
4. **Interaction**: Provide interactive examples using Controls and Actions

## 📄 License

This project is licensed under the MIT License.

## 🔗 Related Links

- [Root Project README](../../README.md)
- [UI Component Library](../../packages/ui/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Storybook Documentation](https://storybook.js.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---
