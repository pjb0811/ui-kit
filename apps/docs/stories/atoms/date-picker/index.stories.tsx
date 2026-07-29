'use client';

import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DatePicker } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof DatePicker> = {
  title: 'Data Entry/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    defaultValue: {
      description: 'Uncontrolled 모드의 초기 날짜',
    },
    value: {
      description: 'Controlled 모드의 날짜',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: props => (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        'w-80 p-6',
        'rounded-md border',
        'bg-gray-50',
      )}
    >
      <DatePicker {...props} />
    </div>
  ),
};

export const Controlled: Story = {
  args: {
    value: new Date(),
  },
  render: function Render({ value = new Date() }) {
    const [date, setDate] = useState(value);

    useEffect(() => {
      setDate(value);
    }, [value]);

    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-4',
          'w-80 p-6',
          'rounded-md border',
          'bg-gray-50',
        )}
      >
        <DatePicker value={date} onChange={next => next && setDate(next)} />
      </div>
    );
  },
};
