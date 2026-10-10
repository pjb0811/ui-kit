import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Button, Config, Tree, type TreeNode } from '@repo/ui';

const nodes: TreeNode[] = [
  {
    key: 'project',
    label: 'Project',
    children: [
      {
        key: 'src',
        label: 'Source',
        children: [
          { key: 'button', label: 'Button' },
          { key: 'input', label: 'Input' },
        ],
      },
      { key: 'readme', label: 'README' },
      {
        key: 'locked',
        label: 'Locked',
        disabled: true,
        children: [{ key: 'private', label: 'Private' }],
      },
    ],
  },
  { key: 'archive', label: 'Archive' },
];

const meta: Meta<typeof Tree> = {
  title: 'Data Display/Tree',
  component: Tree,
  args: {
    nodes,
    'aria-label': 'Files',
    defaultExpandedKeys: ['project', 'src'],
    onExpand: fn(),
    onSelect: fn(),
    onCheck: fn(),
  },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const KeyboardInteractions: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const project = canvas.getByRole('treeitem', { name: 'Project' });

    project.focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(args.onSelect).toHaveBeenLastCalledWith(['button']);
    expect(canvas.getByRole('treeitem', { name: 'Button' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(args.onExpand).toHaveBeenLastCalledWith(['project']);
    expect(canvas.getByRole('treeitem', { name: 'Source' })).toHaveFocus();
  },
};
export const Checkable: Story = {
  args: { checkable: true, defaultCheckedKeys: ['button'] },
};
export const CheckInteractions: Story = {
  args: { checkable: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const project = canvas.getByRole('treeitem', { name: 'Project' });

    project.focus();
    await userEvent.keyboard(' ');
    expect(args.onCheck).toHaveBeenLastCalledWith([
      'project',
      'src',
      'button',
      'input',
      'readme',
    ]);
    expect(project).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{ArrowDown}{ArrowDown} ');
    expect(project).toHaveAttribute('aria-checked', 'mixed');
    expect(args.onCheck).toHaveBeenLastCalledWith(['input', 'readme']);
    expect(canvas.getByRole('treeitem', { name: 'Locked' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  },
};
export const Multiple: Story = { args: { multiple: true } };
export const Controlled: Story = {
  render: function Render(props) {
    const [expanded, setExpanded] = useState(['project', 'src']);
    const [selected, setSelected] = useState<string[]>([]);
    const [checked, setChecked] = useState<string[]>([]);

    return (
      <>
        <Tree
          {...props}
          checkable
          expandedKeys={expanded}
          selectedKeys={selected}
          checkedKeys={checked}
          onExpand={setExpanded}
          onSelect={setSelected}
          onCheck={setChecked}
        />
        <output>{JSON.stringify({ expanded, selected, checked })}</output>
      </>
    );
  },
};
export const ControlledUnchanged: Story = {
  args: {
    expandedKeys: ['project', 'src'],
    selectedKeys: ['button'],
    checkedKeys: ['button'],
    checkable: true,
  },
};
export const Disabled: Story = { args: { disabled: true, checkable: true } };
export const DisabledChecked: Story = {
  args: {
    checkable: true,
    defaultCheckedKeys: ['private'],
    defaultExpandedKeys: ['project', 'src', 'locked'],
  },
};
export const Empty: Story = { args: { nodes: [] } };
export const LongLabels: Story = {
  args: {
    nodes: [
      {
        key: 'long',
        label: 'UnbrokenLabel'.repeat(40),
        children: [{ key: 'leaf', label: 'Long label '.repeat(40) }],
      },
    ],
    defaultExpandedKeys: ['long'],
    checkable: true,
  },
};
export const RTL: Story = {
  render: props => (
    <Config direction="rtl">
      <Tree {...props} />
    </Config>
  ),
};
export const Dark: Story = {
  render: props => (
    <Config theme={{ dark: 'dark' }}>
      <Tree {...props} />
    </Config>
  ),
};
export const DataUpdates: Story = {
  render: function Render(props) {
    const [items, setItems] = useState(nodes);
    const [expanded, setExpanded] = useState(['project', 'src']);

    return (
      <>
        <Button
          onClick={() => setItems([{ key: 'archive', label: 'Archive' }])}
        >
          Replace nodes
        </Button>
        <Button onClick={() => setExpanded([])}>Collapse all</Button>
        <Tree
          {...props}
          nodes={items}
          expandedKeys={expanded}
          onExpand={setExpanded}
        />
      </>
    );
  },
};
