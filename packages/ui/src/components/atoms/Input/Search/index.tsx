'use client';

import { forwardRef } from 'react';
import type { ChangeEvent, InputHTMLAttributes } from 'react';

import { CircleX, Search as SearchOutlined } from 'lucide-react';

import { input } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

const { Input: Core } = input;

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  allowClear?: boolean;
  onChange: (
    e: ChangeEvent<HTMLInputElement> | { target: { value: string } },
  ) => void;
  onPressEnter: () => void;
}

const Search = forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      value,
      allowClear = true,
      onChange = () => {},
      onPressEnter,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn(
          'relative flex items-center gap-x-2',
          'rounded-md',
          'p-3',
          className,
        )}
      >
        <SearchOutlined className="absolute size-5" />
        <Core
          ref={ref}
          inputMode="search"
          type="search"
          enterKeyHint="search"
          className={cn(
            'w-full',
            //
          )}
          value={value}
          onChange={onChange}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onPressEnter();
            }
          }}
          {...props}
        />
        <CircleX
          className={cn(
            'absolute size-4 shrink-0 cursor-pointer',
            (!allowClear || !value) && 'hidden',
          )}
          onClick={() => onChange({ target: { value: '' } })}
        />
      </div>
    );
  },
);

Search.displayName = 'Search';

export default Search;
