import { useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { File, Folder, FolderOpen } from 'lucide-react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import {
  Button,
  Config,
  Tree,
  type TreeActions,
  type TreeLoadOptions,
  type TreeNode,
} from '@repo/ui';

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
    expect(args.onExpand).toHaveBeenLastCalledWith(['project'], {
      node: nodes[0]!.children![0],
      expanded: false,
    });
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

const largeNodes: TreeNode[] = Array.from({ length: 100 }, (_, folder) => ({
  key: `folder-${folder}`,
  label: `Folder ${folder}`,
  children: Array.from({ length: 99 }, (_, file) => ({
    key: `file-${folder}-${file}`,
    label: `File ${folder}-${file}`,
  })),
}));
const largeExpandedKeys = largeNodes.map(node => node.key);

export const Virtual: Story = {
  args: {
    nodes: largeNodes,
    defaultExpandedKeys: largeExpandedKeys,
    virtual: true,
    height: 320,
    className: 'rounded-md border',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tree = canvas.getByRole('tree');
    const first = canvas.getByRole('treeitem', { name: 'Folder 0' });

    expect(canvas.getAllByRole('treeitem').length).toBeLessThan(40);
    first.focus();
    await userEvent.keyboard('{End}');
    await waitFor(() =>
      expect(
        canvas.getByRole('treeitem', { name: 'File 99-98' }),
      ).toHaveFocus(),
    );
    expect(canvas.getAllByRole('treeitem').length).toBeLessThan(40);
    expect(tree.scrollTop).toBeGreaterThan(0);
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() =>
      expect(canvas.getByRole('treeitem', { name: 'Folder 99' })).toHaveFocus(),
    );
    await userEvent.keyboard('{ArrowLeft}');
    expect(canvas.getByRole('treeitem', { name: 'Folder 99' })).toHaveAttribute(
      'aria-level',
      '1',
    );
    await userEvent.keyboard('{Home}');
    await waitFor(() =>
      expect(canvas.getByRole('treeitem', { name: 'Folder 0' })).toHaveFocus(),
    );
    expect(tree.scrollTop).toBe(0);
  },
};

const replaceChildren = (
  list: readonly TreeNode[],
  key: string,
  children: TreeNode[],
): TreeNode[] =>
  list.map(node =>
    node.key === key
      ? { ...node, children }
      : node.children
        ? { ...node, children: replaceChildren(node.children, key, children) }
        : node,
  );

const lazyNodes: TreeNode[] = [
  { key: 'src', label: 'src', leaf: false },
  { key: 'empty', label: 'empty', leaf: false },
  { key: 'flaky', label: 'flaky', leaf: false },
  { key: 'package', label: 'package.json' },
];

export const LazyLoading: Story = {
  args: { nodes: lazyNodes, defaultExpandedKeys: [] },
  render: function Render(props) {
    const [items, setItems] = useState(lazyNodes);
    const attempts = useRef(new Map<string, number>());
    const loadData = async (node: TreeNode, { signal }: TreeLoadOptions) => {
      const attempt = (attempts.current.get(node.key) ?? 0) + 1;

      attempts.current.set(node.key, attempt);
      await new Promise(resolve => setTimeout(resolve, 200));

      if (node.key === 'flaky' && attempt === 1) {
        throw new Error('Network error');
      }

      if (signal.aborted) {
        return;
      }

      setItems(current =>
        replaceChildren(
          current,
          node.key,
          node.key === 'empty'
            ? []
            : [
                { key: `${node.key}/lib`, label: 'lib', leaf: false },
                { key: `${node.key}/index.ts`, label: 'index.ts' },
              ],
        ),
      );
    };

    return (
      <>
        <Tree {...props} nodes={items} loadData={loadData} />
        <output data-testid="attempts">
          {JSON.stringify(Object.fromEntries(attempts.current))}
        </output>
      </>
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const src = canvas.getByRole('treeitem', { name: 'src' });

    expect(src).toHaveAttribute('aria-expanded', 'false');
    src.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(args.onExpand).toHaveBeenLastCalledWith(['src'], {
      node: lazyNodes[0],
      expanded: true,
    });
    await waitFor(() => expect(src).toHaveAttribute('aria-busy', 'true'));
    await userEvent.keyboard('{ArrowLeft}{ArrowRight}');
    expect(
      await canvas.findByRole('treeitem', { name: 'index.ts' }),
    ).toBeInTheDocument();
    expect(src).not.toHaveAttribute('aria-busy');

    const empty = canvas.getByRole('treeitem', { name: 'empty' });

    await userEvent.click(empty.querySelector('button')!);
    await waitFor(() => expect(empty).not.toHaveAttribute('aria-busy'));
    expect(empty).toHaveAttribute('aria-expanded', 'true');

    const flaky = canvas.getByRole('treeitem', { name: 'flaky' });

    flaky.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() =>
      expect(flaky).toHaveAccessibleDescription(/불러오지 못함/),
    );
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() =>
      expect(canvas.getAllByRole('treeitem', { name: 'lib' })).toHaveLength(2),
    );
    await waitFor(() =>
      expect(canvas.getByTestId('attempts')).toHaveTextContent(
        '{"src":1,"empty":1,"flaky":2}',
      ),
    );
  },
};

