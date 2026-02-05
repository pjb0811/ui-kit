import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Radio } from '@repo/ui';

const meta: Meta<typeof Radio.Group> = {
  title: 'UI/Radio/Group',
  component: Radio.Group,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    orientation: {
      control: { type: 'radio' },
      options: ['vertical', 'horizontal'],
    },
    placement: {
      control: { type: 'radio' },
      options: ['left', 'right'],
    },
    classNames: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: ['Option 1', 'Option 2', 'Option 3'],
    orientation: 'vertical',
    placement: 'left',
    defaultValue: 'Option 2',
  },
};

export const Controlled: Story = {
  args: {
    options: [
      { label: 'Radio A', value: 'A' },
      { label: 'Radio B', value: 'B' },
      { label: 'Radio C', value: 'C' },
    ],
    orientation: 'horizontal',
    placement: 'right',
    value: 'A',
  },
  render: function Render({ value: _value, ...props }) {
    const [value, setValue] = useState<string>('A');

    useEffect(() => {
      setValue(_value as string);
    }, [_value]);

    return (
      <Radio.Group
        options={[
          { label: 'Radio A', value: 'A' },
          { label: 'Radio B', value: 'B' },
          { label: 'Radio C', value: 'C' },
        ]}
        orientation="horizontal"
        placement="right"
        value={value}
        {...props}
        onChange={value => setValue(value as string)}
      />
    );
  },
};
