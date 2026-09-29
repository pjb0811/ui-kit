'use client';

import { type ReactNode, useMemo } from 'react';

import { ChevronDownIcon, XIcon } from 'lucide-react';

import { DEFAULT_LOCALE, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { combobox } from '../../core';
import Button from './button';
import Input from './input';

const {
  Combobox: Core,
  ComboboxClear,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  createItems,
} = combobox;

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface Props extends Omit<
  combobox.RootProps<string, Option>,
  | 'children'
  | 'items'
  | 'multiple'
  | 'filteredItems'
  | 'onValueChange'
  | 'itemToStringLabel'
  | 'itemToStringValue'
  | 'isItemEqualToValue'
> {
  /** Accessible name for the text input. */
  label: string;
  options: Option[];
  placeholder?: string;
  emptyText?: ReactNode;
  allowClear?: boolean;
  className?: string;
  classNames?: {
    input?: string;
    content?: string;
    list?: string;
    item?: string;
    empty?: string;
  };
  onChange?: (value: string | null) => void;
}

const Combobox = ({
  label,
  options,
  placeholder,
  emptyText = 'No results found.',
  allowClear = true,
  className,
  classNames,
  onChange,
  disabled,
  ...props
}: Props) => {
  const { locale } = useConfig();
  const items = useMemo(
    () =>
      createItems(options, {
        getValue: option => option.value,
        getLabel: option => option.label,
      }),
    [options],
  );

  return (
    <Core
      items={items}
      disabled={disabled}
      onValueChange={value => onChange?.(value)}
      {...props}
    >
      <ComboboxInputGroup
        data-slot="combobox-input-group"
        className={cn('relative flex w-full max-w-64 items-center', className)}
      >
        <ComboboxInput
          render={
            <Input
              aria-label={label}
              placeholder={placeholder}
              className={cn('pe-16', classNames?.input)}
            />
          }
        />
        <div className="absolute end-1 flex items-center gap-0.5">
          {allowClear && (
            <ComboboxClear
              render={
                <Button
                  variant="text"
                  size="icon-sm"
                  icon={<XIcon />}
                  aria-label={locale.clear ?? DEFAULT_LOCALE.clear}
                />
              }
            />
          )}
          <ComboboxTrigger
            render={
              <Button
                variant="text"
                size="icon-sm"
                icon={<ChevronDownIcon />}
                aria-label={locale.expand ?? DEFAULT_LOCALE.expand}
              />
            }
          />
        </div>
      </ComboboxInputGroup>
      <ComboboxContent className={classNames?.content}>
        <ComboboxEmpty className={classNames?.empty}>{emptyText}</ComboboxEmpty>
        <ComboboxList className={classNames?.list}>
          {(option: Option) => (
            <ComboboxItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className={classNames?.item}
            >
              {option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Core>
  );
};

export default Combobox;
