'use client';

import { useRef, useState } from 'react';

import { useMergedRef } from '@jbpark/use-hooks';
import { CircleX, Search as SearchOutlined } from 'lucide-react';

import { DEFAULT_LOCALE, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { input } from '../../../core';
import Button from '../button';

const { Input: Core } = input;

export interface Props extends React.ComponentPropsWithRef<'input'> {
  allowClear?: boolean;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } },
  ) => void;
  onSearch?: (value: string) => void;
}

const Search = ({
  ref,
  className,
  defaultValue,
  value,
  disabled,
  allowClear = true,
  onChange,
  onKeyDown: _onKeyDown,
  onSearch: _onSearch,
  ...props
}: Props) => {
  const { locale } = useConfig();
  const inputRef = useRef<HTMLInputElement>(null);

  const mergedRef = useMergedRef(inputRef, ref);

  const [uncontrolledHasValue, setUncontrolledHasValue] =
    useState(!!defaultValue);
  const hasValue = value !== undefined ? !!value : uncontrolledHasValue;

  const onClear = () => {
    if (!inputRef.current) {
      return;
    }

    if (value === undefined) {
      inputRef.current.value = '';
      setUncontrolledHasValue(false);
    }

    onChange?.({ target: { value: '' } });
  };

  const onSearch = () => {
    if (disabled) {
      return;
    }
    if (inputRef.current) {
      _onSearch?.(inputRef.current.value);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center',
        'rounded-md',
        className,
        //
      )}
    >
      <div
        className={cn(
          'relative grow',
          'inline-flex items-center',
          //
        )}
      >
        <Core
          {...props}
          ref={mergedRef}
          inputMode="search"
          type="search"
          enterKeyHint="search"
          disabled={disabled}
          className={cn(
            'rounded-r-none',
            '[&::-webkit-search-cancel-button]:hidden',
            '[&::-webkit-search-decoration]:hidden',
            //
          )}
          value={value}
          defaultValue={defaultValue}
          onChange={e => {
            if (value === undefined) {
              setUncontrolledHasValue(!!e.target.value);
            }
            onChange?.(e);
          }}
          onKeyDown={e => {
            _onKeyDown?.(e);
            if (e.key === 'Enter') {
              onSearch();
            }
          }}
        />
        <button
          type="button"
          aria-label={locale.clear ?? DEFAULT_LOCALE.clear}
          disabled={disabled}
          className={cn(
            'absolute right-2',
            'shrink-0 cursor-pointer',
            'disabled:cursor-not-allowed disabled:opacity-50',
            (!allowClear || !hasValue) && 'hidden',
          )}
          onClick={onClear}
        >
          <CircleX className="size-4" />
        </button>
      </div>
      <Button
        icon={<SearchOutlined />}
        disabled={disabled}
        className={cn(
          'rounded-l-none',
          'size-9',
          //
        )}
        onClick={onSearch}
      />
    </div>
  );
};

Search.displayName = 'Search';

export default Search;
