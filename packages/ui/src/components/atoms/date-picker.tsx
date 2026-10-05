'use client';

import { useState } from 'react';

import { useControllableState } from '@jbpark/use-hooks';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@repo/ui/utils';

import { calendar } from '../../core';
import Button from './button';
import Popover from './popover';
import TimePicker from './time-picker';

const { Calendar } = calendar;

interface Props {
  defaultValue?: Date;
  value?: Date;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  /** Pick a local date and time together. Optionally configure the minute interval. */
  showTime?: boolean | { minuteStep?: number };
  onChange?: (date: Date | undefined) => void;
}

const toTimeValue = (date?: Date) =>
  date
    ? `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    : '00:00';

const DatePicker = ({
  defaultValue,
  value: _value,
  placeholder = 'Pick a date',
  className,
  disabled,
  showTime = false,
  onChange: _onChange = () => {},
}: Props) => {
  const [value, onChange] = useControllableState<Date | undefined>({
    value: _value,
    defaultValue,
    onChange: _onChange,
  });
  const [open, setOpen] = useState(false);
  const [draftDate, setDraftDate] = useState<Date | undefined>(value);
  const [draftTime, setDraftTime] = useState(toTimeValue(value));
  const minuteStep =
    typeof showTime === 'object' ? showTime.minuteStep : undefined;

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && showTime) {
      setDraftDate(value);
      setDraftTime(toTimeValue(value));
    }

    setOpen(nextOpen);
  };

  const handleConfirm = () => {
    if (!draftDate || !draftTime) return;

    const [hours, minutes] = draftTime.split(':').map(Number);

    onChange(
      new Date(
        draftDate.getFullYear(),
        draftDate.getMonth(),
        draftDate.getDate(),
        hours,
        minutes,
      ),
    );
    setOpen(false);
  };

  return (
    <Popover
      placement="bottomLeft"
      open={open}
      onOpenChange={handleOpenChange}
      content={
        <>
          <Calendar
            mode="single"
            selected={showTime ? draftDate : value}
            onSelect={date => {
              if (showTime) {
                setDraftDate(date);
              } else {
                onChange(date);
                setOpen(false);
              }
            }}
          />
          {showTime && (
            <div className="border-border flex flex-col gap-3 border-t p-3">
              <TimePicker
                label="Time"
                value={draftTime}
                onChange={time => setDraftTime(time ?? '')}
                minuteStep={minuteStep}
                allowClear={false}
                size="small"
              />
              <div className="flex justify-end gap-2">
                <Button size="small" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  size="small"
                  disabled={!draftDate || !draftTime}
                  onClick={handleConfirm}
                >
                  OK
                </Button>
              </div>
            </div>
          )}
        </>
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
        {value ? format(value, showTime ? 'PPP HH:mm' : 'PPP') : placeholder}
      </Button>
    </Popover>
  );
};

export default DatePicker;
export type { Props };
