import { Card, Space } from '@repo/ui';

export default function CardDemo() {
  return (
    <Space orientation="vertical" align="start" size="large">
      <Card title="Card title">
        A card with an outlined border — the default variant.
      </Card>
      <Card title="Borderless" variant="borderless">
        The same card without its border, blending into the background.
      </Card>
      <Card>A card with no title — body content only.</Card>
    </Space>
  );
}
