import { useState } from 'react';

import { Input, Space, Typography } from '@repo/ui';

export default function InputDemo() {
  const [searched, setSearched] = useState('');

  return (
    <Space
      orientation="vertical"
      align="start"
      size="middle"
      className="w-full"
    >
      <Input placeholder="Basic input" className="max-w-64" />
      <Space orientation="vertical" align="start" size="small">
        <Input.Search
          placeholder="Search..."
          className="max-w-64"
          onSearch={setSearched}
        />
        <Typography.Text className="text-muted-foreground text-sm">
          Last search: {searched || 'none'}
        </Typography.Text>
      </Space>
      <Input.TextArea placeholder="Text area" className="max-w-64" rows={3} />
    </Space>
  );
}
