import { useState } from 'react';

import { Checkbox, Space, Typography } from '@repo/ui';

const OPTIONS = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
];

export default function CheckboxDemo() {
  const [checked, setChecked] = useState(true);
  const [values, setValues] = useState<(string | number | boolean)[]>([
    'react',
  ]);

  return (
    <Space orientation="vertical" align="start" size="middle">
      <Checkbox checked={checked} onChange={setChecked}>
        Single checkbox
      </Checkbox>
      <Space orientation="vertical" align="start" size="small">
        <Checkbox.Group options={OPTIONS} value={values} onChange={setValues} />
        <Typography.Text className="text-muted-foreground text-sm">
          Selected: {values.length ? values.join(', ') : 'none'}
        </Typography.Text>
      </Space>
    </Space>
  );
}
