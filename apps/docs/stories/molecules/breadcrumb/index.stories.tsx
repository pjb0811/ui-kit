import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChevronRight, House } from 'lucide-react';

import { Breadcrumb, Config } from '@repo/ui';

const items = [
  { key: 'home', title: 'Home', href: '#home' },
  { key: 'components', title: 'Components', href: '#components' },
  { key: 'breadcrumb', title: 'Breadcrumb' },
];

const meta: Meta<typeof Breadcrumb> = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  parameters: { layout: 'centered' },
  args: { items },
  argTypes: {
    maxItems: { control: 'number' },
    itemsBeforeCollapse: { control: 'number' },
    itemsAfterCollapse: { control: 'number' },
    expandText: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Icons: Story = {
  args: {
    items: [
      { ...items[0]!, icon: <House className="size-4" /> },
      ...items.slice(1),
    ],
  },
};

export const CustomSeparator: Story = {
  args: {
    separator: <ChevronRight className="size-4" />,
    items: [items[0]!, { ...items[1]!, separator: '›' }, items[2]!],
  },
};

export const Collapsed: Story = {
  args: {
    maxItems: 4,
    items: [
      { title: 'Home', href: '#home' },
      { title: 'Products', href: '#products' },
      { title: 'Catalog', href: '#catalog' },
      { title: 'Accessories', href: '#accessories' },
      { title: 'Watches', href: '#watches' },
      { title: 'Details' },
    ],
  },
};

export const ClickHandler: Story = {
  render: function Render() {
    const [selected, setSelected] = useState(false);

    return (
      <div className="space-y-2">
        <Breadcrumb
          items={[
            { title: 'Back to results', onClick: () => setSelected(true) },
            { title: 'Details' },
          ]}
        />
        <p>{selected ? 'Results selected' : 'Select the ancestor'}</p>
      </div>
    );
  },
};

export const CustomRenderer: Story = {
  args: {
    itemRender: (item, index, isCurrent) =>
      item.href ? (
        <a
          href={item.href}
          data-index={index}
          aria-current={isCurrent ? 'page' : undefined}
        >
          {item.title}
        </a>
      ) : (
        <span aria-current={isCurrent ? 'page' : undefined}>{item.title}</span>
      ),
  },
};

export const Rtl: Story = {
  render: args => (
    <Config direction="rtl">
      <Breadcrumb {...args} aria-label="مسار التنقل" />
    </Config>
  ),
};
