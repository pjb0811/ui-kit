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
}
