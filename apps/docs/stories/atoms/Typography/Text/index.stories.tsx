import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Typography } from '@repo/ui';

const meta: Meta<typeof Typography.Text> = {
  title: 'UI/Typography/Text',
  component: Typography.Text,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
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
    underline: false,
    strong: false,
  },
};
