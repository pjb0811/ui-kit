import { Space, Tag } from '@repo/ui';

const items = ['One', 'Two', 'Three'];

export default function SpaceDemo() {
  return (
    <Space orientation="vertical" align="start" size="large">
      <Space>
        {items.map(label => (
          <Tag key={label}>{label}</Tag>
        ))}
      </Space>

      <Space orientation="vertical" align="start">
        {items.map(label => (
          <Tag key={label}>{label}</Tag>
        ))}
      </Space>

      <Space size="large" split={<span>|</span>}>
        {items.map(label => (
          <Tag key={label}>{label}</Tag>
        ))}
      </Space>
    </Space>
  );
}
