'use client';

import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Input } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof Input.Search> = {
  title: 'UI/Input/Search',
  component: Input.Search,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    defaultValue: {
      control: { type: 'text' },
      description: 'Uncontrolled 모드의 초기 검색어',
    },
    value: {
      control: { type: 'text' },
      description: 'Controlled 모드의 검색어',
    },
    placeholder: {
      control: { type: 'text' },
    },
    allowClear: {
      control: { type: 'boolean' },
      description: '입력값 초기화 버튼 표시 여부',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: '',
    placeholder: '검색어를 입력하세요',
    allowClear: true,
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
      <Input.Search {...props} onSearch={() => console.log('검색 실행!')} />
    </div>
  ),
};

export const Controlled: Story = {
  args: {
    value: '',
    placeholder: '검색어를 입력하세요',
    allowClear: true,
  },
  render: function Render({ value = '', ...props }) {
    const [searchText, setSearchText] = useState(value);

    useEffect(() => {
      setSearchText(value);
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
        <Input.Search
          {...props}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onSearch={() => {
            console.log(`검색: ${searchText}`);
          }}
        />
        <div className="text-sm text-gray-600">검색어: {searchText}</div>
      </div>
    );
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: '초기 검색어',
    placeholder: '검색어를 입력하세요',
    allowClear: true,
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
      <Input.Search {...props} onSearch={() => console.log('검색 실행')} />
    </div>
  ),
};

export const WithoutClearButton: Story = {
  args: {
    defaultValue: '',
    placeholder: '검색어를 입력하세요',
    allowClear: false,
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
      <Input.Search {...props} />
    </div>
  ),
};
