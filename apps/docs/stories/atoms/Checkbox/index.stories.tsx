import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Checkbox } from '@repo/ui';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placement: {
      control: { type: 'radio' },
      options: ['left', 'right'],
    },
    checked: {
      control: { type: 'boolean' },
    },
    value: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '체크박스',
    checked: false,
    placement: 'left',
    value: false,
  },
};
