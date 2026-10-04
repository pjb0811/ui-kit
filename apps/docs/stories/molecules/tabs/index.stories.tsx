import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FolderKanban, House, Settings } from 'lucide-react';

import { Button, Input, Tabs } from '@repo/ui';

const items = [
  {
    key: 'overview',
    label: 'Overview',
    children: 'Workspace overview and activity.',
  },
  {
    key: 'projects',
    label: 'Projects',
    children: 'Projects and milestones.',
  },
  {
    key: 'settings',
    label: 'Settings',
    children: 'Workspace preferences.',
  },
];

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    defaultValue: { control: 'text' },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    onChange: { action: 'valueChanged' },
    keepMounted: { control: 'boolean' },
    activateOnFocus: { control: 'boolean' },
    scrollable: { control: 'boolean' },
    fitted: { control: 'boolean' },
  },
  args: {
    items,
    listLabel: 'Workspace sections',
    defaultValue: 'overview',
    orientation: 'horizontal',
    className: 'w-96',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
};

export const Disabled: Story = {
  args: {
    items: items.map(item =>
      item.key === 'projects' ? { ...item, disabled: true } : item,
    ),
  },
};

export const Icons: Story = {
  args: {
    items: [
      { ...items[0]!, icon: <House className="size-4" /> },
      { ...items[1]!, icon: <FolderKanban className="size-4" /> },
      { ...items[2]!, icon: <Settings className="size-4" /> },
    ],
  },
};

export const KeepMounted: Story = {
  args: {
    keepMounted: true,
    items: [
      {
        key: 'editor',
        label: 'Editor',
        children: <Input placeholder="Type, switch tabs, then return" />,
      },
      {
        key: 'preview',
        label: 'Preview',
        children: 'Your draft is preserved.',
      },
    ],
    defaultValue: 'editor',
  },
};

export const ActivateOnFocus: Story = {
  args: { activateOnFocus: true },
};

export const Scrollable: Story = {
  args: {
    scrollable: true,
    items: Array.from({ length: 10 }, (_, index) => ({
      key: `section-${index + 1}`,
      label: `Section ${index + 1}`,
      children: `Content for section ${index + 1}.`,
    })),
    defaultValue: 'section-1',
  },
};

export const VerticalScrollable: Story = {
  args: {
    ...Scrollable.args,
    orientation: 'vertical',
    className: 'h-52 w-96',
  },
};

export const Fitted: Story = {
  args: { fitted: true },
};

export const ExtraAction: Story = {
  args: { scrollable: true },
  render: function Render(props) {
    const [currentItems, setCurrentItems] = useState(items);

    return (
      <Tabs
        {...props}
        items={currentItems}
        extra={
          <Button
            variant="outlined"
            size="small"
            onClick={() =>
              setCurrentItems(current => [
                ...current,
                {
                  key: `section-${current.length + 1}`,
                  label: `Section ${current.length + 1}`,
                  children: `New section ${current.length + 1}.`,
                },
              ])
            }
          >
            Add
          </Button>
        }
      />
    );
  },
};

export const Controlled: Story = {
  render: function Render(props) {
    const [value, setValue] = useState('overview');

    return (
      <Tabs
        {...props}
        defaultValue={undefined}
        value={value}
        onChange={next => setValue(String(next))}
      />
    );
  },
};
