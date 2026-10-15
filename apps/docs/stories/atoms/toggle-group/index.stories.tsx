import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Bold, Italic, Underline } from 'lucide-react';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';

import {
  Config,
  Segmented,
  ToggleGroup,
  type ToggleGroupOption,
} from '@repo/ui';

const formatting: ToggleGroupOption[] = [
  { value: 'bold', label: 'Bold', icon: <Bold />, iconOnly: true },
  { value: 'italic', label: 'Italic', icon: <Italic />, iconOnly: true },
  {
    value: 'underline',
    label: 'Underline',
    icon: <Underline />,
    iconOnly: true,
  },
];

const filters: ToggleGroupOption[] = [
  { value: 'open', label: 'Open' },
  { value: 'mine', label: 'Assigned to me' },
  { value: 'archived', label: 'Archived', disabled: true },
  { value: 'urgent', label: 'Urgent' },
];

const meta: Meta<typeof ToggleGroup> = {
  title: 'Data Entry/ToggleGroup',
  component: ToggleGroup,
  args: {
    'aria-label': 'Filters',
    options: filters,
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'radio', options: ['small', 'middle', 'large'] },
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    classNames: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MultiplePressed: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const open = canvas.getByRole('button', { name: 'Open' });
    const urgent = canvas.getByRole('button', { name: 'Urgent' });

    await userEvent.click(urgent);
    await userEvent.click(open);
    await expect(args.onChange).toHaveBeenLastCalledWith(['open', 'urgent']);
    await expect(open).toHaveAttribute('aria-pressed', 'true');
    await expect(urgent).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(open);
    await expect(args.onChange).toHaveBeenLastCalledWith(['urgent']);
    await userEvent.click(urgent);
    await expect(args.onChange).toHaveBeenLastCalledWith([]);
    await expect(urgent).toHaveAttribute('aria-pressed', 'false');
  },
};

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const open = canvas.getByRole('button', { name: 'Open' });

    await userEvent.tab();
    await expect(open).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(
      canvas.getByRole('button', { name: 'Assigned to me' }),
    ).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'Urgent' })).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(args.onChange).toHaveBeenLastCalledWith(['urgent']);
    await userEvent.keyboard('{Enter}');
    await expect(args.onChange).toHaveBeenLastCalledWith([]);
  },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    canvas.getByRole('button', { name: 'Open' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(
      canvas.getByRole('button', { name: 'Assigned to me' }),
    ).toHaveFocus();
  },
};

export const RTL: Story = {
  render: args => (
    <Config direction="rtl">
      <ToggleGroup {...args} />
    </Config>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    canvas.getByRole('button', { name: 'Open' }).focus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(
      canvas.getByRole('button', { name: 'Assigned to me' }),
    ).toHaveFocus();
  },
};

export const IconOnly: Story = {
  args: { 'aria-label': 'Text formatting', options: formatting },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const name of ['Bold', 'Italic', 'Underline']) {
      await expect(canvas.getByRole('button', { name })).toBeVisible();
    }

    await expect(canvas.queryByText('Bold')).not.toBeInTheDocument();
  },
};

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string[]>(['open']);

    return (
      <div className="space-y-3">
        <ToggleGroup
          {...args}
          value={value}
          onChange={next => {
            args.onChange?.(next);
            setValue(next);
          }}
        />
        <output>{JSON.stringify(value)}</output>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Urgent' }));
    await expect(canvas.getByRole('status')).toHaveTextContent(
      '["open","urgent"]',
    );
  },
};

export const ControlledUnchanged: Story = {
  args: { value: ['open', 'unknown'] },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const urgent = canvas.getByRole('button', { name: 'Urgent' });

    await userEvent.click(urgent);
    await expect(args.onChange).toHaveBeenLastCalledWith([
      'open',
      'urgent',
      'unknown',
    ]);
    await expect(urgent).toHaveAttribute('aria-pressed', 'false');
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: ['open'] },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Disabled buttons have `pointer-events: none`, which userEvent refuses.
    fireEvent.click(canvas.getByRole('button', { name: 'Urgent' }));
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(canvas.getByRole('button', { name: 'Open' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  },
};

export const DisabledOption: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    fireEvent.click(canvas.getByRole('button', { name: 'Archived' }));
    await expect(args.onChange).not.toHaveBeenCalled();
    canvas.getByRole('button', { name: 'Assigned to me' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'Urgent' })).toHaveFocus();
  },
};

export const InForm: Story = {
  render: function Render(args) {
    const [submitted, setSubmitted] = useState<string | null>(null);

    return (
      <form
        onSubmit={event => {
          event.preventDefault();
          setSubmitted(
            JSON.stringify([...new FormData(event.currentTarget).keys()]),
          );
        }}
      >
        <ToggleGroup {...args} />
        <button type="submit">Submit</button>
        <output>{submitted ?? 'not submitted'}</output>
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Open' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('not submitted');
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('[]');
  },
};

export const Sizes: Story = {
  render: args => (
    <div className="flex flex-col items-start gap-3">
      {(['small', 'middle', 'large'] as const).map(size => (
        <ToggleGroup key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const LongLabels: Story = {
  args: {
    options: [
      { value: 'a', label: 'A very long filter label that keeps going' },
      { value: 'b', label: 'Another long label' },
    ],
  },
};

export const Dark: Story = {
  args: { defaultValue: ['open'] },
  render: args => (
    <Config theme={{ dark: 'dark' }}>
      <div className="bg-background p-4">
        <ToggleGroup {...args} />
      </div>
    </Config>
  ),
};

export const SegmentedUnchanged: Story = {
  render: () => <Segmented aria-label="View" options={['Grid', 'List']} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByRole('button', { name: 'Grid' });

    await userEvent.click(grid);
    await expect(grid).toHaveAttribute('aria-pressed', 'true');
  },
};
