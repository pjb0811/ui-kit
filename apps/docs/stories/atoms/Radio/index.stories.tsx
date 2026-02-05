import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Radio } from '@repo/ui';

const meta: Meta<typeof Radio> = {
  title: 'UI/Radio',
  component: Radio,
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
    children: '라디오',
    defaultChecked: false,
    placement: 'left',
  },
};

export const Controlled: Story = {
  args: {
    children: '라디오',
    placement: 'left',
    checked: true,
  },
  render: function Render({ checked: _checked, ...props }) {
    const [checked, setChecked] = useState(_checked);

    useEffect(() => {
      setChecked(_checked);
    }, [_checked]);

    return (
      <Radio
        {...props}
        checked={checked}
        onChange={next => {
          setChecked(next);
        }}
      />
    );
  },
};
