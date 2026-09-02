import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Tag } from '@repo/ui';

const meta: Meta<typeof Tag> = {
  title: 'General/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['filled', 'outlined'],
    },
    color: {
      control: { type: 'select' },
      options: [
        'default',
        'primary',
        'success',
        'warning',
        'danger',
        'blue',
        'purple',
        'cyan',
        'green',
        'magenta',
        'pink',
        'red',
        'orange',
        'yellow',
        'volcano',
        'geekblue',
        'lime',
        'gold',
      ],
    },
    className: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Tag',
  },
};

export const Outlined: Story = {
  args: {
    children: 'Tag',
    variant: 'outlined',
  },
};

export const Preset: Story = {
  args: {
    children: 'gold',
    color: 'gold',
  },
};
