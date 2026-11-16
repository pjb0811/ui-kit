'use client';

import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { ColorPicker } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof ColorPicker> = {
  title: 'Data Entry/ColorPicker',
  component: ColorPicker,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    defaultValue: {
      control: { type: 'color' },
      description: 'Uncontrolled 모드의 초기 색상 값',
    },
    value: {
      control: { type: 'color' },
      description: 'Controlled 모드의 색상 값',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: '#1677ff',
  },
  render: props => (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        'w-80 p-6',
        'rounded-md border',
        'bg-gray-50',
      )}
    >
      <ColorPicker {...props} />
    </div>
  ),
};

export const Controlled: Story = {
  args: {
    value: '#ff4d4f',
  },
  render: function Render({ value = '#ff4d4f' }) {
    const [color, setColor] = useState(value);

    useEffect(() => {
      setColor(value);
    }, [value]);

    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-4',
          'w-80 p-6',
          'rounded-md border',
          'bg-gray-50',
        )}
      >
        <ColorPicker value={color} onChange={setColor} />
      </div>
    );
  },
};

const pickerCount = () =>
  document.body.querySelectorAll('.react-colorful').length;

export const DisabledStaysClosed: Story = {
  name: 'Disabled stays closed',
  args: { disabled: true, defaultValue: '#ff0000', onOpenChange: fn() },
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button');

    await userEvent.click(trigger, { pointerEventsCheck: 0 });
    await expect(pickerCount()).toBe(0);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(args.onOpenChange).not.toHaveBeenCalled();
  },
};

export const DisabledControlledOpen: Story = {
  name: 'Disabled overrides a controlled open',
  args: { disabled: true, open: true, defaultValue: '#ff0000' },
  play: async () => {
    await expect(pickerCount()).toBe(0);
  },
};

export const DisablingCloses: Story = {
  name: 'Disabling an open picker closes it',
  render: function Render() {
    const [disabled, setDisabled] = useState(false);

    return (
      <ColorPicker
        disabled={disabled}
        defaultValue="#ff0000"
        // Disables without a press outside, which would close it anyway.
        onOpenChange={open => {
          if (open) {
            setTimeout(() => setDisabled(true), 300);
          }
        }}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button'));
    await expect(pickerCount()).toBe(1);
    await waitFor(() => expect(pickerCount()).toBe(0));
  },
};
