'use client';

import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

import { DirectionProvider } from '@radix-ui/react-direction';

import { cn } from '@repo/ui/utils';

import { Context, DEFAULT_LOCALE, useConfig } from './context';
import type { ComponentSize, Locale, ThemeConfig, ThemeToken } from './types';

const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

const subscribeToSystemColorScheme = (callback: () => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const mql = window.matchMedia(DARK_MEDIA_QUERY);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
};

const getSystemPrefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia(DARK_MEDIA_QUERY).matches;

// No `window` during SSR, so there's no way to know the visitor's actual
// preference before hydration — assume light (the conservative default)
// and let useSyncExternalStore correct it client-side once matchMedia is
// available, same flash-of-incorrect-guess tradeoff already accepted for
// Sider's breakpoint prop elsewhere in this library.
const getServerSnapshot = () => false;

const useSystemPrefersDark = () =>
  useSyncExternalStore(
    subscribeToSystemColorScheme,
    getSystemPrefersDark,
    getServerSnapshot,
  );

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

  btnBackground: '--btn-bg',
  btnBackgroundHover: '--btn-bg-hover',
  btnBackgroundActive: '--btn-bg-active',
  btnBorder: '--btn-border',
  btnForeground: '--btn-fg',

  sidebar: '--sidebar',
  sidebarForeground: '--sidebar-foreground',
  sidebarPrimary: '--sidebar-primary',
  sidebarPrimaryForeground: '--sidebar-primary-foreground',
  sidebarAccent: '--sidebar-accent',
  sidebarAccentForeground: '--sidebar-accent-foreground',
  sidebarBorder: '--sidebar-border',
  sidebarRing: '--sidebar-ring',

  chart1: '--chart-1',
  chart2: '--chart-2',
  chart3: '--chart-3',
  chart4: '--chart-4',
  chart5: '--chart-5',

  fontSans: '--font-sans',
  fontMono: '--font-mono',
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
  locale?: Locale;
  getContainer?: () => HTMLElement;
  componentSize?: ComponentSize;
  direction?: 'ltr' | 'rtl';
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const Config = ({
  theme = {},
  locale = {},
  getContainer,
  componentSize,
  direction,
  className,
  style,
  children,
}: Props) => {
  const parent = useConfig();
  const [wrapperEl, setWrapperEl] = useState<HTMLDivElement | null>(null);

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
  const localeKey = JSON.stringify(locale);
  const parentLocaleKey = JSON.stringify(parent.locale);

  const mergedTheme = useMemo<ThemeConfig>(
    () => ({
      ...parent.theme,
      ...theme,
      token: {
        ...parent.theme.token,
        ...theme.token,
      },
      darkToken: {
        ...parent.theme.darkToken,
        ...theme.darkToken,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parentThemeKey, themeKey],
  );

  const mergedLocale = useMemo<Locale>(
    () => ({
      ...parent.locale,
      ...locale,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parentLocaleKey, localeKey],
  );

  const systemPrefersDark = useSystemPrefersDark();
  const isDarkActive =
    mergedTheme.dark === 'system'
      ? systemPrefersDark
      : mergedTheme.dark === 'dark';

  // `darkToken` overrides individual keys of `token` (not a full swap)
  // only while dark mode is actually active.
  const cssVars = useMemo(
    () =>
      buildCssVars(
        isDarkActive
          ? { ...mergedTheme.token, ...mergedTheme.darkToken }
          : mergedTheme.token,
      ),
    [mergedTheme.token, mergedTheme.darkToken, isDarkActive],
  );

  const hasCssVars = Object.keys(cssVars).length > 0;
  const hasDarkMode = mergedTheme.dark !== undefined;
  const needsWrapper =
    hasCssVars || hasDarkMode || !!className || !!style || !!direction;

  // Resolution order: an explicit `getContainer` prop on this Config wins;
  // otherwise, if this Config renders its own themed wrapper below, that's
  // the default (portaled content appended into it still inherits its CSS
  // custom properties and matches the `.dark` selector — `display:
  // contents` only removes the element from the layout box tree, not from
  // the DOM/cascade); otherwise defer to the parent Config's resolution,
  // so an inner Config that only sets e.g. `locale` doesn't shadow an
  // outer one's theme container.
  const resolvedGetContainer = useCallback((): HTMLElement | undefined => {
    if (getContainer) {
      return getContainer();
    }
    if (needsWrapper && wrapperEl) {
      return wrapperEl;
    }
    return parent.getContainer();
  }, [getContainer, needsWrapper, wrapperEl, parent]);

  const resolvedComponentSize = componentSize ?? parent.componentSize;
  const resolvedDirection = direction ?? parent.direction;

  const contextValue = useMemo(
    () => ({
      theme: mergedTheme,
      locale: mergedLocale,
      getContainer: resolvedGetContainer,
      componentSize: resolvedComponentSize,
      direction: resolvedDirection,
      isConfigured: true,
    }),
    [
      mergedTheme,
      mergedLocale,
      resolvedGetContainer,
      resolvedComponentSize,
      resolvedDirection,
    ],
  );

  const content = (
    <Context.Provider value={contextValue}>
      {needsWrapper ? (
        <div
          ref={setWrapperEl}
          dir={direction}
          className={cn(isDarkActive && 'dark', className)}
          style={{
            ...(hasCssVars ? cssVars : undefined),
            ...style,
            // Keeps this element out of the layout box tree — so it
            // doesn't intercept flex/grid child relationships or break
            // height chains like min-h-screen — while custom properties
            // and the `dark` class selector still cascade to children
            // normally (inheritance and box generation are separate
            // mechanisms in CSS). Note this means className/style
            // shouldn't be used here for anything that needs a real box
            // (padding, background, borders); Config's className/style are
            // meant for theming hooks (the `dark` class, arbitrary
            // selector hooks, custom properties), not layout — spread
            // after the caller's `style` so it can't be overridden into
            // something that reintroduces the layout-breaking wrapper this
            // was added to fix in the first place.
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

  // DirectionProvider is Radix's own mechanism (@radix-ui/react-direction)
  // for propagating `dir` to every primitive that calls its useDirection()
  // internally — Select, Menu (Dropdown/Menu), Accordion (Collapse),
  // RadioGroup, ScrollArea all pick up RTL automatically this way, no
  // per-component wiring needed. Only wraps when this Config's own
  // `direction` prop is set (not the merely-inherited resolved value) —
  // context already cascades on its own, so re-wrapping at every nested
  // Config that doesn't override direction would just be redundant.
  // Components with hardcoded LTR-only layout logic that Radix's Direction
  // context doesn't reach (Popover placement, Splitter, Sider, Drawer)
  // aren't covered by this and would need dedicated follow-up work.
  return direction ? (
    <DirectionProvider dir={direction}>{content}</DirectionProvider>
  ) : (
    content
  );
};

export default Config;
export { useConfig, DEFAULT_LOCALE };
export type { Props, ComponentSize, Locale, ThemeConfig, ThemeToken };
