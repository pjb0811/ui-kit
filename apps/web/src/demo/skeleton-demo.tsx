import { useState } from 'react';

import { Button, Card, Skeleton, Space, Typography } from '@repo/ui';

export default function SkeletonDemo() {
  const [loading, setLoading] = useState(true);

  return (
    <Space orientation="vertical" align="start" size="middle">
      <Button onClick={() => setLoading(l => !l)}>
        {loading ? 'Show content' : 'Show skeleton'}
      </Button>
      <Card className="w-80">
        <Skeleton loading={loading} avatar count={3}>
          <Typography.Title level={5} className="mb-2">
            Loaded content
          </Typography.Title>
          <Typography.Paragraph>
            This is the real content that replaces the skeleton once loading
            finishes.
          </Typography.Paragraph>
        </Skeleton>
      </Card>
      <Space align="start" size="middle" wrap>
        <Skeleton.Button />
        <div className="w-64">
          <Skeleton.Node />
        </div>
      </Space>
    </Space>
  );
}
