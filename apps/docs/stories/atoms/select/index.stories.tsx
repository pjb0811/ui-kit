import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Config, Select } from '@repo/ui';

const meta: Meta<typeof Select> = {
  title: 'Data Entry/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '선택하세요',
    options: [
      { label: '옵션 1', value: '1' },
      { label: '옵션 2', value: '2' },
      { label: '옵션 3', value: '3' },
    ],
  },
};

export const Grouped: Story = {
  args: {
    placeholder: '글꼴을 선택하세요',
    options: [
      {
        label: 'Sans serif',
        options: [
          { label: 'Inter', value: 'inter' },
          { label: 'Pretendard', value: 'pretendard' },
        ],
      },
      {
        label: 'Monospace',
        options: [
          { label: 'JetBrains Mono', value: 'jetbrains-mono' },
          { label: 'Geist Mono', value: 'geist-mono' },
        ],
      },
    ],
  },
};

export const Controlled: Story = {
  render: function ControlledSelect() {
    const [value, setValue] = useState('1');

    return (
      <div className="flex flex-col gap-3">
        <Select
          value={value}
          onChange={setValue}
          options={Default.args?.options}
        />
        <span data-testid="selected-value">Selected: {value}</span>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const ThemedRtl: Story = {
  render: () => (
    <Config
      direction="rtl"
      theme={{
        dark: 'dark',
        token: { colorPopover: 'oklch(0.3 0.08 250)' },
      }}
    >
      <Select
        placeholder="اختر خيارًا"
        options={[
          { label: 'الخيار الأول', value: 'first' },
          { label: 'الخيار الثاني', value: 'second' },
        ]}
      />
    </Config>
  ),
};

export const Scrollable: Story = {
  args: {
    placeholder: '항목을 선택하세요',
    options: Array.from({ length: 30 }, (_, index) => ({
      label: `항목 ${index + 1}`,
      value: String(index + 1),
    })),
  },
};
