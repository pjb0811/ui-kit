import { useState } from 'react';

import { Button, Card, Space, Spin, Typography } from '@repo/ui';

export default function SpinDemo() {
  const [spinning, setSpinning] = useState(true);

  return (
    <Space orientation="vertical" align="start" size="middle">
      <Button onClick={() => setSpinning(s => !s)}>
        {spinning ? 'Stop' : 'Start'} spinning
      </Button>
      <Space size="large" align="start" wrap>
        <div
          className="border-border flex h-32 w-32 items-center justify-center
            rounded-md border border-dashed"
        >
          <Spin spinning={spinning} />
        </div>
        <Card className="h-32 w-48">
          <Spin spinning={spinning}>
            <Typography.Paragraph className="m-0">
              Content stays visible but dimmed behind the spin overlay while
              loading.
            </Typography.Paragraph>
          </Spin>
        </Card>
      </Space>
    </Space>
  );
}
