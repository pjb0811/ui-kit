import type { Meta, StoryObj } from '@storybook/nextjs';
import { Search } from 'lucide-react';

import { Button } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const icons = { None: '', Search: <Search /> };

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,

  parameters: {
    layout: 'centered',
  },
  argTypes: {
    asChild: { table: { disable: true } },
    icon: {
      options: Object.keys(icons),
      mapping: icons,
      control: {
        type: 'select',
        labels: {
          Search: 'Search',
        },
      },
    },
    variant: {
      control: { type: 'select' },
      options: [
        'default',
        'secondary',
        'ghost',
        'destructive',
        'outline',
        'link',
      ],
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
  render: props => {
    return (
      <div
        className={cn(
          'flex items-center justify-center',
          'w-100 p-2',
          'rounded-md border',
          //
        )}
      >
        <Button {...props} />
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '버튼',
  },
};
