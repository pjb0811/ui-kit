import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Search } from 'lucide-react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

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
  'fuchsia',
  'pink',
  'red',
  'orange',
  'yellow',
  'indigo',
  'lime',
  'amber',
];

const meta: Meta<typeof Button> = {
  title: 'General/Button',
  component: Button,

  parameters: {
    layout: 'centered',
  },
  argTypes: {
    render: { table: { disable: true } },
    nativeButton: { table: { disable: true } },
    type: {
      description: 'Visual preset; use htmlType for the native button type.',
    },
    htmlType: {
      description: 'Native button type: button, submit, or reset.',
    },
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

export const LoadingKeepsFocus: Story = {
  name: 'Loading keeps focus',
  args: { onClick: fn() },
  render: function Render({ onClick }) {
    const [loading, setLoading] = useState(false);

    return (
      <Button
        loading={loading}
        onClick={event => {
          onClick?.(event);
          setLoading(true);
          setTimeout(() => setLoading(false), 300);
        }}
      >
        Save
      </Button>
    );
  },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Save' });

    button.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(button).toHaveAttribute('aria-busy', 'true'));
    await expect(button).toHaveFocus();
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    // `transition-all` animates the dimming.
    await waitFor(() => expect(getComputedStyle(button).opacity).toBe('0.5'));

    // Activation stays blocked while loading.
    await userEvent.keyboard('{Enter}');
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(args.onClick).toHaveBeenCalledTimes(1);

    await waitFor(() => expect(button).toHaveAttribute('aria-busy', 'false'));
    await expect(button).toHaveFocus();
  },
};

export const DisabledStaysNative: Story = {
  name: 'Disabled stays natively disabled',
  args: { disabled: true, children: 'Save' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Save' }),
    ).toBeDisabled();
  },
};
