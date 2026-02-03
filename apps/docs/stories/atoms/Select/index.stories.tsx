import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Select } from '@repo/ui';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '선택하세요',
    options: [
      { label: '옵션 1', value: '1' },
      { label: '옵션 2', value: '2' },
      { label: '옵션 3', value: '3' },
    ],
  },
};
