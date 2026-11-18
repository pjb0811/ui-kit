import type { Locale as DateFnsLocale } from 'date-fns';

/**
 * Theme overrides applied as CSS custom properties on `Config`'s wrapper
 * element, inherited by everything inside it.
 *
 * Every token here is verified to actually reach a component. That is worth
 * stating because it did not use to be true: 19 of the previous 40 tokens were
 * inert (#343). Three groups were dropped in 8.0 —
 *
 * - `btnBackground`/`btnBackgroundHover`/`btnBackgroundActive`/`btnBorder`/
 *   `btnForeground` — `globals.css` declares `--btn-*` on the button element
 *   itself (keyed off `data-color`), and an element's own declaration always
 *   beats an inherited one, so a wrapper value could never win. Re-theming a
 *   button is done through `colorPrimary`/`colorDestructive` for the semantic
 *   colours, or by overriding `--preset-color` in CSS for the preset hues.
 * - `sidebar*` and `chart*` — no component in the library reads them, and the
 *   matching utilities (`bg-sidebar`, `bg-chart-1`) are never generated into
 *   the published stylesheet, so nothing consumed them. The underlying
 *   `--sidebar-*`/`--chart-*` custom properties are still declared in
 *   `globals.css` and remain overridable in plain CSS; only the inert token
 *   API is gone. They should come back alongside an actual Sidebar/Chart
 *   component.
 *
 * `fontSans`/`fontMono` were inert for a different reason and were fixed
 * rather than removed — see below.
 */
export interface ThemeToken {
  // Colors
  colorPrimary?: string;
  colorPrimaryForeground?: string;
  colorBackground?: string;
  colorForeground?: string;
  colorCard?: string;
  colorCardForeground?: string;
  colorPopover?: string;
  colorPopoverForeground?: string;
  colorSecondary?: string;
  colorSecondaryForeground?: string;
  colorMuted?: string;
  colorMutedForeground?: string;
  colorAccent?: string;
  colorAccentForeground?: string;
  colorDestructive?: string;
  colorBorder?: string;
  colorInput?: string;
  colorRing?: string;

  // Border Radius — only the base `--radius` is a real, independently-set
  // CSS custom property. Tailwind v4 inlines every derived scale
  // (`rounded-sm`/`rounded-lg`/etc) as `calc(var(--radius) ± Npx)` at each
  // utility class's own point of use rather than defining intermediate
  // `--radius-sm`/`--radius-lg` custom properties — verified in the
  // compiled output — so overriding `borderRadius` here already
  // propagates to the entire derived scale with nothing more needed.
  borderRadius?: string;

  // Fonts. These write `--ui-font-sans`/`--ui-font-mono`, the override hooks
  // `globals.css` reads ahead of the app's own font variable — see the comment
  // on the `@theme inline` block there for why the indirection is required
  // (#343).
  fontSans?: string;
  fontMono?: string;
}

export interface ThemeConfig {
  token?: ThemeToken;
  // Applied on top of `token` (per-key override, not a full replacement)
  // only while dark mode is actually active — lets an app specify "this
  // one color should differ in dark mode" without needing a second nested
  // Config just to swap a single token.
  darkToken?: ThemeToken;
  // 'system' follows prefers-color-scheme and re-evaluates live on change.
  // Unlike the old boolean, an explicit 'light'/'dark' here also doubles
  // as how a nested Config opts out of an ancestor's dark mode — merging
  // is shallow (`{...parent.theme, ...theme}`), so there was previously
  // no way to distinguish "child didn't set dark" (inherit) from "child
  // wants it off" (override), since plain `undefined` on an omitted key
  // doesn't survive the spread either way. Every explicit value here now
  // means what it says; only actually omitting the key means "inherit."
  dark?: 'light' | 'dark' | 'system';
}

