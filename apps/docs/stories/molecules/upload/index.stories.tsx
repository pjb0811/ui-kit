'use client';

import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Upload, type UploadFile } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof Upload> = {
  title: 'UI/Upload',
  component: Upload,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    multiple: {
      description: '여러 파일 업로드 허용 여부',
    },
    maxCount: {
      description: '최대 업로드 파일 수 (생략 시 무제한)',
    },
    accept: {
      description: '업로드 허용 MIME 타입',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: props => (
    <div className={cn('w-96')}>
      <Upload {...props} />
    </div>
  ),
};

export const SingleFile: Story = {
  args: {
    multiple: false,
    maxCount: 1,
  },
  render: props => (
    <div className={cn('w-96')}>
      <Upload {...props} />
    </div>
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [files, setFiles] = useState<UploadFile[]>([]);

    return (
      <div className={cn('w-96')}>
        <Upload value={files} onChange={setFiles} />
      </div>
    );
  },
};
