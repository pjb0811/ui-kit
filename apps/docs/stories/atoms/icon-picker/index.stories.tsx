'use client';

import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { IconPicker } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof IconPicker> = {
  title: 'UI/IconPicker',
  component: IconPicker,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    defaultValue: {
      description: 'Uncontrolled 모드의 초기 아이콘 이름',
    },
    value: {
      description: 'Controlled 모드의 아이콘 이름',
    },
    icons: {
      description: '선택 가능한 아이콘 맵. 생략 시 기본 아이콘 세트 사용',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 'Star',
    placeholder: 'Select an icon',
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
      <IconPicker {...props} />
    </div>
  ),
};

export const Controlled: Story = {
  args: {
    value: 'Heart',
  },
  render: function Render({ value = 'Heart' }) {
    const [icon, setIcon] = useState(value);

    useEffect(() => {
      setIcon(value);
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
        <IconPicker value={icon} onChange={setIcon} />
      </div>
    );
  },
};
