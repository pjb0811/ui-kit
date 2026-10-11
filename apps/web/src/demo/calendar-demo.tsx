import { Calendar } from '@repo/ui';

export default function CalendarDemo() {
  return (
    <Calendar
      defaultMonth={new Date(2026, 9, 1)}
      defaultValue={new Date(2026, 9, 11)}
      renderDate={date => (date.getDate() === 11 ? 'Meeting' : null)}
    />
  );
}
