'use client';

import { useMediaQuery } from '@jbpark/use-hooks';

import { useConfig } from './context';
import type { ThemeConfig } from './types';

const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

// No `window` during SSR, so there's no way to know the visitor's actual
// preference before hydration — assume light (the conservative default)
// and let useSyncExternalStore correct it client-side once matchMedia is
// available, same flash-of-incorrect-guess tradeoff already accepted for
// Sider's breakpoint prop elsewhere in this library. `useMediaQuery`'s
// server snapshot is its `defaultValue`, which is `false` when omitted.
export const useSystemPrefersDark = () => useMediaQuery(DARK_MEDIA_QUERY);

/**
 * Turns the three-valued `theme.dark` setting into the boolean that decides
 * whether dark treatments actually apply. Kept as a pure function so `Config`
 * can resolve the theme it is about to publish (its merged value isn't in
 * context yet) while consumers resolve the one already in context, without the
 * two drifting apart.
 */
export const resolveDark = (
  dark: ThemeConfig['dark'],
  systemPrefersDark: boolean,
) => (dark === 'system' ? systemPrefersDark : dark === 'dark');

/**
 * Whether dark mode is active for the nearest `Config`, with `'system'`
 * resolved against `prefers-color-scheme`.
 *
 * Internal to the package: components that render *CSS* can just use Tailwind's
 * `dark:` variants against the `.dark` class `Config` puts on its wrapper. This
 * exists for the ones that have to hand a light/dark choice to a third party in
 * JS instead — `CodeEditor` picking a CodeMirror theme extension.
 */
export const useIsDarkActive = () => {
  const { theme } = useConfig();

  return resolveDark(theme.dark, useSystemPrefersDark());
};
