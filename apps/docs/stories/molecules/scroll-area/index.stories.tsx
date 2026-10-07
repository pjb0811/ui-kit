import { useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button, Config, ScrollArea } from '@repo/ui';

const rows = Array.from({ length: 30 }, (_, index) => `Item ${index + 1}`);

const VerticalContent = () => (
  <ul className="space-y-2 p-3">
    {rows.map(row => (
      <li key={row} className="bg-muted rounded-sm p-2">
        {row}
      </li>
    ))}
  </ul>
);

const WideContent = () => (
  <div className="grid w-[48rem] grid-cols-6 gap-2 p-3">
    {rows.map(row => (
      <div key={row} className="bg-muted rounded-sm p-3">
        {row}
      </div>
    ))}
  </div>
);

const meta: Meta<typeof ScrollArea> = {
  title: 'Layout/ScrollArea',
  component: ScrollArea,
  parameters: { layout: 'centered' },
  args: {
    className: 'h-56 w-72 rounded-lg border',
    label: 'Items',
    children: <VerticalContent />,
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal', 'both'],
    },
    children: { table: { disable: true } },
    viewportProps: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const viewport = canvas.getByRole('region', { name: 'Items' });

    await waitFor(() => {
      expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
      expect(
        canvasElement.querySelector('[data-slot="scroll-area-thumb"]'),
      ).not.toBeNull();
    });
    viewport.focus();
    viewport.scrollTo({ top: 120 });
    await waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0));
  },
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    className: 'h-80 w-72 rounded-lg border',
    children: <WideContent />,
  },
};

export const BothAxes: Story = {
  args: { orientation: 'both', children: <WideContent /> },
};

export const NoOverflow: Story = {
  args: { children: <p className="p-3">Short content.</p> },
};

export const Empty: Story = {
  args: { children: null },
};

export const RTL: Story = {
  args: { orientation: 'both', children: <WideContent /> },
  render: props => (
    <Config direction="rtl">
      <ScrollArea {...props} />
    </Config>
  ),
};

export const Dark: Story = {
  render: props => (
    <Config theme={{ dark: 'dark' }}>
      <ScrollArea
        {...props}
        className="bg-background text-foreground h-56 w-72 rounded-lg border"
      />
    </Config>
  ),
};

export const CustomStyles: Story = {
  args: {
    classNames: {
      viewport: 'focus-visible:ring-blue-500',
      content: 'ps-2',
      scrollbar: 'bg-blue-100',
      thumb: 'bg-blue-500 hover:bg-blue-600',
    },
  },
};

export const DynamicContent: Story = {
  render: function Render(props) {
    const [expanded, setExpanded] = useState(false);

    return (
      <div className="space-y-3">
        <Button onClick={() => setExpanded(value => !value)}>
          {expanded ? 'Show short content' : 'Show long content'}
        </Button>
        <ScrollArea {...props}>
          {expanded ? (
            <VerticalContent />
          ) : (
            <p className="p-3">Short content.</p>
          )}
        </ScrollArea>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const thumb = () =>
      canvasElement.querySelector('[data-slot="scroll-area-thumb"]');

    await waitFor(() => expect(thumb()).toBeNull());
    await userEvent.click(
      canvas.getByRole('button', { name: 'Show long content' }),
    );
    await waitFor(() => expect(thumb()).not.toBeNull());
    await userEvent.click(
      canvas.getByRole('button', { name: 'Show short content' }),
    );
    await waitFor(() => expect(thumb()).toBeNull());
  },
};

export const ViewportRef: Story = {
  render: function Render(props) {
    const viewport = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState(0);

    return (
      <div className="space-y-3">
        <Button onClick={() => viewport.current?.scrollTo({ top: 200 })}>
          Scroll to item
        </Button>
        <ScrollArea
          {...props}
          viewportProps={{
            ref: viewport,
            onScroll: event =>
              setOffset(Math.round(event.currentTarget.scrollTop)),
          }}
        />
        <output>Scroll offset: {offset}</output>
        <Button>After scroll area</Button>
      </div>
    );
  },
};
