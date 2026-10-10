'use client';

import { createContext } from 'react';

export type Layout = 'vertical' | 'horizontal';

export const LayoutContext = createContext<Layout>('vertical');
export const RequiredContext = createContext(false);