const explorerNodes: TreeNode[] = [
  {
    key: 'app',
    label: 'app',
    children: [
      { key: 'app/page.tsx', label: 'page.tsx' },
      { key: 'app/layout.tsx', label: 'layout.tsx' },
    ],
  },
  ...Array.from({ length: 300 }, (_, index) => ({
    key: `module-${index}`,
    label: `module-${index}`,
    leaf: false,
  })),
];

export const FileExplorer: Story = {
  args: { nodes: explorerNodes },
  render: function Render(props) {
    const [items, setItems] = useState(explorerNodes);
    const [expanded, setExpanded] = useState<string[]>([]);
    const [opened, setOpened] = useState<string | null>(null);
    const actions = useRef<TreeActions>(null);
    const branches = new Set(
      explorerNodes
        .filter(node => node.leaf === false || node.children)
        .map(node => node.key),
    );
    const withIcons = (list: readonly TreeNode[]): TreeNode[] =>
      list.map(node => ({
        ...node,
        icon:
          node.leaf === false || node.children ? (
            expanded.includes(node.key) ? (
              <FolderOpen />
            ) : (
              <Folder />
            )
          ) : (
            <File />
          ),
        children: node.children && withIcons(node.children),
      }));

    return (
      <>
        <Button onClick={() => actions.current?.scrollTo('module-250')}>
          Scroll to module-250
        </Button>
        <Tree
          {...props}
          aria-label="Explorer"
          nodes={withIcons(items)}
          virtual
          height={240}
          expandOnClick
          actionRef={actions}
          className="mt-2 w-72 rounded-md border"
          expandedKeys={expanded}
          onExpand={setExpanded}
          onSelect={keys => {
            const [key] = keys;

            if (key && !branches.has(key)) {
              setOpened(key);
            }
          }}
          loadData={async (node, { signal }) => {
            await new Promise(resolve => setTimeout(resolve, 100));

            if (signal.aborted) {
              return;
            }

            setItems(current =>
              replaceChildren(current, node.key, [
                { key: `${node.key}/index.ts`, label: 'index.ts' },
              ]),
            );
          }}
        />
        <output data-testid="opened">{opened ?? 'none'}</output>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const app = canvas.getByRole('treeitem', { name: 'app' });

    await userEvent.click(within(app).getByText('app'));
    expect(app).toHaveAttribute('aria-expanded', 'true');
    expect(canvas.getByTestId('opened')).toHaveTextContent('none');
    await userEvent.click(canvas.getByText('page.tsx'));
    expect(canvas.getByTestId('opened')).toHaveTextContent('app/page.tsx');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Scroll to module-250' }),
    );
    const target = await canvas.findByRole('treeitem', {
      name: 'module-250',
    });

    await userEvent.click(within(target).getByText('module-250'));
    expect(
      await canvas.findByRole('treeitem', { name: 'index.ts' }),
    ).toBeInTheDocument();
    expect(canvas.getByTestId('opened')).toHaveTextContent('app/page.tsx');
  },
};
