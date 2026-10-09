import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Cascader, type CascaderOption, Config } from '@repo/ui';

const options: CascaderOption[] = [
  {
    value: 'europe',
    label: 'Europe',
    children: [
      {
        value: 'france',
        label: 'France',
        children: [
          { value: 'paris', label: 'Paris' },
          { value: 'lyon', label: 'Lyon', disabled: true },
        ],
      },
      { value: 'empty', label: 'Empty children leaf', children: [] },
    ],
  },
  {
    value: 'asia',
    label: 'Asia',
    children: [
      {
        value: 'korea',
        label: 'Korea',
        children: [{ value: 'seoul', label: 'Seoul' }],
      },
    ],
  },
  {
    value: 'blocked',
    label: 'Blocked branch',
    disabled: true,
    children: [{ value: 'child', label: 'Blocked child' }],
  },
];

const meta: Meta<typeof Cascader> = {
  title: 'Data Entry/Cascader',
  component: Cascader,
  args: { options, 'aria-label': 'Region', onChange: fn() },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByRole('button', { name: 'Region' }));
    await userEvent.click(
      await page.findByRole('combobox', { name: 'Level 1' }),
    );
    await userEvent.click(await page.findByRole('option', { name: 'Europe' }));
    await userEvent.click(
      await page.findByRole('combobox', { name: 'Level 2' }),
    );
    await userEvent.click(await page.findByRole('option', { name: 'France' }));
    await userEvent.click(
      await page.findByRole('combobox', { name: 'Level 3' }),
    );
    await userEvent.click(await page.findByRole('option', { name: 'Paris' }));
    expect(args.onChange).toHaveBeenLastCalledWith([
      'europe',
      'france',
      'paris',
    ]);
    expect(
      canvasElement.querySelector('[data-slot=cascader-status]'),
    ).toHaveTextContent('Europe / France / Paris');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Clear selection' }),
    );
    expect(args.onChange).toHaveBeenLastCalledWith([]);
  },
};
export const Controlled: Story = {
  render: function Render(props) {
    const [value, setValue] = useState<string[]>(['asia', 'korea', 'seoul']);

    return (
      <>
        <Cascader {...props} value={value} onChange={setValue} />
        <output>{JSON.stringify(value)}</output>
      </>
    );
  },
};
export const ControlledUnchanged: Story = {
  args: { value: ['asia', 'korea', 'seoul'] },
};
export const InitialValue: Story = {
  args: { defaultValue: ['europe', 'france', 'paris'] },
};
export const Disabled: Story = {
  args: { defaultValue: ['europe', 'france', 'paris'], disabled: true },
};
export const NoClear: Story = {
  args: { defaultValue: ['europe', 'france', 'paris'], allowClear: false },
};
export const Empty: Story = { args: { options: [] } };
export const InvalidPath: Story = { args: { value: ['missing'] } };
export const LongLabels: Story = {
  args: {
    options: [
      {
        value: 'long',
        label: 'Long category label '.repeat(10),
        children: [{ value: 'leaf', label: 'Long leaf label '.repeat(10) }],
      },
    ],
    defaultValue: ['long', 'leaf'],
  },
};
export const RepeatedValues: Story = {
  args: {
    options: [
      {
        value: 'a',
        label: 'Category A',
        children: [{ value: 'same', label: 'Leaf A' }],
      },
      {
        value: 'b',
        label: 'Category B',
        children: [{ value: 'same', label: 'Leaf B' }],
      },
    ],
    defaultValue: ['b', 'same'],
  },
};
export const RTL: Story = {
  render: props => (
    <Config direction="rtl">
      <Cascader {...props} />
    </Config>
  ),
};
export const Dark: Story = {
  render: props => (
    <Config theme={{ dark: 'dark' }}>
      <div className="bg-background p-4">
        <Cascader {...props} />
      </div>
    </Config>
  ),
};
export const CustomStyles: Story = {
  args: {
    classNames: {
      trigger: 'border-blue-600',
      popup: 'border-blue-600',
      breadcrumb: 'text-blue-600',
      select: 'border-blue-600',
      clear: 'text-blue-600',
    },
  },
};
