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

  // Border Radius
  borderRadius?: string;
}

export interface ThemeConfig {
  token?: ThemeToken;
  dark?: boolean;
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
}
