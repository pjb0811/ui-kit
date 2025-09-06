import type { Meta, StoryObj } from '@storybook/nextjs';

import { Skeleton } from '@repo/ui';

const meta: Meta<typeof Skeleton.Node> = {
  title: 'UI/Skeleton/Node',
  component: Skeleton.Node,
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
    width: {
      control: { type: 'text' },
    },
    height: {
      control: { type: 'text' },
    },
    size: { table: { disable: true } },
    classNames: { table: { disable: true } },
    avatar: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    active: false,
    loading: true,
    count: 1,
    width: '200',
    height: '180',
  },
};
