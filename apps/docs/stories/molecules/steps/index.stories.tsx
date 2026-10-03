import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { UserRound } from 'lucide-react';

import { Steps } from '@repo/ui';

const items = [
  { title: 'Account', description: 'Create your account' },
  { title: 'Profile', description: 'Add your details' },
  { title: 'Review', description: 'Confirm and submit' },
];

const meta: Meta<typeof Steps> = {
  title: 'Navigation/Steps',
  component: Steps,
  args: { items, current: 1 },
  argTypes: {
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    classNames: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const First: Story = { args: { current: 0 } };

export const Last: Story = { args: { current: 2 } };

export const Vertical: Story = { args: { orientation: 'vertical' } };

export const Error: Story = {
  args: {
    items: [items[0]!, { ...items[1]!, status: 'error' }, items[2]!],
  },
};

export const CustomIcon: Story = {
  args: {
    items: [
      { ...items[0]!, icon: <UserRound className="size-4" /> },
      ...items.slice(1),
    ],
  },
};

export const RightToLeft: Story = { args: { dir: 'rtl' } };

export const Dark: Story = {
  render: args => (
    <div className="dark bg-background text-foreground p-6">
      <Steps {...args} />
    </div>
  ),
};
