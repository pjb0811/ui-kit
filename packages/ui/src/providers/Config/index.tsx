'use client';

import { useMemo } from 'react';

import { cn } from '@repo/ui/utils';

import { Context, useConfig } from './context';
import type { ThemeConfig, ThemeToken } from './types';

const tokenToCssVar: Record<keyof ThemeToken, string> = {
  colorPrimary: '--primary',
  colorPrimaryForeground: '--primary-foreground',
  colorBackground: '--background',
  colorForeground: '--foreground',
  colorCard: '--card',
  colorCardForeground: '--card-foreground',
  colorPopover: '--popover',
  colorPopoverForeground: '--popover-foreground',
  colorSecondary: '--secondary',
  colorSecondaryForeground: '--secondary-foreground',
  colorMuted: '--muted',
  colorMutedForeground: '--muted-foreground',
  colorAccent: '--accent',
  colorAccentForeground: '--accent-foreground',
  colorDestructive: '--destructive',
  colorBorder: '--border',
  colorInput: '--input',
  colorRing: '--ring',
  borderRadius: '--radius',
};

const buildCssVars = (token?: ThemeToken): React.CSSProperties => {
  if (!token) {
    return {};
  }

  const vars: Record<string, string> = {};

  for (const [key, value] of Object.entries(token)) {
    if (value === undefined) {
      continue;
    }
    const cssVar = tokenToCssVar[key as keyof ThemeToken];
    if (cssVar) {
      vars[cssVar] = value;
    }
  }

  return vars as React.CSSProperties;
};

interface Props {
  theme?: ThemeConfig;
  className?: string;
  children: React.ReactNode;
}

const Config = ({ theme = {}, className, children }: Props) => {
  const parent = useConfig();

  // `theme` is typically a fresh inline object literal at the call site
  // (and `parent.theme` inherits the same problem from its own Config
  // ancestor), so depending on them directly meant mergedTheme/contextValue
  // got a new identity on every render regardless of whether the actual
  // values changed — every useConfig() consumer in the tree re-rendered on
  // every render of whatever's above this Config, which for the common
  // app-root usage is everything. Depend on a serialized key instead so
  // the memo only invalidates when the content actually changes; these
  // are small, string/boolean-only objects, so JSON.stringify is cheap.
  const themeKey = JSON.stringify(theme);
  const parentThemeKey = JSON.stringify(parent.theme);

  const mergedTheme = useMemo<ThemeConfig>(
    () => ({
      ...parent.theme,
      ...theme,
      token: {
        ...parent.theme.token,
        ...theme.token,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parentThemeKey, themeKey],
  );

  const contextValue = useMemo(() => ({ theme: mergedTheme }), [mergedTheme]);

  const cssVars = useMemo(
    () => buildCssVars(mergedTheme.token),
    [mergedTheme.token],
  );

  const hasCssVars = Object.keys(cssVars).length > 0;
  const hasDarkMode = mergedTheme.dark !== undefined;
  const needsWrapper = hasCssVars || hasDarkMode || className;

  return (
    <Context.Provider value={contextValue}>
      {needsWrapper ? (
        <div
          className={cn(mergedTheme.dark && 'dark', className)}
          style={{
            ...(hasCssVars ? cssVars : undefined),
            // Keeps this element out of the layout box tree — so it
            // doesn't intercept flex/grid child relationships or break
            // height chains like min-h-screen — while custom properties
            // and the `dark` class selector still cascade to children
            // normally (inheritance and box generation are separate
            // mechanisms in CSS). Note this means className shouldn't be
            // used here for anything that needs a real box (padding,
            // background, borders); Config's className is meant for
            // theming hooks (the `dark` class, arbitrary selector hooks),
            // not layout.
            display: 'contents',
          }}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </Context.Provider>
  );
};

export default Config;
export { useConfig };
export type { Props, ThemeConfig, ThemeToken };
