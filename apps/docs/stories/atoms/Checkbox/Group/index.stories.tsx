import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Checkbox } from '@repo/ui';

const meta: Meta<typeof Checkbox.Group> = {
  title: 'UI/Checkbox/Group',
  component: Checkbox.Group,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    direction: {
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
    direction: 'vertical',
    placement: 'left',
    defaultValue: ['Option 2'],
  },
};

export const Controlled: Story = {
  args: {
    options: [
      { label: 'Checkbox A', value: 'A' },
      { label: 'Checkbox B', value: 'B' },
      { label: 'Checkbox C', value: 'C' },
    ],
    direction: 'horizontal',
    placement: 'right',
    value: ['A', 'C'],
  },
  render: function Render({ value: _value, ...props }) {
    const [value, setValue] = useState<string[]>(['A', 'C']);

    useEffect(() => {
      setValue(_value as string[]);
    }, [_value]);

    return (
      <Checkbox.Group
        options={[
          { label: 'Checkbox A', value: 'A' },
          { label: 'Checkbox B', value: 'B' },
          { label: 'Checkbox C', value: 'C' },
        ]}
        direction="horizontal"
        placement="right"
        value={value}
        {...props}
        onChange={value => setValue(value as string[])}
      />
    );
  },
};
