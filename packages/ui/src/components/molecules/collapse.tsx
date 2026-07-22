'use client';

import React from 'react';

import { accordion } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

const { Accordion, AccordionItem, AccordionTrigger, AccordionContent } =
  accordion;

interface Item {
  key: React.Key;
  label: React.ReactNode;
  disabled?: boolean;
  children: React.ReactNode;
}

interface Props extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'onChange'
> {
  items?: Item[];
  accordion?: boolean;
  expandIcon?: React.ReactNode;
  classNames?: {
    item?: string;
    header?: string;
    body?: string;
  };
  defaultActiveKey?: string[] | number[];
  activeKey?: string[] | number[];
  onChange?: (keys: string[]) => void;
}

const Collapse = ({
  expandIcon,
  accordion = false,
  items = [],
  className,
  classNames,
  defaultActiveKey,
  activeKey: _activeKey,
  onChange: _onChange,
}: Props) => {
  const controlled = _activeKey !== undefined;

  const accordionProps = accordion
    ? controlled
      ? {
          type: 'single' as const,
          value: `${_activeKey?.[0] ?? ''}`,
          onValueChange: (value: string) => {
            _onChange?.(value ? [value] : []);
          },
        }
      : {
          type: 'single' as const,
          defaultValue: `${defaultActiveKey?.[0] ?? ''}`,
        }
    : controlled
      ? {
          type: 'multiple' as const,
          value: _activeKey?.map(key => `${key}`),
          onValueChange: (values: string[]) => {
            _onChange?.(values);
          },
        }
      : {
          type: 'multiple' as const,
          defaultValue: defaultActiveKey?.map(key => `${key}`),
        };

  return (
    <Accordion className={className} {...accordionProps}>
      {items.map(({ label, children, disabled }, key) => (
        <AccordionItem
          key={key}
          value={`${key}`}
          className={cn(
            'border-none',
            classNames?.item,
            //
          )}
          disabled={disabled}
        >
          <AccordionTrigger
            className={cn(
              'hover:no-underline',
              classNames?.header,
              disabled && 'cursor-no-drop opacity-50',
              //
            )}
            expandIcon={expandIcon}
            disabled={disabled}
          >
            {label}
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              classNames?.body,
              //
            )}
          >
            {children}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default Collapse;
