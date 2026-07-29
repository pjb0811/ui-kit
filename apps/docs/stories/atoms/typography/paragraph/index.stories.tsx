import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Typography } from '@repo/ui';

const meta: Meta<typeof Typography.Paragraph> = {
  title: 'General/Typography/Paragraph',
  component: Typography.Paragraph,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '문단입니다',
  },
};
