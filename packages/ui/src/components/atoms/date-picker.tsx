'use client';

import { useState } from 'react';

import { useControllableState } from '@jbpark/use-hooks';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@repo/ui/utils';

import { calendar } from '../../core';
import Button from './button';
import Popover from './popover';

const { Calendar } = calendar;

interface Props {
  defaultValue?: Date;
  value?: Date;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onChange?: (date: Date | undefined) => void;
}

const DatePicker = ({
  defaultValue,
  value: _value,
  placeholder = 'Pick a date',
  className,
  disabled,
  onChange: _onChange = () => {},
}: Props) => {
  const [value, onChange] = useControllableState<Date | undefined>({
    value: _value,
    defaultValue,
    onChange: _onChange,
  });
  const [open, setOpen] = useState(false);

  return (
    <Popover
      placement="bottomLeft"
      open={open}
      onOpenChange={setOpen}
      content={
        <Calendar
          mode="single"
          selected={value}
          onSelect={date => {
            onChange(date);
            setOpen(false);
          }}
        />
      }
    >
      <Button
        icon={<CalendarIcon />}
        data-empty={!value}
        disabled={disabled}
        className={cn(
          'w-full justify-start text-left font-normal',
          'data-[empty=true]:text-muted-foreground',
          className,
          //
        )}
      >
        {value ? format(value, 'PPP') : placeholder}
      </Button>
    </Popover>
  );
};

export default DatePicker;
export type { Props };
