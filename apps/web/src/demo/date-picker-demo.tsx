import { useState } from 'react';

import { format } from 'date-fns';

import { DatePicker, Space, Typography } from '@repo/ui';

export default function DatePickerDemo() {
  const [date, setDate] = useState<Date>();

  return (
    <Space orientation="vertical" align="start" size="middle">
      <DatePicker value={date} onChange={setDate} />
      <Typography.Text className="text-muted-foreground text-sm">
        Selected: {date ? format(date, 'PPP') : 'none'}
      </Typography.Text>
    </Space>
  );
}
