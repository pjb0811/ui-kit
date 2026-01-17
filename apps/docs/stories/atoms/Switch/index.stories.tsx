import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Switch } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
    className: {
      control: { type: 'text' },
    },
    classNames: {
      control: { type: 'object' },
    },
  },
  render: props => (
    <div
      className={cn(
        'flex items-center justify-center',
        'w-32 p-4',
        'rounded-md border',
        'bg-gray-50',
      )}
    >
      <Switch {...props} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    disabled: false,
  },
};
