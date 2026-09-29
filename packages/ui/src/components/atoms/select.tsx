import React from 'react';

import { cn } from '@repo/ui/utils';

import { select } from '../../core';
import MultipleSelect, { type Props as MultipleProps } from './select-multiple';
import SearchableSelect, {
  type Props as SearchableProps,
} from './select-searchable';

const {
  Select: Core,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} = select;

interface Option {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
}

interface OptionGroup {
  label: React.ReactNode;
  options: Option[];
}

const isGroup = (option: Option | OptionGroup): option is OptionGroup => {
  return 'options' in option && Array.isArray(option.options);
};

interface StaticProps extends Omit<
  React.ComponentProps<typeof Core>,
  'onValueChange'
> {
  searchable?: false;
  placeholder?: string;
  className?: string;
  options?: (Option | OptionGroup)[];
  onChange?: (value: string) => void;
}

export type Props = StaticProps | SearchableProps | MultipleProps;

const StaticSelect = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Do not forward the public mode switch to Base UI.
  searchable: _searchable,
  className,
  placeholder,
  options,
  onChange,
  ...props
}: StaticProps) => {
  const items = options?.flatMap(option =>
    isGroup(option) ? option.options : option,
  );

  return (
    <Core
      items={items}
      onValueChange={value => {
        if (value !== null) {
          onChange?.(value);
        }
      }}
      {...props}
    >
      <SelectTrigger className={cn('w-full max-w-48', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options?.map((option, index) =>
          isGroup(option) ? (
            <SelectGroup key={index}>
              <SelectLabel>{option.label}</SelectLabel>
              {option.options.map(item => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ) : (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ),
        )}
      </SelectContent>
    </Core>
  );
};

const Select = (props: Props) => {
  if (props.multiple) {
    return <MultipleSelect {...props} />;
  }

  if (props.searchable) {
    return <SearchableSelect {...props} />;
  }

  return <StaticSelect {...props} />;
};

export default Select;
