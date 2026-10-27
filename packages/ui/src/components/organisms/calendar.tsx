'use client';

import {
  type ComponentProps,
  type ReactNode,
  createContext,
  useContext,
  useSyncExternalStore,
} from 'react';

import { useControllableState } from '@jbpark/use-hooks';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { calendar } from '../../core';

type CellRenderer = (date: Date) => ReactNode;

// The server and the browser can be in different time zones, so "today" is
// read from the browser clock only after hydration. Until then DayPicker gets a
// date no visible month shows, which marks no day as today (#577).
const NO_TODAY = new Date(1, 0, 1);
const subscribeToNothing = () => () => {};
// Midnight as a number, so the snapshot stays equal for the whole day.
const getBrowserDay = () => {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
};
const getServerDay = () => undefined;

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
  /**
   * The date to mark as today. By default it comes from the browser's clock
   * after hydration. Pass the same value on the server and in the browser to
   * mark it from the first render, and to open on its month when no other
   * date is given.
   */
  today?: Date;
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
  today,
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
  const browserDay = useSyncExternalStore(
    subscribeToNothing,
    getBrowserDay,
    getServerDay,
  );
  const [selected, setSelected] = useControllableState<Date | null | undefined>(
    {
      value,
      defaultValue,
      onChange: date => onChange?.(date ?? undefined),
    },
  );
  const [visibleMonth, setVisibleMonth] = useControllableState<Date>({
    value: month,
    defaultValue: defaultMonth ?? value ?? defaultValue ?? today ?? new Date(),
    onChange: onMonthChange,
  });
  const resolvedToday =
    today ?? (browserDay === undefined ? NO_TODAY : new Date(browserDay));
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
          today={resolvedToday}
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
