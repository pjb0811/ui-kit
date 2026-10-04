'use client';

import React from 'react';

import { cn } from '@repo/ui/utils';

import { accordion } from '../../core';

const { Accordion, AccordionItem, AccordionTrigger, AccordionContent } =
  accordion;

interface Item<Key extends React.Key = string> {
  key: Key;
  label: React.ReactNode;
  disabled?: boolean;
  children: React.ReactNode;
}

export interface Props<Key extends React.Key = string> extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'onChange' | 'defaultValue' | 'value' | 'dir'
> {
  items?: Item<Key>[];
  accordion?: boolean;
  expandIcon?: React.ReactNode;
  classNames?: {
    item?: string;
    header?: string;
    body?: string;
  };
  defaultActiveKey?: Key[];
  activeKey?: Key[];
  onChange?: (keys: Key[]) => void;
}

const Collapse = <Key extends React.Key = string>({
  expandIcon,
  accordion = false,
  items = [],
  className,
  classNames,
  defaultActiveKey,
  activeKey: _activeKey,
  onChange: _onChange,
  ...props
}: Props<Key>) => {
  const controlled = _activeKey !== undefined;
  const keysByValue = new Map<string, Key>(
    [
      ...(defaultActiveKey ?? []),
      ...(_activeKey ?? []),
      ...items.map(item => item.key),
    ].map(key => [String(key), key]),
  );

  // Base UI's accordion has no `type` and always models the open set as an
  // array; `multiple` (default false) is the only single-vs-multiple switch.
  // `accordion` here means "one panel open at a time", so `multiple = !accordion`.
  const accordionProps = {
    multiple: !accordion,
    onValueChange: (values: string[]) => {
      _onChange?.(
        values.flatMap(value => {
          const key = keysByValue.get(value);

          return key === undefined ? [] : [key];
        }),
      );
    },
    ...(controlled
      ? { value: (_activeKey ?? []).map(key => String(key)) }
      : { defaultValue: (defaultActiveKey ?? []).map(key => String(key)) }),
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
