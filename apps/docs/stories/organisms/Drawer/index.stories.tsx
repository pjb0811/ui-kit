import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button, Drawer } from '@repo/ui';

const meta: Meta<typeof Drawer> = {
  title: 'UI/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    open: {
      control: { type: 'boolean' },
    },
    direction: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right'],
    },
    maskClosable: {
      control: { type: 'boolean' },
    },
    closable: {
      control: { type: 'boolean' },
    },
    handlebar: {
      control: { type: 'boolean' },
    },
    draggable: {
      control: { type: 'boolean' },
    },
    rounded: {
      control: { type: 'boolean' },
    },
    mask: {
      control: { type: 'boolean' },
    },
    title: {
      table: { disable: true },
    },
    children: {
      table: { disable: true },
    },
    footer: {
      table: { disable: true },
    },
    closeIcon: {
      table: { disable: true },
    },
    container: {
      table: { disable: true },
    },
  },
  render: function Render(props) {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>드로어 열기</Button>
        <Drawer {...props} open={open} onClose={() => setOpen(false)}>
          <p>드로어 내용입니다.</p>
        </Drawer>
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: false,
    direction: 'bottom',
    maskClosable: true,
    closable: true,
    handlebar: true,
    draggable: true,
    rounded: false,
    mask: true,
  },
};
