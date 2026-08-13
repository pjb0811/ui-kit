import { createContext, useContext } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface RowContextValue {
  gutterX: number;
  gutterY: number;
}

// Defaults assume Col is used without a Row (not the intended usage, but
// shouldn't crash).
export const RowContext = createContext<RowContextValue>({
  gutterX: 0,
  gutterY: 0,
});

export const useRowContext = () => useContext(RowContext);
