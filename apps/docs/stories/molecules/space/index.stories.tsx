// apps/docs/stories/molecules/Space/index.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button, Space } from '@repo/ui';

const meta: Meta<typeof Space> = {
  title: 'UI/Space',
  component: Space,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'middle', 'large'],
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },
    wrap: {
      control: { type: 'boolean' },
    },
    align: {
      control: { type: 'select' },
      options: ['start', 'end', 'center', 'baseline'],
    },
    split: {
      control: { type: 'text' },
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
  render: props => {
    return (
      <div className="w-full max-w-2xl">
        <Space {...props}>
          <Button>첫 번째</Button>
          <Button variant="outlined">두 번째</Button>
          <Button variant="dashed">세 번째</Button>
          <Button variant="filled">네 번째</Button>
        </Space>
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'middle',
    orientation: 'horizontal',
    wrap: false,
    align: 'center',
    loading: false,
  },
};
