'use client';

import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ColorPicker } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof ColorPicker> = {
  title: 'UI/ColorPicker',
  component: ColorPicker,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    defaultValue: {
      control: { type: 'color' },
      description: 'Uncontrolled 모드의 초기 색상 값',
    },
    value: {
      control: { type: 'color' },
      description: 'Controlled 모드의 색상 값',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: '#1677ff',
  },
  render: props => (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        'w-80 p-6',
        'rounded-md border',
        'bg-gray-50',
      )}
    >
      <ColorPicker {...props} />
    </div>
  ),
};

export const Controlled: Story = {
  args: {
    value: '#ff4d4f',
  },
  render: function Render({ value = '#ff4d4f' }) {
    const [color, setColor] = useState(value);

    useEffect(() => {
      setColor(value);
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
        <ColorPicker value={color} onChange={setColor} />
      </div>
    );
  },
};
