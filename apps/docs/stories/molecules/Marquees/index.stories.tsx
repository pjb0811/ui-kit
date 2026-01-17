import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Marquees } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof Marquees> = {
  title: 'UI/Marquees',
  component: Marquees,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    speed: {
      control: { type: 'range', min: 10, max: 500, step: 10 },
    },
    pauseOnHover: {
      control: { type: 'boolean' },
    },
    items: {
      control: { type: 'object' },
    },
    autoFill: {
      control: { type: 'boolean' },
    },
  },
  render: props => {
    return (
      <div
        className={cn(
          'h-screen w-full',
          'flex items-center',
          //
        )}
      >
        <Marquees {...props} />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems = Array.from({ length: 2 }, (_, i) => ({
  key: i,
  children: (
    <div className="flex gap-2">
      {Array.from({ length: 2 }, (_, j) => (
        <div
          key={`${i}-${j}`}
          className={cn(
            'flex items-center',
            'rounded-full bg-gray-100 px-6 py-3',
            'text-gray-700',
          )}
        >
          <span className="text-lg font-semibold">
            아이템 {i}-{j}
          </span>
        </div>
      ))}
    </div>
  ),
}));

export const Default: Story = {
  args: {
    speed: 100,
    pauseOnHover: false,
    autoFill: false,
    items: defaultItems,
  },
};

export const RepeatCount: Story = {
  argTypes: {
    autoFill: {
      control: { type: 'number', min: 0 },
    },
  },
  args: {
    speed: 100,
    autoFill: 1,
    items: defaultItems,
  },
};

export const MultipleSpeed: Story = {
  args: {
    autoFill: false,
    items: defaultItems.map((item, i) => ({
      speed: 100 * (i + 1),
      ...item,
    })),
  },
};

export const MultipleHoverEvent: Story = {
  args: {
    autoFill: false,
    pauseOnHover: false,
    items: defaultItems.map((item, i) => ({
      pauseOnHover: i === 0,
      ...item,
    })),
  },
};
