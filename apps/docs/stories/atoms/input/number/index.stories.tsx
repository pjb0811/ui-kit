'use client';

import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Config, Input } from '@repo/ui';

const meta: Meta<typeof Input.Number> = {
  title: 'Data Entry/Input/Number',
  component: Input.Number,
  parameters: { layout: 'centered' },
  args: { label: 'Quantity', defaultValue: 2, min: 0, max: 10 },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<number | null>(2);

    return (
      <div className="w-64 space-y-2">
        <Input.Number
          {...args}
          defaultValue={undefined}
          value={value}
          onChange={setValue}
        />
        <p>Current value: {value ?? 'empty'}</p>
      </div>
    );
  },
};

export const Empty: Story = {
  args: { defaultValue: undefined, placeholder: 'Enter a number' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const ReadOnly: Story = {
  args: { readOnly: true },
};

export const Sizes: Story = {
  render: args => (
    <div className="flex w-64 flex-col gap-4">
      <Input.Number {...args} size="small" />
      <Input.Number {...args} size="middle" />
      <Input.Number {...args} size="large" />
    </div>
  ),
};

export const DarkTheme: Story = {
  render: args => (
    <Config theme={{ dark: 'dark' }}>
      <div className="bg-background w-64 rounded-lg p-6">
        <Input.Number {...args} />
      </div>
    </Config>
  ),
};
