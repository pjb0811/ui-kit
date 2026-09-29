'use client';

import { type ReactNode, useMemo } from 'react';

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
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxClear,
  ComboboxContent,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxTrigger,
  ComboboxValue,
} = combobox;

export interface Props extends Omit<
  combobox.RootProps<string, Option, true>,
  | 'children'
  | 'items'
  | 'filteredItems'
  | 'onValueChange'
  | 'itemToStringLabel'
  | 'itemToStringValue'
  | 'isItemEqualToValue'
> {
  searchable: true;
  multiple: true;
  /** Accessible name for the multi-select input. */
  label: string;
  options: (Option | OptionGroup)[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: ReactNode;
  allowClear?: boolean;
  /** Instructions announced when a selected chip receives focus. */
  chipDescription?: string;
  /** Instructions announced on the input when chips are selected. */
  inputDescription?: (selectedCount: number) => string;
  className?: string;
  classNames?: ClassNames & {
    chips?: string;
    chip?: string;
  };
  onChange?: (values: string[]) => void;
}

const MultipleSelect = ({
  label,
  options,
  placeholder = 'Select options',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  allowClear = true,
  chipDescription = 'Press Backspace or Delete to remove',
  inputDescription = count =>
    `${count} selected. From the start of the input, press Left Arrow to focus selected options`,
  className,
  classNames,
  onChange,
  onOpenChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Do not forward the public mode switch to Base UI.
  searchable: _searchable,
  multiple,
  ...props
}: Props) => {
  const { locale } = useConfig();
  const items = useSelectItems(options);
  const labels = useMemo(() => {
    const result = new Map<string, string>();

    options.forEach(option => {
      if ('options' in option) {
        option.options.forEach(item => result.set(item.value, item.label));
      } else {
        result.set(option.value, option.label);
      }
    });

    return result;
  }, [options]);

  return (
    <Core
      items={items}
      multiple={multiple}
      onValueChange={values => onChange?.(values)}
      onOpenChange={(open, details) => {
        if (!open && details.reason === 'item-press') {
          details.cancel();
        }

        onOpenChange?.(open, details);
      }}
      {...props}
    >
      <ComboboxInputGroup
        data-slot="select-multiple-input-group"
        className={cn(
          select.selectTriggerStyles,
          'h-auto min-h-9 w-full max-w-64 flex-wrap gap-1 py-1',
          className,
        )}
      >
        <ComboboxValue>
          {(values: string[]) => (
            <ComboboxChips
              aria-label={
                values.length > 0 ? `${label} selected options` : undefined
              }
              className={cn(
                'flex min-w-0 flex-1 flex-wrap items-center gap-1',
                classNames?.chips,
              )}
            >
              {values.map(value => {
                const name = labels.get(value) ?? value;

                return (
                  <ComboboxChip
                    key={value}
                    data-slot="select-chip"
                    aria-label={name}
                    aria-description={chipDescription}
                    className={cn(
                      `bg-accent text-accent-foreground flex min-w-0
                      items-center gap-1 rounded-sm ps-2 pe-1 text-xs
                      outline-none`,
                      'focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                      classNames?.chip,
                    )}
                  >
                    <span className="max-w-40 truncate">{name}</span>
                    <ComboboxChipRemove
                      data-slot="select-chip-remove"
                      aria-label={`${locale.clear ?? DEFAULT_LOCALE.clear} ${name}`}
                      className="hover:bg-background/70 flex size-5 shrink-0
                        items-center justify-center rounded-sm"
                    >
                      <XIcon className="size-3" />
                    </ComboboxChipRemove>
                  </ComboboxChip>
                );
              })}
              <ComboboxInput
                render={
                  <Input
                    aria-label={label}
                    aria-description={
                      values.length > 0
                        ? inputDescription(values.length)
                        : undefined
                    }
                    placeholder={
                      values.length > 0 ? searchPlaceholder : placeholder
                    }
                    className={cn(
                      `h-6 min-w-16 flex-1 border-0 bg-transparent px-0 py-0
                      shadow-none focus-visible:border-0 focus-visible:ring-0`,
                      classNames?.input,
                    )}
                  />
                }
              />
            </ComboboxChips>
          )}
        </ComboboxValue>
        {allowClear && (
          <ComboboxClear
            data-slot="select-multiple-clear"
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
      </ComboboxInputGroup>
      <ComboboxContent aria-label={label} className={classNames?.content}>
        <SearchableOptions emptyText={emptyText} classNames={classNames} />
      </ComboboxContent>
    </Core>
  );
};

export default MultipleSelect;
