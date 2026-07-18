'use client';

import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Input } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    defaultValue: {
      control: { type: 'text' },
      description: 'Uncontrolled 모드의 초기 값',
    },
    value: {
      control: { type: 'text' },
      description: 'Controlled 모드의 값',
    },
    placeholder: {
      control: { type: 'text' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: '',
    placeholder: '텍스트를 입력하세요',
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
      <Input {...props} />
    </div>
  ),
};

export const Controlled: Story = {
  args: {
    value: '',
    placeholder: '텍스트를 입력하세요',
  },
  render: function Render({ value = '', ...props }) {
    const [text, setText] = useState(value);

    useEffect(() => {
      setText(value);
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
        <Input
          {...props}
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div className="text-sm text-gray-600">현재 값: {text}</div>
      </div>
    );
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: '초기값이 있는 Input',
    placeholder: '텍스트를 입력하세요',
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
      <Input {...props} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    defaultValue: '비활성화된 Input',
    disabled: true,
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
      <Input {...props} />
    </div>
  ),
};
