'use client';

import { type ReactNode, useMemo } from 'react';

import { combobox } from '../../core';

const {
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxItem,
  ComboboxList,
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

export interface ClassNames {
  input?: string;
  content?: string;
  list?: string;
  item?: string;
  empty?: string;
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

export const useSelectItems = (options: (Option | OptionGroup)[]) => {
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

  return items;
};

interface Props {
  emptyText: ReactNode;
  classNames?: ClassNames;
}

const SearchableOptions = ({ emptyText, classNames }: Props) => {
  return (
    <>
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
    </>
  );
};

export default SearchableOptions;
