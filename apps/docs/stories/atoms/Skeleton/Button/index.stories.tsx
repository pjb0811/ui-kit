import type { Meta, StoryObj } from '@storybook/nextjs';

import { Skeleton } from '@repo/ui';

const meta: Meta<typeof Skeleton.Button> = {
  title: 'UI/Skeleton/Button',
  component: Skeleton.Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    active: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
    count: {
      control: { type: 'number', min: 1, max: 10 },
    },
    classNames: { table: { disable: true } },
  },
  render: props => (
    <div className="flex size-32 items-center justify-center p-4">
      <Skeleton.Button {...props} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    active: false,
    loading: true,
    count: 1,
  },
};
