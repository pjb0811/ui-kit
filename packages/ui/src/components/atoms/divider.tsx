'use client';

import type { ComponentProps, ReactNode } from 'react';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { separator } from '../../core';

export interface Props extends Omit<
  ComponentProps<typeof separator.Separator>,
  'children' | 'className'
> {
  children?: ReactNode;
  variant?: 'solid' | 'dashed' | 'dotted';
  titlePlacement?: 'start' | 'center' | 'end';
  className?: string;
  classNames?: {
    line?: string;
    label?: string;
  };
}

const variants = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
};

const Divider = ({
  children,
  orientation = 'horizontal',
  decorative = true,
  variant = 'solid',
  titlePlacement = 'center',
  className,
  classNames,
  dir,
  'aria-label': ariaLabel,
  ...props
}: Props) => {
  const { direction } = useConfig();
  const hasLabel =
    children !== undefined && children !== null && children !== false;
  const isVertical = orientation === 'vertical';
  const label =
    typeof children === 'string' || typeof children === 'number'
      ? String(children)
      : undefined;
  const lineClassName = cn(
    'border-border min-w-0 flex-1',
    isVertical ? 'min-h-0 border-s' : 'border-t',
    variants[variant],
    classNames?.line,
    //
  );

  return (
    <separator.Separator
      {...props}
      data-slot="divider"
      dir={dir ?? direction}
      orientation={orientation}
      decorative={decorative}
      aria-label={decorative ? ariaLabel : (ariaLabel ?? label)}
      className={cn(
        `text-foreground flex bg-transparent
        data-[orientation=horizontal]:h-auto data-[orientation=vertical]:h-auto
        data-[orientation=vertical]:w-auto`,
        isVertical
          ? 'mx-2 h-auto w-auto flex-col items-center self-stretch'
          : 'my-4 h-auto w-full items-center',
        hasLabel && 'gap-3',
        className,
        //
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          lineClassName,
          hasLabel && titlePlacement === 'start' && 'flex-[0.1]',
          //
        )}
      />
      {hasLabel && (
        <>
          <span
            data-slot="divider-label"
            className={cn(
              'min-w-0 shrink text-sm font-medium [overflow-wrap:anywhere]',
              classNames?.label,
              //
            )}
          >
            {children}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              lineClassName,
              titlePlacement === 'end' && 'flex-[0.1]',
              //
            )}
          />
        </>
      )}
    </separator.Separator>
  );
};

export default Divider;
