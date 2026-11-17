---
sidebar_position: 1
title: Overview
---

# ui-kit

A React UI component library built with TypeScript, Tailwind CSS, and Base UI.

## Install

```bash
npm install @jbpark/ui-kit
```

## Components

Pages here are being added one component at a time, grouped the same way as
Storybook and the landing page (General/Data Entry/Data Display/Feedback/
Navigation/Layout). For the full interactive catalog of every component
right now, see [Storybook](https://ui-kit-docs-lab.vercel.app).

## Localization

Built-in text (button labels, `aria-label`s, placeholders, empty states) is English by default. Wrap your app in `Config` with a `locale` to change it. `koKR` ships with the package, including the date-fns locale DatePicker uses for its formatted date:

```tsx
import { Config, koKR } from '@jbpark/ui-kit';

<Config locale={koKR}>{app}</Config>;
```

A `locale` can also be partial. Shared words sit at the top level, and component text is grouped by component. A nested `Config` merges each group key by key, and anything left out falls back to the parent and then to `enUS`:

```tsx
<Config locale={{ cancel: 'Dismiss', Tour: { next: 'Continue' } }}>
  {app}
</Config>
```

A component's own prop (`nextLabel`, `labels`, `placeholder`, ...) still wins over the locale. Strings with `{name}` placeholders, such as `Tour.progress` (`'Step {current} of {total}'`) or `Upload.remove` (`'Remove {name}'`), are filled in by the component.

| Keys                                                                                                                                                                                                                                   | Used by                      |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `close`, `clear`, `back`, `ok`, `cancel`, `loading`, `retry`, `loadFailed`, `expand`, `collapse`, `backToTop`, `preview`, `search`, `searchPlaceholder`, `noData`, `noResults`                                                         | Shared by several components |
| `Anchor`, `AutoComplete`, `Breadcrumb`, `Cascader`, `DatePicker`, `InputNumber`, `Mentions`, `Pagination`, `Popconfirm`, `RichTextEditor`, `Select`, `Steps`, `Tabs`, `TimePicker`, `Tour`, `Transfer`, `Tree`, `TreeSelect`, `Upload` | That component               |

The `Locale` type lists every key, and `enUS` holds the default text.

## Links

- [GitHub](https://github.com/pjb0811/ui-kit)
- [npm](https://www.npmjs.com/package/@jbpark/ui-kit)
