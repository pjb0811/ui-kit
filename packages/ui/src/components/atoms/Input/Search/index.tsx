'use client';

import { useRef } from 'react';

import { CircleX, Search as SearchOutlined } from 'lucide-react';

import { input } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

import Button from '../../Button';

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
  allowClear = true,
  onChange,
  onSearch: _onSearch,
  ...props
}: Props) => {
  const internalRef = useRef<HTMLInputElement>(null);
  const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

  const onClear = () => {
    if (inputRef.current) {
      inputRef.current.value = '';

      const event = {
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(event);
    }
  };

  const onSearch = () => {
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
          ref={inputRef}
          inputMode="search"
          type="search"
          enterKeyHint="search"
          className={cn(
            'rounded-r-none',
            '[&::-webkit-search-cancel-button]:hidden',
            '[&::-webkit-search-decoration]:hidden',
            //
          )}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onSearch();
            }
          }}
          {...props}
        />
        <CircleX
          className={cn(
            'absolute right-2 size-4',
            'shrink-0 cursor-pointer',
            (!allowClear || (value !== undefined && !value)) && 'hidden',
          )}
          onClick={onClear}
        />
      </div>
      <Button
        icon={<SearchOutlined />}
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
