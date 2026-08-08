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
  'onChange' | 'defaultValue' | 'value' | 'dir'
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
  ...props
}: Props) => {
  const controlled = _activeKey !== undefined;

  const accordionProps = accordion
    ? {
        type: 'single' as const,
        onValueChange: (value: string) => {
          _onChange?.(value ? [value] : []);
        },
        ...(controlled
          ? { value: `${_activeKey?.[0] ?? ''}` }
          : { defaultValue: `${defaultActiveKey?.[0] ?? ''}` }),
      }
    : {
        type: 'multiple' as const,
        onValueChange: (values: string[]) => {
          _onChange?.(values);
        },
        ...(controlled
          ? { value: _activeKey?.map(key => `${key}`) }
          : { defaultValue: defaultActiveKey?.map(key => `${key}`) }),
      };

  return (
    <Accordion {...props} className={className} {...accordionProps}>
      {items.map(({ key, label, children, disabled }) => (
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
