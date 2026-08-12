'use client';

import { createContext, useContext } from 'react';

import type { ContextValue, Locale } from './types';

export const DEFAULT_LOCALE: Required<Locale> = {
  close: '닫기',
  clear: '지우기',
  backToTop: '맨 위로',
  loading: '로딩 중',
  expand: '펼치기',
  collapse: '접기',
  back: '뒤로가기',
  ok: 'OK',
  cancel: 'Cancel',
};

export const Context = createContext<ContextValue>({
  theme: {},
  locale: DEFAULT_LOCALE,
  getContainer: () => undefined,
  isConfigured: false,
});

export const useConfig = () => useContext(Context);
