import { useState } from 'react';

import { Heart } from 'lucide-react';

import { Button, Space } from '@repo/ui';

const TYPES = ['primary', 'default', 'dashed', 'text', 'link'] as const;
const COLORS = ['default', 'primary', 'danger', 'blue', 'green'] as const;

export default function ButtonDemo() {
  const [loading, setLoading] = useState(false);

  const onClickLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <Space orientation="vertical" align="start" size="middle">
      <Space wrap align="center">
        {TYPES.map(type => (
          <Button key={type} type={type}>
            {type}
          </Button>
        ))}
      </Space>
      <Space wrap align="center">
        {COLORS.map(color => (
          <Button key={color} variant="solid" color={color}>
            {color}
          </Button>
        ))}
      </Space>
      <Space wrap align="center">
        <Button shape="circle" icon={<Heart />} aria-label="Like" />
        <Button shape="round">Round</Button>
        <Button icon={<Heart />}>With icon</Button>
        <Button loading={loading} onClick={onClickLoad}>
          {loading ? 'Loading' : 'Click to load'}
        </Button>
      </Space>
    </Space>
  );
}
