import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Typography } from '@repo/ui';

const meta: Meta<typeof Typography.Text> = {
  title: 'UI/Typography/Text',
  component: Typography.Text,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    level: {
      control: { type: 'select' },
      options: [1, 2, 3, 4, 5, 6],
    },
    underline: {
      control: { type: 'boolean' },
    },
    strong: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '텍스트입니다',
    level: 4,
    underline: false,
    strong: false,
  },
};
