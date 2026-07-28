'use client';

import { useState } from 'react';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { button, calendar } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

import Popover from './popover';

const { Calendar } = calendar;
const { buttonVariants } = button;

interface Props {
  defaultValue?: Date;
  value?: Date;
  placeholder?: string;
  className?: string;
  onChange?: (date: Date | undefined) => void;
}

const DatePicker = ({
  defaultValue,
  value: _value,
  placeholder = 'Pick a date',
  className,
  onChange: _onChange = () => {},
}: Props) => {
  const [uncontrolledValue, setUncontrolledValue] = useState<Date | undefined>(
    defaultValue,
  );

  const controlled = _value !== undefined;
  const value = controlled ? _value : uncontrolledValue;

  const onChange = (date: Date | undefined) => {
    if (!controlled) {
      setUncontrolledValue(date);
    }
    _onChange(date);
  };

  return (
    <Popover
      placement="bottomLeft"
      content={<Calendar mode="single" selected={value} onSelect={onChange} />}
    >
      <button
        type="button"
        data-empty={!value}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'w-full justify-start text-left font-normal',
          'data-[empty=true]:text-muted-foreground',
          className,
          //
        )}
      >
        <CalendarIcon />
        {value ? format(value, 'PPP') : placeholder}
      </button>
    </Popover>
  );
};

export default DatePicker;
export type { Props };
