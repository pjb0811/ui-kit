'use client';

import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Grid2X2, List } from 'lucide-react';

import { Segmented } from '@repo/ui';

const meta: Meta<typeof Segmented> = {
  title: 'Data Entry/Segmented',
  component: Segmented,
  args: {
    'aria-label': 'View',
    options: ['Grid', 'List', 'Compact'],
  },
  argTypes: {
    size: { control: 'radio', options: ['small', 'middle', 'large'] },
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    classNames: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('Grid');

    return (
      <div className="space-y-3">
        <Segmented {...args} value={value} onChange={setValue} />
        <p>Selected: {value}</p>
      </div>
    );
  },
};

export const IconsAndDisabled: Story = {
  args: {
    options: [
      { value: 'grid', label: 'Grid', icon: <Grid2X2 size={16} /> },
      { value: 'list', label: 'List', icon: <List size={16} /> },
      { value: 'map', label: 'Map', disabled: true },
    ],
  },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
};

export const RightToLeft: Story = {
  args: { dir: 'rtl' },
};

export const Sizes: Story = {
  render: args => (
    <div className="flex flex-col items-start gap-3">
      <Segmented {...args} size="small" />
      <Segmented {...args} size="middle" />
      <Segmented {...args} size="large" />
    </div>
  ),
};

export const Dark: Story = {
  render: args => (
    <div className="dark bg-background text-foreground p-6">
      <Segmented {...args} />
    </div>
  ),
};
