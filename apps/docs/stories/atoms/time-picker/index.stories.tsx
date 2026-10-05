'use client';

import * as React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TimePicker } from '@repo/ui';

const meta: Meta<typeof TimePicker> = {
  title: 'Data Entry/TimePicker',
  component: TimePicker,
  parameters: { layout: 'centered' },
  args: {
    label: 'Start time',
  },
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <div className="w-64">
      <TimePicker {...args} />
    </div>
  ),
};

export const Controlled: Story = {
  args: { label: 'Meeting time' },
  render: function Render(args) {
    const [time, setTime] = React.useState<string | null>('13:30');

    return (
      <div className="w-64 space-y-2">
        <TimePicker {...args} value={time} onChange={setTime} />
        <p className="text-muted-foreground text-sm">
          Selected: {time ?? 'none'}
        </p>
      </div>
    );
  },
};

export const QuarterHours: Story = {
  args: {
    label: 'Appointment time',
    minuteStep: 15,
    defaultValue: '09:30',
    min: '09:00',
    max: '17:00',
  },
  render: args => (
    <div className="w-64">
      <TimePicker {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    defaultValue: '10:00',
    disabled: true,
  },
  render: args => (
    <div className="w-64">
      <TimePicker {...args} />
    </div>
  ),
};
