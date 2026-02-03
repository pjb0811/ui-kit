import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Radio } from '@repo/ui';

const meta: Meta<typeof Radio> = {
  title: 'UI/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    defaultValue: {
      control: { type: 'text' },
    },
    value: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 'option1',
  },
  render: ({ ...args }) => <Radio {...args}>Radio</Radio>,
};
