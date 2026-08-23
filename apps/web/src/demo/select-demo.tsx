import { useState } from 'react';

import { Select, Space, Typography } from '@repo/ui';

const FRAMEWORKS = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
];

const GROUPED_FOODS = [
  {
    label: 'Fruits',
    options: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
    ],
  },
  {
    label: 'Vegetables',
    options: [
      { label: 'Carrot', value: 'carrot' },
      { label: 'Potato', value: 'potato' },
    ],
  },
];

export default function SelectDemo() {
  const [value, setValue] = useState<string>();

  return (
    <Space orientation="vertical" align="start" size="middle">
      <Space orientation="vertical" align="start" size="small">
        <Select
          placeholder="Choose a framework"
          options={FRAMEWORKS}
          onChange={setValue}
        />
        <Typography.Text className="text-muted-foreground text-sm">
          Selected: {value ?? 'none'}
        </Typography.Text>
      </Space>
      <Select placeholder="Choose a food" options={GROUPED_FOODS} />
    </Space>
  );
}
