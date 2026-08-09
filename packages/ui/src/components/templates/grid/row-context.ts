import { createContext, useContext } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface RowContextValue {
  gutterX: number;
  gutterY: number;
  breakpoint: Breakpoint;
}

// Defaults assume Col is used without a Row (not the intended usage, but
// shouldn't crash) — 'xs' matches useResponsiveSize's own SSR-safe initial
// guess (measures 0 width before mount), same mobile-first default Sider's
// breakpoint feature already relies on.
export const RowContext = createContext<RowContextValue>({
  gutterX: 0,
  gutterY: 0,
  breakpoint: 'xs',
});

export const useRowContext = () => useContext(RowContext);
