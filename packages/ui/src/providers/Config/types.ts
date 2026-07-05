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

export interface ContextValue {
  theme: ThemeConfig;
}
