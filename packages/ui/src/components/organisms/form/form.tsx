'use client';

import type { ComponentPropsWithRef } from 'react';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { form } from '../../../core';
import { type Layout, LayoutContext } from './context';

type Values = Record<string, unknown>;

export interface Props<T extends Values = Values> extends Omit<
  ComponentPropsWithRef<typeof form.Form<T>>,
  'className' | 'render'
> {
  layout?: Layout;
  className?: string;
}

const Form = <T extends Values = Values>({
  layout = 'vertical',
  className,
  dir,
  ...props
}: Props<T>) => {
  const { direction } = useConfig();

  return (
    <LayoutContext.Provider value={layout}>
      <form.Form<T>
        data-slot="form"
        dir={dir ?? direction}
        className={cn(
          '@container/form flex w-full min-w-0 flex-col gap-5',
          className, //
        )}
        {...props}
      />
    </LayoutContext.Provider>
  );
};

export default Form;
