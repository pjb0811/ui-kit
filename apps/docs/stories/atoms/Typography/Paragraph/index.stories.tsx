import type { Meta, StoryObj } from '@storybook/nextjs';

import { Typography } from '@repo/ui';

const meta: Meta<typeof Typography.Paragraph> = {
  title: 'UI/Typography/Paragraph',
  component: Typography.Paragraph,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    level: {
      control: { type: 'select' },
      options: [1, 2, 3, 4, 5, 6],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '문단입니다',
    level: 1,
  },
};
