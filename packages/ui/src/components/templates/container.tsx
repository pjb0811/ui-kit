'use client';

import { useRender } from '@base-ui/react/use-render';

import { cn } from '@repo/ui/utils';

type MaxWidth =
  | '3xs'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | 'full'
  | 'none';

const MAX_WIDTH_CLASSES: Record<MaxWidth, string> = {
  '3xs': 'max-w-3xs',
  '2xs': 'max-w-2xs',
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
  none: 'max-w-none',
};

export interface Props extends Omit<
  useRender.ComponentProps<'div'>,
  'className'
> {
  maxWidth?: MaxWidth;
  padded?: boolean;
  className?: string;
}

// Standardizes the `mx-auto max-w-7xl px-4` wrapper every app in this
// monorepo was rewriting by hand inside Content — one place to change the
// page's content width/gutters instead of N call sites.
const Container = ({
  className,
  maxWidth = '7xl',
  padded = true,
  render,
  ...props
}: Props) => {
  return useRender({
    defaultTagName: 'div',
    render,
    props: {
      ...props,
      className: cn(
        'mx-auto w-full',
        MAX_WIDTH_CLASSES[maxWidth],
        padded && 'px-4 sm:px-6 lg:px-8',
        className,
        //
      ),
    },
  });
};

export default Container;
