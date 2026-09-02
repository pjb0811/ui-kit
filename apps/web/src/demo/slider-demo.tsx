import { useState } from 'react';

import { Slider, Space, Typography } from '@repo/ui';

export default function SliderDemo() {
  const [value, setValue] = useState<number>(40);
  const [range, setRange] = useState<number[]>([20, 60]);

  return (
    <Space orientation="vertical" align="start" size="large" className="w-72">
      <Space
        orientation="vertical"
        align="start"
        size="small"
        className="w-full"
      >
        <Typography.Text className="text-muted-foreground text-sm">
          value: {value}
        </Typography.Text>
        <Slider value={value} onChange={next => setValue(next as number)} />
      </Space>
      <Space
        orientation="vertical"
        align="start"
        size="small"
        className="w-full"
      >
        <Typography.Text className="text-muted-foreground text-sm">
          range: {range.join(' – ')}
        </Typography.Text>
        <Slider value={range} onChange={next => setRange(next as number[])} />
      </Space>
      <Space
        orientation="vertical"
        align="start"
        size="small"
        className="w-full"
      >
        <Typography.Text className="text-muted-foreground text-sm">
          stepped (10) &amp; disabled
        </Typography.Text>
        <Slider defaultValue={50} step={10} />
        <Slider defaultValue={30} disabled />
      </Space>
    </Space>
  );
}
