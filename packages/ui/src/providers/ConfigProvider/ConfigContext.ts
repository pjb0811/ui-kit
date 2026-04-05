'use client';

import { createContext, useContext } from 'react';

import type { ConfigContextValue } from './types';

export const ConfigContext = createContext<ConfigContextValue>({
  theme: {},
});

export const useConfig = () => useContext(ConfigContext);
