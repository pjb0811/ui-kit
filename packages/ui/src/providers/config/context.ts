'use client';

import { createContext, useContext } from 'react';

import { enUS, mergeLocale } from './locales';
import type { ContextValue, ResolvedLocale } from './types';

// The text components fall back to. It is `enUS`; pass `koKR` (or your
// own `Locale`) to `Config` for another language.
export const DEFAULT_LOCALE: ResolvedLocale = enUS;

export const Context = createContext<ContextValue>({
  theme: {},
  locale: DEFAULT_LOCALE,
  getContainer: () => undefined,
  isConfigured: false,
});

export const useConfig = () => useContext(Context);

// The nearest Config's locale with every key filled in from `enUS`.
export const useLocale = (): ResolvedLocale =>
  mergeLocale(DEFAULT_LOCALE, useContext(Context).locale);
