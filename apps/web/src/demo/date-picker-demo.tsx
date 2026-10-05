import { useState } from 'react';

import { format } from 'date-fns';

import { DatePicker, Space, Typography } from '@repo/ui';

export default function DatePickerDemo() {
  const [date, setDate] = useState<Date>();
  const [dateTime, setDateTime] = useState<Date>();

  return (
    <Space orientation="vertical" align="start" size="middle">
      <DatePicker onChange={setDate} />
      <Typography.Text className="text-muted-foreground text-sm">
        Selected: {date ? format(date, 'PPP') : 'none'}
      </Typography.Text>
      <DatePicker
        showTime={{ minuteStep: 15 }}
        onChange={setDateTime}
        placeholder="Pick a date and time"
      />
      <Typography.Text className="text-muted-foreground text-sm">
        Date and time: {dateTime ? format(dateTime, 'PPP HH:mm') : 'none'}
      </Typography.Text>
    </Space>
  );
}
