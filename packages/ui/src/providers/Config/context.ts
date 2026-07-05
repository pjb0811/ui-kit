'use client';

import { createContext, useContext } from 'react';

import type { ContextValue } from './types';

export const Context = createContext<ContextValue>({
  theme: {},
});

export const useConfig = () => useContext(Context);
