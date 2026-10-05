import { useState } from 'react';

import { TimePicker, Typography } from '@repo/ui';

export default function TimePickerDemo() {
  const [time, setTime] = useState<string | null>('09:30');

  return (
    <div className="max-w-64 space-y-2">
      <TimePicker label="Start time" value={time} onChange={setTime} />
      <Typography.Text className="text-muted-foreground text-sm">
        Selected: {time ?? 'none'}
      </Typography.Text>
    </div>
  );
}
