'use client';

import {
  type ComponentProps,
  type ReactNode,
  createContext,
  useContext,
} from 'react';

import { useControllableState } from '@jbpark/use-hooks';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { calendar } from '../../core';

type CellRenderer = (date: Date) => ReactNode;
const CellContext = createContext<CellRenderer | undefined>(undefined);

function DayButton(props: ComponentProps<typeof calendar.CalendarDayButton>) {
  const renderDate = useContext(CellContext);

  return (
    <calendar.CalendarDayButton {...props}>
      {props.children}
      {renderDate && (
        <span aria-hidden="true" className="max-w-full text-xs">
          {renderDate(props.day.date)}
        </span>
      )}
    </calendar.CalendarDayButton>
  );
}

export interface Props extends Omit<
  ComponentProps<'div'>,
  'onChange' | 'children' | 'defaultValue'
> {
  /** Pass null for an explicitly empty controlled selection. */
  value?: Date | null;
  defaultValue?: Date;
  onChange?: (date: Date | undefined) => void;
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  disabledDate?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  locale?: ComponentProps<typeof calendar.Calendar>['locale'];
  weekStartsOn?: ComponentProps<typeof calendar.Calendar>['weekStartsOn'];
  expanded?: boolean;
  renderDate?: CellRenderer;
  classNames?: { calendar?: string };
}

const Calendar = ({
  value,
  defaultValue,
  onChange,
  month,
  defaultMonth,
  onMonthChange,
  disabledDate,
  minDate,
  maxDate,
  locale,
  weekStartsOn,
  expanded = false,
  renderDate,
  className,
  classNames,
  dir,
  ...props
}: Props) => {
  const { direction } = useConfig();
  const [selected, setSelected] = useControllableState<Date | null | undefined>(
    {
      value,
      defaultValue,
      onChange: date => onChange?.(date ?? undefined),
    },
  );
  const [visibleMonth, setVisibleMonth] = useControllableState<Date>({
    value: month,
    defaultValue: defaultMonth ?? value ?? defaultValue ?? new Date(),
    onChange: onMonthChange,
  });
  const disabled = [
    ...(disabledDate ? [disabledDate] : []),
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
  ];

  return (
    <div
      {...props}
      data-slot="calendar"
      dir={dir ?? direction}
      className={cn(
        'min-w-0',
        className,
        //
      )}
    >
      <CellContext value={renderDate}>
        <calendar.Calendar
          mode="single"
          selected={selected ?? undefined}
          onSelect={date => setSelected(date ?? null)}
          month={visibleMonth}
          onMonthChange={setVisibleMonth}
          disabled={disabled}
          locale={locale}
          weekStartsOn={weekStartsOn}
          dir={dir ?? direction}
          components={{ DayButton }}
          className={cn(
            expanded && 'w-full [--cell-size:3.5rem] [&_.rdp-month]:w-full',
            classNames?.calendar,
            //
          )}
        />
      </CellContext>
    </div>
  );
};

export default Calendar;
