import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button, Popconfirm } from '@repo/ui';

import PopconfirmDemo from '../../../../web/src/demo/popconfirm-demo';

const meta: Meta<typeof Popconfirm> = {
  title: 'Feedback/Popconfirm',
  component: Popconfirm,
  parameters: { layout: 'centered' },
  args: { title: 'Delete this item?', children: <Button>Delete</Button> },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Description: Story = {
  args: {
    description: 'This action cannot be undone.',
    confirmText: 'Delete',
    confirmButtonProps: { danger: true },
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const Interactive: Story = { render: () => <PopconfirmDemo /> };
