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

- **Node.js** >= 20
- **pnpm** >= 10

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

| Component          | Description                                               | Sub-components                       |
| ------------------ | --------------------------------------------------------- | ------------------------------------ |
| **Button**         | Buttons with type, variant, size and loading states       | -                                    |
| **Checkbox**       | A single checkbox, or a group sharing one value           | `Group`                              |
| **CodeEditor**     | CodeMirror 6 editing surface with JS/TS highlighting      | -                                    |
| **ColorPicker**    | A swatch that opens a popover for picking a hex colour    | -                                    |
| **DatePicker**     | A button that opens a calendar popover for a single date  | -                                    |
| **FloatButton**    | A circular button fixed to a corner of the viewport       | `BackTop`                            |
| **Input**          | A text input, with search and multiline variants          | `Search`, `TextArea`                 |
| **Popover**        | A floating panel anchored to a trigger element            | -                                    |
| **Progress**       | A bar that fills to a percentage, horizontal or vertical  | -                                    |
| **Radio**          | A single radio, or a group for mutually-exclusive options | `Group`                              |
| **RichTextEditor** | A TipTap-based editor over an HTML string                 | -                                    |
| **Select**         | A dropdown for choosing one value from a list             | -                                    |
| **Skeleton**       | A placeholder that mimics content while it loads          | `Button`, `Node`                     |
| **Slider**         | A draggable numeric range control                         | -                                    |
| **Spin**           | A loading indicator, standalone or as an overlay          | -                                    |
| **Switch**         | A boolean on/off toggle                                   | -                                    |
| **Tag**            | A small labeled badge for categorising content            | -                                    |
| **Typography**     | Headings, body text, paragraphs and links                 | `Link`, `Paragraph`, `Text`, `Title` |

> `CodeEditor` is reached through its own subpath — `import CodeEditor from '@jbpark/ui-kit/CodeEditor'`.
> It is deliberately kept out of the main barrel so CodeMirror stays an opt-in peer dependency.

### 🔬 Molecules

Composite components combining multiple atoms

| Component    | Description                                           | Sub-components |
| ------------ | ----------------------------------------------------- | -------------- |
| **Card**     | A content container with an optional title            | -              |
| **Collapse** | Expandable panels, with an optional accordion mode    | -              |
| **Dropdown** | Reveals a floating `Menu` from a trigger              | -              |
| **Marquees** | Rows of content scrolling in a continuous loop        | `Item`         |
| **Menu**     | Navigation menu with nested submenus                  | -              |
| **Reveals**  | Animates children into view with a staggered cascade  | `Item`         |
| **Space**    | Lays out children in a row or column with gaps        | -              |
| **Splitter** | Resizable panels with a draggable handle between them | `Panel`        |
| **Upload**   | A click-or-drag dropzone with a removable file list   | -              |

### 🦠 Organisms

Complex UI sections

| Component  | Description                                                 | Sub-components                                   |
| ---------- | ----------------------------------------------------------- | ------------------------------------------------ |
| **Drawer** | A controlled panel that slides in from any edge             | -                                                |
| **List**   | A collection with loading, empty and infinite-scroll states | `Item`                                           |
| **Modal**  | A dialog, controlled or fired imperatively                  | `confirm`, `info`, `success`, `warning`, `error` |
| **Swiper** | A touch-friendly carousel over Swiper.js                    | `Slide`                                          |
| **Toast**  | Imperative, auto-dismissing notifications                   | `info`, `success`, `warning`, `error`            |

### 📄 Templates

Page layout templates

| Component      | Description                                             | Sub-components                         |
| -------------- | ------------------------------------------------------- | -------------------------------------- |
| **Container**  | Centres page content at a capped width with gutters     | -                                      |
| **Empty**      | An inline placeholder for the "loaded, but empty" state | -                                      |
| **Grid**       | A 24-column responsive grid                             | `Row`, `Col`                           |
| **Layout**     | The page scaffold: header, sider, content and footer    | `Header`, `Sider`, `Content`, `Footer` |
| **PageHeader** | A page title block with back button and actions         | -                                      |
| **Result**     | A full-page screen for an operation's outcome           | -                                      |

## 🎨 Styling

This project uses the latest Tailwind CSS 4 for styling:

- **Tailwind CSS 4.3.3** - Utility-first CSS framework

## 🛠 Tech Stack

### Core Technologies

- **Next.js 16.3.1** - React framework with Turbopack
- **React 19.2.8** - UI library
- **TypeScript 6.0.3** - Static type checking

### Documentation Tools

- **Storybook 10.5.8** - Component documentation and testing
- **@storybook/nextjs-vite 10.5.8** - Next.js integration

### Development Tools

- **ESLint 9.39.5** - Code linting
- **eslint-plugin-storybook 10.5.8** - Storybook ESLint plugin

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
