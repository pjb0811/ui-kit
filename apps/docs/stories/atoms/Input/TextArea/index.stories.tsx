'use client';

import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Input } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof Input.TextArea> = {
  title: 'UI/Input/TextArea',
  component: Input.TextArea,
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
    rows: {
      control: { type: 'number' },
      description: '표시할 행 수',
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
    placeholder: '여러 줄의 텍스트를 입력하세요',
    rows: 4,
  },
  render: props => (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        'w-96 p-6',
        'rounded-md border',
        'bg-gray-50',
      )}
    >
      <Input.TextArea {...props} />
    </div>
  ),
};

export const Controlled: Story = {
  args: {
    value: '',
    placeholder: '여러 줄의 텍스트를 입력하세요',
    rows: 4,
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
          'w-96 p-6',
          'rounded-md border',
          'bg-gray-50',
        )}
      >
        <Input.TextArea
          {...props}
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div className="text-sm text-gray-600">
          글자 수: {String(text).length}
        </div>
      </div>
    );
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue:
      '초기값이 설정된 TextArea입니다.\n여러 줄을 입력할 수 있습니다.',
    placeholder: '여러 줄의 텍스트를 입력하세요',
    rows: 4,
  },
  render: props => (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        'w-96 p-6',
        'rounded-md border',
        'bg-gray-50',
      )}
    >
      <Input.TextArea {...props} />
    </div>
  ),
};

export const LargeSize: Story = {
  args: {
    defaultValue: '',
    placeholder: '큰 사이즈의 TextArea',
    rows: 10,
  },
  render: props => (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        'w-96 p-6',
        'rounded-md border',
        'bg-gray-50',
      )}
    >
      <Input.TextArea {...props} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    defaultValue: '비활성화된 TextArea',
    disabled: true,
    rows: 4,
  },
  render: props => (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        'w-96 p-6',
        'rounded-md border',
        'bg-gray-50',
      )}
    >
      <Input.TextArea {...props} />
    </div>
  ),
};
