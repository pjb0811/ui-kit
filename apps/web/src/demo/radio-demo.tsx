import { useState } from 'react';

import { Radio, Space, Typography } from '@repo/ui';

const OPTIONS = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];

export default function RadioDemo() {
  const [value, setValue] = useState<string | number | boolean>('medium');
  const [buttonValue, setButtonValue] = useState<string | number | boolean>(
    'medium',
  );

  return (
    <Space orientation="vertical" align="start" size="middle">
      <Space orientation="vertical" align="start" size="small">
        <Radio.Group options={OPTIONS} value={value} onChange={setValue} />
        <Typography.Text className="text-muted-foreground text-sm">
          Selected: {String(value)}
        </Typography.Text>
      </Space>
      <Radio.Group
        options={OPTIONS}
        value={buttonValue}
        onChange={setButtonValue}
        optionType="button"
      />
    </Space>
  );
}
