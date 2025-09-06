import type { Meta, StoryObj } from '@storybook/nextjs';

import { Typography } from '@repo/ui';

const meta: Meta<typeof Typography> = {
  title: 'UI/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    level: {
      table: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Typography 컴포넌트입니다.',
  },
};
