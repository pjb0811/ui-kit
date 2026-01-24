import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Search } from 'lucide-react';

import { Button } from '@repo/ui';
import { cn } from '@repo/ui/utils';

type ButtonProps = React.ComponentProps<typeof Button>;
type VariantType = NonNullable<ButtonProps['variant']>;
type ColorType = NonNullable<ButtonProps['color']>;

const icons = { None: '', Search: <Search /> };
const variantOptions: VariantType[] = [
  'solid',
  'outlined',
  'dashed',
  'filled',
  'text',
  'link',
];
const colorOptions: ColorType[] = [
  'default',
  'primary',
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
];

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
      options: variantOptions,
    },
    color: {
      control: { type: 'select' },
      options: colorOptions,
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
