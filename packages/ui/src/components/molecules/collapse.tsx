'use client';

import React from 'react';

import { cn } from '@repo/ui/utils';

import { accordion } from '../../core';

const { Accordion, AccordionItem, AccordionTrigger, AccordionContent } =
  accordion;

interface Item {
  key: React.Key;
  label: React.ReactNode;
  disabled?: boolean;
  children: React.ReactNode;
}

export interface Props extends Omit<
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

  // Base UI's accordion has no `type` and always models the open set as an
  // array; `multiple` (default false) is the only single-vs-multiple switch.
  // `accordion` here means "one panel open at a time", so `multiple = !accordion`.
  const accordionProps = {
    multiple: !accordion,
    onValueChange: (values: string[]) => {
      _onChange?.(values);
    },
    ...(controlled
      ? { value: (_activeKey ?? []).map(key => `${key}`) }
      : { defaultValue: (defaultActiveKey ?? []).map(key => `${key}`) }),
  };

  return (
    <Accordion {...props} className={className} {...accordionProps}>
      {items.map(({ key, label, children, disabled }) => (
        <AccordionItem
          key={key}
          value={String(key)}
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
