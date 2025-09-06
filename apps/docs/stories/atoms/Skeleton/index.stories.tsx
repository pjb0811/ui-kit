import type { Meta, StoryObj } from '@storybook/nextjs';

import { Skeleton } from '@repo/ui';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
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
    avatar: {
      control: { type: 'boolean' },
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'default', 'large'],
    },
    count: {
      control: { type: 'number', min: 1, max: 10 },
    },
    gap: {
      control: { type: 'number', min: 0, max: 20 },
    },
    direction: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
    },
    width: {
      control: { type: 'text' },
    },
    height: {
      control: { type: 'text' },
    },
    classNames: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  argTypes: {
    width: {
      control: { type: 'number' },
    },
    height: {
      control: { type: 'number' },
    },
  },
  args: {
    active: false,
    loading: true,
    count: 3,
    size: 'default',
    direction: 'vertical',
    gap: 8,
    children: '실제 콘텐츠가 여기에 표시됩니다',
  },
};

export const MultipleSize: Story = {
  argTypes: {
    width: {
      control: { type: 'object' },
    },
    height: {
      control: { type: 'object' },
    },
  },
  args: {
    active: false,
    loading: true,
    count: 3,
    size: 'default',
    direction: 'vertical',
    gap: 8,
    children: '실제 콘텐츠가 여기에 표시됩니다',
    width: [100, '200px', 300],
    height: [40, 50, 60],
  },
};
