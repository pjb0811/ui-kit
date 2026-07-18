import React from 'react';

import { select } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

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
}

interface OptionGroup {
  label: React.ReactNode;
  options: Option[];
}

const isGroup = (option: Option | OptionGroup): option is OptionGroup => {
  return 'options' in option && Array.isArray(option.options);
};

interface Props extends React.ComponentProps<typeof Core> {
  placeholder?: string;
  className?: string;
  options?: (Option | OptionGroup)[];
  onChange?: (value: string) => void;
}

const Select = ({
  className,
  placeholder,
  options,
  onChange,
  ...props
}: Props) => {
  return (
    <Core onValueChange={onChange} {...props}>
      <SelectTrigger className={cn('w-full max-w-48', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options?.map((option, index) =>
          isGroup(option) ? (
            <SelectGroup key={index}>
              <SelectLabel>{option.label}</SelectLabel>
              {option.options.map(item => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ) : (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ),
        )}
      </SelectContent>
    </Core>
  );
};

export default Select;
