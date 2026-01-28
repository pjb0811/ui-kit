import * as React from 'react';

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function renderConditional<T extends React.ReactNode>(
  value: T,
  wrapper?: (value: NonNullable<T>) => React.ReactNode,
): React.ReactNode {
  if (value === null || value === undefined) {
    return null;
  }

  if (React.isValidElement(value)) {
    return value;
  }

  return wrapper ? wrapper(value as NonNullable<T>) : value;
}
