import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Card } from '@repo/ui';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '카드 제목',
    children: '카드 내용입니다.',
  },
};
