import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Config, Switch } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof Switch> = {
  title: 'Data Entry/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'middle', 'large', 'medium'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    className: {
      control: { type: 'text' },
    },
    classNames: {
      control: { type: 'object' },
    },
    checkedChildren: {
      control: { type: 'text' },
    },
    unCheckedChildren: {
      control: { type: 'text' },
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

export const WithChildren: Story = {
  args: {
    checkedChildren: 'ON',
    unCheckedChildren: 'OFF',
  },
};

// The three steps of the shared `ComponentSize` scale.
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Switch size="small" defaultChecked />
      <Switch size="middle" defaultChecked />
      <Switch size="large" defaultChecked />
    </div>
  ),
};

// With no explicit `size`, `Switch` inherits the nearest `Config`'s
// `componentSize` (#350) — the same contract `Button` and `Space` follow.
export const WithConfig: Story = {
  render: () => (
    <Config componentSize="large">
      <Switch defaultChecked />
    </Config>
  ),
};
