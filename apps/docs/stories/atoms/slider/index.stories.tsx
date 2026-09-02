import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Slider } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof Slider> = {
  title: 'Data Entry/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    min: {
      control: { type: 'number' },
    },
    max: {
      control: { type: 'number' },
    },
    step: {
      control: { type: 'number' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },
    className: {
      control: { type: 'text' },
    },
  },
  render: props => (
    <div
      className={cn(
        'flex items-center justify-center',
        'w-64 p-4',
        'rounded-md border',
        'bg-gray-50',
      )}
    >
      <Slider {...props} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 40,
    disabled: false,
  },
};

export const Range: Story = {
  args: {
    defaultValue: [20, 60],
  },
};

export const Stepped: Story = {
  args: {
    defaultValue: 50,
    step: 10,
  },
};
