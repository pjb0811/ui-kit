import { useState } from 'react';

import { RichTextEditor, Space, Typography } from '@repo/ui';

export default function RichTextEditorDemo() {
  const [value, setValue] = useState('<p>Hello, <strong>world</strong>!</p>');

  return (
    <Space orientation="vertical" align="start" size="small" className="w-96">
      <RichTextEditor value={value} onChange={setValue} toolbar />
      <Typography.Text className="text-muted-foreground text-sm">
        committed HTML: <code>{value}</code>
      </Typography.Text>
    </Space>
  );
}
