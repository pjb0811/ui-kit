import { Space, Tag } from '@repo/ui';

const STATES = ['default', 'primary', 'success', 'warning', 'danger'] as const;

const PRESETS = [
  'blue',
  'purple',
  'cyan',
  'green',
  'magenta',
  'pink',
  'red',
  'orange',
  'yellow',
  'volcano',
  'geekblue',
  'lime',
  'gold',
] as const;

export default function TagDemo() {
  return (
    <Space orientation="vertical" align="start" size="middle">
      <Space wrap>
        {STATES.map(color => (
          <Tag key={color} color={color}>
            {color}
          </Tag>
        ))}
      </Space>
      <Space wrap>
        {STATES.map(color => (
          <Tag key={color} color={color} variant="outlined">
            {color}
          </Tag>
        ))}
      </Space>
      <Space wrap>
        {PRESETS.map(color => (
          <Tag key={color} color={color}>
            {color}
          </Tag>
        ))}
      </Space>
      <Space wrap>
        {PRESETS.map(color => (
          <Tag key={color} color={color} variant="outlined">
            {color}
          </Tag>
        ))}
      </Space>
    </Space>
  );
}
