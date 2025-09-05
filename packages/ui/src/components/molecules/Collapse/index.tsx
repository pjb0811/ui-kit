import React, { useEffect, useState } from 'react';

import { cn } from '@repo/ui/utils';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../core/accordion';

interface Item {
  key: React.Key;
  label: React.ReactNode;
  disabled?: boolean;
  children: React.ReactNode;
}

interface Props extends React.HTMLAttributes<HTMLElement> {
  items?: Item[];
  accordion?: boolean;
  expandIcon?: React.ReactNode;
  classNames?: {
    item?: string;
    header?: string;
    body?: string;
  };
  defaultActiveKey?: string[] | number[];
}

const Collapse = ({
  expandIcon,
  accordion = false,
  items: _items = [],
  className,
  classNames,
  defaultActiveKey,
}: Props) => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    setItems(_items);
  }, [_items]);

  return (
    <Accordion
      className={className}
      {...(accordion
        ? {
            type: 'single',
            defaultValue: `${defaultActiveKey?.[0]}`,
          }
        : {
            type: 'multiple',
            defaultValue: defaultActiveKey?.map(key => `${key}`),
          })}
      //
    >
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
