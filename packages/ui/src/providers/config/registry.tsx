'use client';

import { Context } from './context';
import type { ContextValue } from './types';

// The imperative stack (Modal.*/Toast.*, see organisms/imperative-stack.tsx)
// renders into its own React root, outside any <Config> ancestor — there's
// no call-site component to read useConfig() from, since these are plain
// function calls, not JSX. This module-level registry is how that root
// finds a Config to inherit anyway: the app's root Config registers its
// current context value here, and the stack re-wraps itself with it as a
// snapshot at render time (not a live subscription — a Modal/Toast that's
// already open won't pick up a Config change made after it was created,
// same "reflects state at creation" behavior as everything else about the
// imperative API being a one-shot call).
//
// Only the root Config (no Config ancestor of its own — see
// `isRoot` in config.tsx) registers. A section-local nested Config (used
// for one-off theming of part of a page) intentionally does not — an app-
// wide `Modal.confirm()` call has no natural association with whichever
// nested Config happened to render most recently, so it should inherit
// the app's actual root configuration instead.
let currentValue: ContextValue | null = null;

export const registerRootConfig = (value: ContextValue): (() => void) => {
  currentValue = value;

  return () => {
    if (currentValue === value) {
      currentValue = null;
    }
  };
};

export const getRootConfigValue = (): ContextValue | null => currentValue;

// Wraps the imperative stack's rendered items with whatever the root
// Config's snapshot currently is, so useConfig() inside Modal/Toast (and
// anything they render) resolves theme/locale/componentSize/etc instead of
// the raw context default. A no-op passthrough when no root Config has
// registered (e.g. no <Config> anywhere in the app).
export const ConfigSnapshotProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const value = getRootConfigValue();

  if (!value) {
    return children;
  }

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
