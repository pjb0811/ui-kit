import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Check } from 'lucide-react';
import { expect, userEvent, within } from 'storybook/test';

import { Button, Config, Timeline, type TimelineItem } from '@repo/ui';

const items: TimelineItem[] = [
  {
    key: 'created',
    title: 'Order created',
    timestamp: {
      label: '8 October 2026, 09:00 UTC',
      dateTime: '2026-10-08T09:00:00Z',
    },
    description: 'Your order has been received.',
  },
  {
    key: 'packed',
    title: 'Order packed',
    timestamp: {
      label: '8 October 2026, 10:00 UTC',
      dateTime: '2026-10-08T10:00:00Z',
    },
    status: 'primary',
    marker: <Check />,
  },
  {
    key: 'delayed',
    title: 'Delivery delayed',
    status: 'error',
    description: 'Contact support for an update.',
  },
];

const meta: Meta<typeof Timeline> = {
  title: 'Data Display/Timeline',
  component: Timeline,
  parameters: { layout: 'padded' },
  args: { items, 'aria-label': 'Order history' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('list', { name: 'Order history' });
    const events = within(list).getAllByRole('listitem');

    expect(events).toHaveLength(3);
    expect(
      events.map(
        event => event.querySelector('[data-slot=timeline-title]')?.textContent,
      ),
    ).toEqual(['Order created', 'Order packed', 'Delivery delayed']);
    expect(
      list.querySelectorAll('[data-slot=timeline-connector]'),
    ).toHaveLength(2);
    expect(list.querySelector('time')).toHaveAttribute(
      'datetime',
      '2026-10-08T09:00:00Z',
    );
    expect(list.querySelector('time')).toHaveTextContent(
      '8 October 2026, 09:00 UTC',
    );
  },
};
export const Empty: Story = { args: { items: [] } };
export const SingleEvent: Story = { args: { items: items.slice(0, 1) } };
export const Minimal: Story = {
  args: {
    items: [
      { key: 'one', title: 'An event without optional content' },
      { key: 'two', title: 'Another event', description: 0 },
    ],
  },
};
export const NewestFirst: Story = { args: { items: [...items].reverse() } };
export const LabelOnlyTimestamp: Story = {
  args: {
    items: [
      {
        key: 'recent',
        title: 'Updated',
        timestamp: { label: 'A few minutes ago' },
      },
    ],
  },
};
export const LongContent: Story = {
  args: {
    items: [
      {
        key: 'long',
        title: 'LongTitle'.repeat(30),
        description: 'LongDescription'.repeat(100),
        timestamp: { label: 'LongTimestamp'.repeat(20) },
      },
      ...items,
    ],
  },
};
export const RTL: Story = {
  render: props => (
    <Config direction="rtl">
      <Timeline {...props} />
    </Config>
  ),
};
export const Dark: Story = {
  render: props => (
    <Config theme={{ dark: 'dark' }}>
      <Timeline {...props} className="bg-background rounded-lg p-4" />
    </Config>
  ),
};
export const CustomStyles: Story = {
  args: {
    classNames: {
      item: 'gap-5',
      marker: 'border-blue-600 text-blue-600',
      connector: 'bg-blue-600',
      content: 'rounded-lg border p-3',
      title: 'text-blue-600',
      description: 'text-foreground',
      timestamp: 'font-semibold',
    },
  },
};
export const InteractiveContent: Story = {
  render: function Render(props) {
    const [count, setCount] = useState(0);

    return (
      <Timeline
        {...props}
        items={[
          {
            key: 'action',
            title: 'Review event',
            description: (
              <>
                <Button onClick={() => setCount(value => value + 1)}>
                  Review
                </Button>
                <output className="ms-3">{count}</output>
              </>
            ),
          },
        ]}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Review' }));
    expect(canvasElement.querySelector('output')).toHaveTextContent('1');
  },
};
