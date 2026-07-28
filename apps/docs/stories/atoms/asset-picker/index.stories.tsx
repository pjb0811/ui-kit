'use client';

import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AssetPicker } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof AssetPicker> = {
  title: 'UI/AssetPicker',
  component: AssetPicker,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    defaultValue: {
      description: 'Uncontrolled 모드의 초기 이미지 URL/데이터 URL',
    },
    value: {
      description: 'Controlled 모드의 이미지 URL/데이터 URL',
    },
    accept: {
      description: '파일 업로드 시 허용할 MIME 타입',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter an image URL',
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
      <AssetPicker {...props} />
    </div>
  ),
};

export const Controlled: Story = {
  args: {
    value: 'https://placehold.co/80x80',
  },
  render: function Render({ value = 'https://placehold.co/80x80' }) {
    const [asset, setAsset] = useState(value);

    useEffect(() => {
      setAsset(value);
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
        <AssetPicker value={asset} onChange={setAsset} />
      </div>
    );
  },
};
