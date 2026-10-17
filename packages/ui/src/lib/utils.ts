import * as React from 'react';

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Renders a slot value, applying `wrapper` only to values that aren't already
 * a React element. Passing an element opts out of the wrapper entirely.
 *
 * **Only use this for content slots where that opt-out is the point** — a
 * `title` the caller may want to supply as their own heading, so we don't end
 * up nesting `<h6><h3>`. Do *not* use it for a wrapper that carries layout the
 * component owns (padding, `shrink-0`, a footer bar): the common case is an
 * element, so the wrapper would be skipped exactly when it's needed, and any
 * `classNames.*` threaded through it would silently do nothing. Write those as
 * a plain `{value != null && <Wrapper>{value}</Wrapper>}`.
 */
export const renderConditional = <T extends React.ReactNode>(
  value: T,
  wrapper?: (value: NonNullable<T>) => React.ReactNode,
): React.ReactNode => {
  if (value === null || value === undefined) {
    return null;
  }

  if (React.isValidElement(value)) {
    return value;
  }

  return wrapper ? wrapper(value as NonNullable<T>) : value;
};
