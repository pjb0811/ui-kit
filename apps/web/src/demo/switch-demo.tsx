import { useState } from 'react';

import { Space, Switch, Typography } from '@repo/ui';

export default function SwitchDemo() {
  const [checked, setChecked] = useState(true);

  return (
    <Space orientation="vertical" align="start" size="middle">
      <Space align="center" size="middle">
        <Switch checked={checked} onChange={setChecked} />
        <Typography.Text className="text-muted-foreground text-sm">
          {checked ? 'checked' : 'unchecked'}
        </Typography.Text>
      </Space>
      <Space align="center" size="middle">
        <Switch size="small" defaultChecked />
        <Switch checkedChildren="ON" unCheckedChildren="OFF" />
        <Switch disabled defaultChecked />
        <Switch disabled />
      </Space>
    </Space>
  );
}
