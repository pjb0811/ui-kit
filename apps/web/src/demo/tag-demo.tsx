import { Space, Tag } from '@repo/ui';

const COLORS = ['default', 'primary', 'success', 'warning', 'danger'] as const;

export default function TagDemo() {
  return (
    <Space orientation="vertical" align="start" size="middle">
      <Space wrap>
        {COLORS.map(color => (
          <Tag key={color} color={color}>
            {color}
          </Tag>
        ))}
      </Space>
      <Space wrap>
        {COLORS.map(color => (
          <Tag key={color} color={color} variant="outlined">
            {color}
          </Tag>
        ))}
      </Space>
    </Space>
  );
}
