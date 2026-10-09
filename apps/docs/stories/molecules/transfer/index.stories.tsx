import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Config, Transfer, type TransferProps } from '@repo/ui';

const items = [
  { key: 'a', label: 'Alpha', description: 'First item' },
  { key: 'b', label: 'Beta' },
  { key: 'c', label: 'Gamma', disabled: true },
  { key: 'd', label: 'Delta' },
  { key: 'e', label: 'Epsilon', disabled: true },
];

function ControlledTransfer(props: TransferProps) {
  const [targetKeys, setTargetKeys] = useState<string[]>([...props.targetKeys]);

  return (
    <>
      <Transfer
        {...props}
        targetKeys={targetKeys}
        onChange={keys => {
          props.onChange?.(keys);
          setTargetKeys(keys);
        }}
      />
      <output>{JSON.stringify(targetKeys)}</output>
    </>
  );
}

const meta: Meta<typeof Transfer> = {
  title: 'Data Entry/Transfer',
  component: Transfer,
  args: { items, targetKeys: ['d', 'e'], onChange: fn() },
  render: props => <ControlledTransfer {...props} />,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const source = within(canvas.getByRole('region', { name: 'Available' }));
    const target = within(canvas.getByRole('region', { name: 'Chosen' }));

    await userEvent.click(source.getByRole('checkbox', { name: 'Alpha' }));
    await userEvent.click(
      canvas.getByRole('button', { name: 'Move to chosen' }),
    );
    expect(args.onChange).toHaveBeenLastCalledWith(['d', 'e', 'a']);
    expect(target.getByRole('checkbox', { name: 'Alpha' })).toBeInTheDocument();
    await userEvent.click(
      target.getByRole('checkbox', { name: 'Select all visible items' }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Move to available' }),
    );
    expect(args.onChange).toHaveBeenLastCalledWith(['e']);
    expect(target.getByRole('checkbox', { name: 'Epsilon' })).toBeDisabled();
    expect(source.getByRole('checkbox', { name: 'Gamma' })).toBeDisabled();
  },
};
export const Search: Story = {
  args: { searchable: true },
};
export const SearchInteractions: Story = {
  args: { searchable: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const source = within(canvas.getByRole('region', { name: 'Available' }));

    await userEvent.click(source.getByRole('checkbox', { name: 'Beta' }));
    await userEvent.type(
      source.getByRole('searchbox', { name: 'Search Available' }),
      'Alpha',
    );
    expect(
      canvas.getByRole('button', { name: 'Move to chosen' }),
    ).toBeDisabled();
    await userEvent.click(
      source.getByRole('checkbox', { name: 'Select all visible items' }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Move to chosen' }),
    );
    expect(args.onChange).toHaveBeenLastCalledWith(['d', 'e', 'a']);
    await userEvent.clear(
      source.getByRole('searchbox', { name: 'Search Available' }),
    );
    expect(source.getByRole('checkbox', { name: 'Beta' })).toBeChecked();
  },
};
export const BulkSelection: Story = {};
export const ControlledUnchanged: Story = {
  render: props => <Transfer {...props} />,
};
export const Disabled: Story = { args: { searchable: true, disabled: true } };
export const Empty: Story = {
  args: { items: [], targetKeys: [], searchable: true },
};
export const LongLabels: Story = {
  args: {
    items: [{ key: 'long', label: 'LongUnbrokenLabel'.repeat(25) }],
    targetKeys: [],
  },
};
export const UnknownKeys: Story = {
  args: { targetKeys: ['missing', 'missing', 'd', 'e'] },
};
export const RTL: Story = {
  render: props => (
    <Config direction="rtl">
      <ControlledTransfer {...props} />
    </Config>
  ),
};
export const Dark: Story = {
  render: props => (
    <Config theme={{ dark: 'dark' }}>
      <ControlledTransfer {...props} />
    </Config>
  ),
};
export const CustomStyles: Story = {
  args: {
    classNames: {
      panel: 'border-blue-600',
      header: 'bg-blue-50',
      list: 'h-48',
    },
  },
};
