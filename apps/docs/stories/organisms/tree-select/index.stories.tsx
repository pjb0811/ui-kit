import { useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import {
  Button,
  Config,
  Drawer,
  Modal,
  TreeSelect,
  type TreeSelectNode,
} from '@repo/ui';

const nodes: TreeSelectNode[] = [
  {
    key: 'project',
    label: 'Project',
    children: [
      {
        key: 'src',
        label: 'Source',
        children: [{ key: 'index', label: 'index.ts' }],
      },
      { key: 'docs', label: 'Docs' },
      {
        key: 'locked',
        label: 'Locked',
        disabled: true,
        children: [{ key: 'secret', label: 'Secret' }],
      },
    ],
  },
  { key: 'archive', label: 'Archive' },
];
const meta: Meta<typeof TreeSelect> = {
  title: 'Data Entry/TreeSelect',
  component: TreeSelect,
  args: { nodes, 'aria-label': 'Folder', onChange: fn(), onExpand: fn() },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Expanded: Story = {
  args: { defaultExpandedKeys: ['project', 'src', 'locked'] },
};
export const Selected: Story = {
  args: { defaultValue: 'docs', defaultExpandedKeys: ['project'] },
};
export const Controlled: Story = {
  render: function Render(props) {
    const [value, setValue] = useState<string | null>(null);

    return (
      <>
        <TreeSelect {...props} value={value} onChange={setValue} />
        <output>{value ?? 'none'}</output>
      </>
    );
  },
};
export const ControlledUnchanged: Story = { args: { value: 'archive' } };
export const ControlledExpansion: Story = {
  render: function Render(props) {
    const [expanded, setExpanded] = useState<string[]>([]);

    return (
      <TreeSelect {...props} expandedKeys={expanded} onExpand={setExpanded} />
    );
  },
};
export const ExpansionUnchanged: Story = { args: { expandedKeys: [] } };
export const MissingValue: Story = { args: { defaultValue: 'missing-folder' } };
export const Empty: Story = { args: { nodes: [] } };
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'archive' },
};
export const NoClear: Story = {
  args: { defaultValue: 'archive', allowClear: false },
};
export const LongLabels: Story = {
  args: {
    nodes: [{ key: 'long', label: 'LongFolder'.repeat(35) }],
    defaultValue: 'long',
  },
};
export const DataUpdates: Story = {
  render: function Render(props) {
    const [replacement, setReplacement] = useState(false);

    return (
      <>
        <TreeSelect
          {...props}
          defaultValue="archive"
          nodes={
            replacement
              ? [{ key: 'archive', label: 'Renamed archive' }]
              : props.nodes
          }
        />
        <Button onClick={() => setReplacement(!replacement)}>
          Change data
        </Button>
      </>
    );
  },
};
export const FormValue: Story = {
  render: function Render(props) {
    const [result, setResult] = useState('');
    const trigger = useRef<HTMLButtonElement>(null);

    return (
      <form
        onSubmit={event => {
          event.preventDefault();
          setResult(String(new FormData(event.currentTarget).get('folder')));
        }}
      >
        <TreeSelect
          {...props}
          ref={trigger}
          name="folder"
          defaultValue="archive"
        />
        <Button htmlType="submit">Submit</Button>
        <Button onClick={() => trigger.current?.focus()}>Focus trigger</Button>
        <output>{result}</output>
      </form>
    );
  },
};
export const InModal: Story = {
  render: function Render(props) {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal title="Folder" open={open} onCancel={() => setOpen(false)}>
          <TreeSelect {...props} />
        </Modal>
      </>
    );
  },
};
export const InDrawer: Story = {
  render: function Render(props) {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <Drawer title="Folder" open={open} onClose={() => setOpen(false)}>
          <TreeSelect {...props} />
        </Drawer>
      </>
    );
  },
};
export const RTL: Story = {
  render: props => (
    <Config direction="rtl">
      <TreeSelect {...props} />
    </Config>
  ),
};
export const Dark: Story = {
  render: props => (
    <Config theme={{ dark: 'dark' }}>
      <TreeSelect {...props} />
    </Config>
  ),
};
export const Events: Story = {
  render: function Render(props) {
    const [events, setEvents] = useState<string[]>([]);

    return (
      <>
        <TreeSelect
          {...props}
          onChange={value =>
            setEvents(previous => [...previous, `select:${value}`])
          }
          onExpand={keys =>
            setEvents(previous => [...previous, `expand:${keys.join(',')}`])
          }
        />
        <output>{JSON.stringify(events)}</output>
        <Button>Next field</Button>
      </>
    );
  },
};

export const ControlledOpen: Story = {
  render: function Render(props) {
    const [open, setOpen] = useState(false);

    return (
      <>
        <TreeSelect {...props} open={open} onOpenChange={setOpen} />
        <Button onClick={() => setOpen(!open)}>Toggle popup</Button>
      </>
    );
  },
};
