import type { Meta, StoryObj } from '@storybook/nextjs';

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
  },
};
