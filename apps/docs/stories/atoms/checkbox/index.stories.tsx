import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Checkbox } from '@repo/ui';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placement: {
      control: { type: 'radio' },
      options: ['left', 'right'],
    },
    defaultChecked: {
      control: { type: 'boolean' },
    },
    checked: {
      control: { type: 'boolean' },
    },
    value: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '체크박스',
    defaultChecked: false,
    placement: 'left',
    value: false,
  },
};

export const Controlled: Story = {
  args: {
    children: '체크박스',
    placement: 'left',
    checked: true,
  },
  render: function Render({ checked: _checked, ...props }) {
    const [checked, setChecked] = useState(_checked);

    useEffect(() => {
      setChecked(_checked);
    }, [_checked]);

    return (
      <Checkbox
        {...props}
        checked={checked}
        onChange={next => {
          setChecked(next);
        }}
      />
    );
  },
};
