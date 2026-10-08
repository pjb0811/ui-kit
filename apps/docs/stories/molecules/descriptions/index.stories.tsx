import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Button, Config, type DescriptionItem, Descriptions } from '@repo/ui';

const items: DescriptionItem[] = [
  { key: 'name', label: 'Name', value: 'Ada Lovelace' },
  { key: 'role', label: 'Role', value: 'Engineer' },
  { key: 'team', label: 'Team', value: 'Platform' },
  { key: 'tasks', label: 'Open tasks', value: 0 },
  { key: 'notes', label: 'Notes', value: null },
  {
    key: 'link',
    label: 'Website',
    value: <a href="https://example.com">View profile</a>,
  },
];

const meta: Meta<typeof Descriptions> = {
  title: 'Data Display/Descriptions',
  component: Descriptions,
  parameters: { layout: 'padded' },
  args: { title: 'Profile', items },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    columns: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const pairs = canvasElement.querySelectorAll(
      '[data-slot="descriptions-item"]',
    );

    expect(pairs).toHaveLength(items.length);
    pairs.forEach((pair, index) => {
      expect(pair.children[0]?.tagName).toBe('DT');
      expect(pair.children[1]?.tagName).toBe('DD');
      expect(pair.children[0]?.textContent).toBe(items[index]!.label);
    });
    expect(pairs[3]!.querySelector('dd')?.textContent).toBe('0');
    expect(pairs[4]!.querySelector('dd')?.textContent).toBe('');
  },
};

export const Vertical: Story = { args: { orientation: 'vertical' } };
export const FourColumns: Story = { args: { columns: 4 } };
export const Responsive: Story = {
  args: { columns: { base: 1, sm: 2, lg: 4 } },
};
export const Empty: Story = { args: { items: [], title: undefined } };
export const LongContent: Story = {
  args: {
    columns: { base: 1, md: 2 },
    items: [
      {
        key: 'long',
        label: 'LongLabel'.repeat(12),
        value: 'LongValue'.repeat(40),
      },
      {
        key: 'paragraph',
        label: 'Description',
        value:
          'A longer description with whitespace that wraps naturally across the available width. '.repeat(
            8,
          ),
      },
    ],
  },
};
export const RTL: Story = {
  render: props => (
    <Config direction="rtl">
      <Descriptions {...props} />
    </Config>
  ),
};
export const Dark: Story = {
  render: props => (
    <Config theme={{ dark: 'dark' }}>
      <Descriptions {...props} className="bg-background rounded-lg p-4" />
    </Config>
  ),
};
export const CustomStyles: Story = {
  args: {
    classNames: {
      title: 'text-blue-600',
      list: 'gap-6',
      item: 'rounded-lg border p-3',
      label: 'text-blue-600',
      value: 'font-semibold',
    },
  },
};
export const InteractiveValues: Story = {
  render: function Render(props) {
    const [count, setCount] = useState(0);

    return (
      <Descriptions
        {...props}
        items={[
          {
            key: 'action',
            label: 'Action',
            value: (
              <Button onClick={() => setCount(value => value + 1)}>
                Increment
              </Button>
            ),
          },
          { key: 'count', label: 'Clicks', value: <output>{count}</output> },
        ]}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Increment' }));
    expect(canvasElement.querySelector('output')?.textContent).toBe('1');
  },
};