// Built-in text that components render (visible labels and `aria-label`s).
// Shared words sit at the top level; component-specific text is grouped by
// component name. Every key is optional: a nested Config merges each group
// key by key, and anything left out falls back to the parent Config and
// finally to `enUS`. Component props (`nextLabel`, `labels`, ...) still win
// over the locale. `{name}`-style placeholders are filled in by the
// component.
export interface Locale {
  close?: string;
  clear?: string;
  backToTop?: string;
  loading?: string;
  expand?: string;
  collapse?: string;
  back?: string;
  ok?: string;
  cancel?: string;
  retry?: string;
  loadFailed?: string;
  preview?: string;
  search?: string;
  searchPlaceholder?: string;
  noData?: string;
  noResults?: string;
  Anchor?: { label?: string };
  AutoComplete?: { empty?: string };
  Breadcrumb?: { label?: string; expand?: string };
  Cascader?: { placeholder?: string; clear?: string; empty?: string };
  DatePicker?: {
    placeholder?: string;
    time?: string;
    /** A date-fns locale for the formatted date, e.g. `ko` from `date-fns/locale`. */
    dateLocale?: DateFnsLocale;
  };
  InputNumber?: { decrease?: string; increase?: string };
  Mentions?: { loading?: string; empty?: string };
  Pagination?: {
    navigation?: string;
    /** `{page}` is the page number. */
    page?: string;
    previous?: string;
    next?: string;
    first?: string;
    last?: string;
    pageSize?: string;
    /** `{size}` is the page size. */
    pageSizeOption?: string;
    jump?: string;
    go?: string;
  };
  Popconfirm?: { confirm?: string; error?: string };
  RichTextEditor?: {
    placeholder?: string;
    link?: string;
    undo?: string;
    redo?: string;
    bold?: string;
    italic?: string;
    underline?: string;
    strikethrough?: string;
    inlineCode?: string;
    bulletList?: string;
    orderedList?: string;
    blockquote?: string;
    codeBlock?: string;
    horizontalRule?: string;
    style?: string;
    paragraph?: string;
    /** `{level}` is the heading level. */
    heading?: string;
    fontSize?: string;
    apply?: string;
  };
  Select?: { placeholder?: string };
  Steps?: { label?: string };
  Tabs?: { list?: string };
  TimePicker?: { clear?: string };
  Tour?: {
    previous?: string;
    next?: string;
    finish?: string;
    close?: string;
    /** `{current}` and `{total}` are one-based. */
    progress?: string;
  };
  Transfer?: {
    moveToChosen?: string;
    moveToAvailable?: string;
    selectAll?: string;
    empty?: string;
    /** `{visible}`, `{total}` and `{selected}` are item counts. */
    count?: string;
  };
  Tree?: { label?: string; empty?: string };
  TreeSelect?: { placeholder?: string; popup?: string; empty?: string };
  Upload?: {
    hint?: string;
    hintMultiple?: string;
    /** `{name}` is the file name. */
    remove?: string;
  };
}

// `Locale` with every key and every group key filled in, as `useLocale`
// returns it.
export type ResolvedLocale = {
  [K in keyof Locale]-?: NonNullable<Locale[K]> extends string
    ? string
    : K extends 'DatePicker'
      ? Required<Omit<NonNullable<Locale[K]>, 'dateLocale'>> &
          Pick<NonNullable<Locale[K]>, 'dateLocale'>
      : Required<NonNullable<Locale[K]>>;
};

// antd's componentSize equivalent — components with a `size` prop (e.g.
// Button) read this as their fallback when the caller doesn't pass one
// explicitly, instead of each hardcoding its own default.
export type ComponentSize = 'small' | 'middle' | 'large';

// Per-component default props (e.g. { button: { shape: 'round' } }), keyed
// by an informal lowercase component name each opting-in component reads
// itself (e.g. Button reads defaultProps?.button). Deliberately untyped
// beyond this shape rather than importing every component's real Props
// type here: Config lives in providers/, several components already import
// useConfig from providers/ (for componentSize/locale/etc), so importing
// their Props back into this file would be circular. Each component casts
// its own slice locally instead. Merges shallowly per outer key, same as
// theme/locale/componentSize — a nested Config's own `button` entry (if
// set at all) fully replaces the parent's, it doesn't deep-merge the two.
export type DefaultProps = Record<string, Record<string, unknown>>;

export interface ContextValue {
  theme: ThemeConfig;
  locale: Locale;
  direction?: 'ltr' | 'rtl';
  // Resolves, in order: an explicit `getContainer` prop on the nearest
  // Config, that Config's own themed wrapper element (if it renders one —
  // see needsWrapper in config.tsx), or the parent Config's resolution.
  // Portal-based primitives (Dialog/Popover/Select/Drawer) call this as
  // their default `container` so themed/dark-mode content they render
  // (via Base UI portals to document.body by default) stays a DOM
  // descendant of the themed wrapper instead of an unthemed sibling.
  // Returns undefined when nothing in the tree renders a wrapper, so
  // callers fall back to their own normal default (document.body).
  getContainer: () => HTMLElement | undefined;
  componentSize?: ComponentSize;
  defaultProps?: DefaultProps;
  // False for the raw context default (no <Config> ancestor) — every
  // <Config>, even one rendering with no props at all, sets this true, so
  // `useConfig().isConfigured` tells a consumer whether the values it got
  // are real app configuration or just the library's built-in fallbacks.
  isConfigured: boolean;
}
