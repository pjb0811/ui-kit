'use client';

import { type ReactNode, useMemo } from 'react';

import { ChevronDownIcon, XIcon } from 'lucide-react';

import { DEFAULT_LOCALE, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { combobox, select } from '../../core';
import Button from './button';
import Input from './input';

const {
  Combobox: Core,
  ComboboxClear,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxIcon,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  createItems,
} = combobox;

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface OptionGroup {
  label: string;
  options: Option[];
}

interface ItemsGroup {
  key: number;
  value: string;
  items: Option[];
  grouped: boolean;
}

const isGroup = (option: Option | OptionGroup): option is OptionGroup => {
  return 'options' in option && Array.isArray(option.options);
};

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
  searchable: true;
  /** Accessible name for the trigger and search popup. */
  label: string;
  options: (Option | OptionGroup)[];
  placeholder?: string;
  searchPlaceholder?: string;
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

const SearchableSelect = ({
  label,
  options,
  placeholder,
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  allowClear = true,
  className,
  classNames,
  onChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Do not forward the public mode switch to Base UI.
  searchable: _searchable,
  ...props
}: Props) => {
  const { locale } = useConfig();
  const groups = useMemo(() => {
    const result: ItemsGroup[] = [];

    options.forEach((option, index) => {
      if (isGroup(option)) {
        result.push({
          key: index,
          value: option.label,
          items: option.options,
          grouped: true,
        });
      } else {
        const previous = result.at(-1);

        if (previous && !previous.grouped) {
          previous.items.push(option);
        } else {
          result.push({
            key: index,
            value: '',
            items: [option],
            grouped: false,
          });
        }
      }
    });

    return result;
  }, [options]);
  const items = useMemo(
    () =>
      createItems<Option, string>(groups, {
        getValue: option => option.value,
        getLabel: option => option.label,
      }),
    [groups],
  );

  return (
    <Core items={items} onValueChange={value => onChange?.(value)} {...props}>
      <ComboboxTrigger
        data-slot="select-trigger"
        data-size="default"
        aria-label={label}
        className={cn(select.selectTriggerStyles, 'w-full max-w-48', className)}
      >
        <span
          data-slot="select-value"
          className="min-w-0 flex-1 truncate text-start"
        >
          <ComboboxValue placeholder={placeholder} />
        </span>
        <ComboboxIcon className="opacity-50">
          <ChevronDownIcon />
        </ComboboxIcon>
      </ComboboxTrigger>
      <ComboboxContent aria-label={label} className={classNames?.content}>
        <div className="border-b p-1">
          <div className="relative flex items-center">
            <ComboboxInput
              render={
                <Input
                  aria-label={`${label} search`}
                  placeholder={searchPlaceholder}
                  className={cn(allowClear && 'pe-8', classNames?.input)}
                />
              }
            />
            {allowClear && (
              <ComboboxClear
                data-slot="combobox-clear"
                render={
                  <Button
                    variant="text"
                    size="icon-sm"
                    icon={<XIcon />}
                    aria-label={locale.clear ?? DEFAULT_LOCALE.clear}
                    className="absolute end-0"
                  />
                }
              />
            )}
          </div>
        </div>
        <ComboboxEmpty className={classNames?.empty}>{emptyText}</ComboboxEmpty>
        <ComboboxList className={classNames?.list}>
          {(group: ItemsGroup) => (
            <ComboboxGroup key={group.key} items={group.items}>
              {group.grouped && (
                <ComboboxGroupLabel
                  data-slot="combobox-group-label"
                  className="text-muted-foreground px-2 py-1.5 text-xs"
                >
                  {group.value}
                </ComboboxGroupLabel>
              )}
              <ComboboxCollection>
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
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Core>
  );
};

export default SearchableSelect;
