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

  // Button color presets (Button's color prop reads these — see
  // button.tsx's `bg-(--btn-bg)` etc)
  btnBackground?: string;
  btnBackgroundHover?: string;
  btnBackgroundActive?: string;
  btnBorder?: string;
  btnForeground?: string;

  // Sidebar
  sidebar?: string;
  sidebarForeground?: string;
  sidebarPrimary?: string;
  sidebarPrimaryForeground?: string;
  sidebarAccent?: string;
  sidebarAccentForeground?: string;
  sidebarBorder?: string;
  sidebarRing?: string;

  // Charts
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;

  // Fonts
  fontSans?: string;
  fontMono?: string;
}

export interface ThemeConfig {
  token?: ThemeToken;
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

// Every hardcoded Korean UI string in the library (Drawer's close button,
// Search's clear button, BackTop, Spin/Skeleton's loading label, Sider's
// collapse trigger) reads its label from here, falling back to its
// existing Korean default when no Config wraps it — so this is purely
// additive, not a breaking change to current behavior.
export interface Locale {
  close?: string;
  clear?: string;
  backToTop?: string;
  loading?: string;
  expand?: string;
  collapse?: string;
}

// antd's componentSize equivalent — components with a `size` prop (e.g.
// Button) read this as their fallback when the caller doesn't pass one
// explicitly, instead of each hardcoding its own default.
export type ComponentSize = 'small' | 'middle' | 'large';

export interface ContextValue {
  theme: ThemeConfig;
  locale: Locale;
  // Resolves, in order: an explicit `getContainer` prop on the nearest
  // Config, that Config's own themed wrapper element (if it renders one —
  // see needsWrapper in config.tsx), or the parent Config's resolution.
  // Portal-based primitives (Dialog/Popover/Select/Drawer) call this as
  // their default `container` so themed/dark-mode content they render
  // (via Radix/vaul portals to document.body by default) stays a DOM
  // descendant of the themed wrapper instead of an unthemed sibling.
  // Returns undefined when nothing in the tree renders a wrapper, so
  // callers fall back to their own normal default (document.body).
  getContainer: () => HTMLElement | undefined;
  componentSize?: ComponentSize;
  // False for the raw context default (no <Config> ancestor) — every
  // <Config>, even one rendering with no props at all, sets this true, so
  // `useConfig().isConfigured` tells a consumer whether the values it got
  // are real app configuration or just the library's built-in fallbacks.
  isConfigured: boolean;
}
