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

  const mergedTheme = useMemo<ThemeConfig>(
    () => ({
      ...parent.theme,
      ...theme,
      token: {
        ...parent.theme.token,
        ...theme.token,
      },
    }),
    [parent.theme, theme],
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
          style={hasCssVars ? cssVars : undefined}
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
