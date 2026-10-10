'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';

import { XIcon } from 'lucide-react';

import { DEFAULT_LOCALE, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { autocomplete } from '../../core';
import Button from './button';
import Input from './input';

export interface Option {
  value: string;
  label?: string;
  disabled?: boolean;
}

export interface Props extends Omit<
  ComponentPropsWithRef<'input'>,
  | 'children'
  | 'onChange'
  | 'onSelect'
  | 'value'
  | 'defaultValue'
  | 'size'
  | 'type'
> {
  options: readonly Option[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSelect?: (value: string, option: Option) => void;
  filterOption?: false | ((query: string, option: Option) => boolean);
  allowClear?: boolean;
  clearLabel?: string;
  emptyText?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  container?: HTMLElement;
  classNames?: {
    input?: string;
    clear?: string;
    content?: string;
    list?: string;
    option?: string;
    empty?: string;
  };
}

const AutoComplete = ({
  options,
  value,
  defaultValue,
  onChange,
  onSelect,
  filterOption,
  allowClear = true,
  clearLabel,
  emptyText = 'No suggestions',
  open,
  defaultOpen,
  onOpenChange,
  container,
  disabled,
  readOnly,
  name,
  form,
  className,
  classNames,
  dir,
  ref,
  onKeyDown,
  ...props
}: Props) => {
  const { direction, locale } = useConfig();
  const {
    Autocomplete: Root,
    AutocompleteInput,
    AutocompleteClear,
    AutocompleteContent,
    AutocompleteList,
    AutocompleteItem,
    AutocompleteEmpty,
  } = autocomplete;

  return (
    <div
      data-slot="auto-complete"
      dir={dir ?? direction}
      className={cn(
        'relative w-full min-w-0',
        className, //
      )}
    >
      <Root
        items={options}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onChange}
        itemToStringValue={option => option.value}
        filter={
          filterOption === false
            ? null
            : filterOption
              ? (option, query) => filterOption(query, option)
              : undefined
        }
        disabled={disabled}
        readOnly={readOnly}
        name={name}
        form={form}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        openOnInputClick
      >
        <AutocompleteInput
          {...props}
          ref={ref}
          dir={dir ?? direction}
          onKeyDown={event => {
            onKeyDown?.(event);

            // Keep free-form text when Escape reaches a closed popup.
            if (
              event.key === 'Escape' &&
              event.currentTarget.getAttribute('aria-expanded') === 'false'
            ) {
              event.preventBaseUIHandler();
            }
          }}
          render={
            <Input
              className={cn(
                allowClear && !readOnly && 'pe-10',
                classNames?.input, //
              )}
            />
          }
        />
        {allowClear && !readOnly && (
          <AutocompleteClear
            aria-label={clearLabel ?? locale.clear ?? DEFAULT_LOCALE.clear}
            render={<Button variant="text" size="small" />}
            className={cn(
              'absolute end-1 top-1/2 size-7 -translate-y-1/2 p-0',
              classNames?.clear, //
            )}
          >
            <XIcon className="size-4" />
          </AutocompleteClear>
        )}
        <AutocompleteContent
          container={container}
          dir={dir ?? direction}
          className={classNames?.content}
        >
          <AutocompleteEmpty
            className={cn(
              'text-muted-foreground px-3 py-2 text-sm',
              classNames?.empty, //
            )}
          >
            {emptyText}
          </AutocompleteEmpty>
          <AutocompleteList
            className={cn(
              'max-h-60 overflow-y-auto p-1',
              classNames?.list, //
            )}
          >
            {(option: Option) => (
              <AutocompleteItem
                key={option.value}
                value={option}
                disabled={option.disabled}
                onClick={() => {
                  if (!disabled && !readOnly) onSelect?.(option.value, option);
                }}
                className={cn(
                  `data-highlighted:bg-accent
                  data-highlighted:text-accent-foreground cursor-default
                  rounded-sm px-2 py-1.5 text-sm [overflow-wrap:anywhere]
                  outline-none data-disabled:opacity-50`,
                  classNames?.option, //
                )}
              >
                {option.label ?? option.value}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Root>
    </div>
  );
};

export default AutoComplete;
