'use client';

import { type ReactNode } from 'react';

import { ChevronDownIcon, XIcon } from 'lucide-react';

import { DEFAULT_LOCALE, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { combobox, select } from '../../core';
import Button from './button';
import Input from './input';
import SearchableOptions, {
  type ClassNames,
  type Option,
  type OptionGroup,
  useSelectItems,
} from './select-searchable-options';

const {
  Combobox: Core,
  ComboboxClear,
  ComboboxContent,
  ComboboxIcon,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxValue,
} = combobox;

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
  multiple?: false;
  /** Accessible name for the trigger and search popup. */
  label: string;
  options: (Option | OptionGroup)[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: ReactNode;
  allowClear?: boolean;
  className?: string;
  classNames?: ClassNames;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- The single-select primitive fixes this mode internally.
  multiple: _multiple,
  ...props
}: Props) => {
  const { locale } = useConfig();
  const items = useSelectItems(options);

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
              >
                {null}
              </ComboboxClear>
            )}
          </div>
        </div>
        <SearchableOptions emptyText={emptyText} classNames={classNames} />
      </ComboboxContent>
    </Core>
  );
};

export default SearchableSelect;
