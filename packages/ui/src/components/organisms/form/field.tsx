'use client';

import { type ComponentPropsWithRef, type ReactNode, useContext } from 'react';

import { cn } from '@repo/ui/utils';

import { form } from '../../../core';
import { type Layout, LayoutContext, RequiredContext } from './context';

export interface Props extends Omit<
  ComponentPropsWithRef<typeof form.Field.Root>,
  'className' | 'render' | 'children'
> {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  children?: ReactNode;
  required?: boolean;
  layout?: Layout;
  className?: string;
  classNames?: {
    label?: string;
    required?: string;
    content?: string;
    description?: string;
    error?: string;
  };
}

const Field = ({
  label,
  description,
  error,
  children,
  required = false,
  layout,
  invalid,
  className,
  classNames,
  ...props
}: Props) => {
  const inheritedLayout = useContext(LayoutContext);
  const resolvedLayout = layout ?? inheritedLayout;
  const hasError =
    error !== undefined && error !== null && error !== false && error !== '';

  return (
    <RequiredContext.Provider value={required}>
      <form.Field.Root
        {...props}
        data-slot="form-field"
        invalid={invalid || hasError}
        className={cn(
          'grid min-w-0 gap-2',
          resolvedLayout === 'horizontal' &&
            `@md/form:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]
            @md/form:items-start`,
          className, //
        )}
      >
        {label != null && (
          <form.Field.Label
            data-slot="form-label"
            className={cn(
              `flex min-w-0 items-center gap-1 text-sm font-medium
              data-disabled:opacity-50`,
              resolvedLayout === 'horizontal' && '@md/form:pt-2',
              classNames?.label, //
            )}
          >
            {label}
            {required && (
              <span
                aria-hidden="true"
                className={cn(
                  'text-destructive',
                  classNames?.required, //
                )}
              >
                *
              </span>
            )}
          </form.Field.Label>
        )}
        <div
          data-slot="form-field-content"
          className={cn(
            'flex min-w-0 flex-col gap-1.5',
            classNames?.content, //
          )}
        >
          {children}
          {description != null && (
            <form.Field.Description
              data-slot="form-description"
              className={cn(
                'text-muted-foreground text-sm [overflow-wrap:anywhere]',
                classNames?.description, //
              )}
            >
              {description}
            </form.Field.Description>
          )}
          <form.Field.Error
            {...(hasError ? { children: error } : {})}
            data-slot="form-error"
            role="alert"
            match={hasError ? true : undefined}
            className={cn(
              'text-destructive text-sm [overflow-wrap:anywhere]',
              classNames?.error, //
            )}
          />
        </div>
      </form.Field.Root>
    </RequiredContext.Provider>
  );
};

export default Field;
