import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Col, Row } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof Row> = {
  title: 'Layout/Grid',
  component: Row,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    align: {
      control: { type: 'select' },
      options: ['top', 'middle', 'bottom', 'stretch'],
    },
    justify: {
      control: { type: 'select' },
      options: [
        'start',
        'end',
        'center',
        'space-around',
        'space-between',
        'space-evenly',
      ],
    },
    wrap: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const Block = ({ children }: { children: React.ReactNode }) => (
  <div
    className={cn(
      'rounded bg-blue-50 py-4 text-center text-sm text-blue-700',
      'border border-blue-200',
    )}
  >
    {children}
  </div>
);

// Resize the preview (or open on a phone) to see the columns reflow —
// entirely via CSS media queries, no JavaScript measurement involved
// (see #228: this used to only be correct after client-side hydration).
export const Responsive: Story = {
  args: {
    gutter: 16,
  },
  render: args => (
    <Row {...args}>
      {[1, 2, 3, 4].map(n => (
        <Col key={n} span={24} sm={12} md={8} lg={6}>
          <Block>span=24 sm=12 md=8 lg=6</Block>
        </Col>
      ))}
    </Row>
  ),
};

export const Gutter: Story = {
  args: {
    gutter: [16, 24],
  },
  render: args => (
    <Row {...args}>
      {Array.from({ length: 6 }, (_, i) => i + 1).map(n => (
        <Col key={n} span={8}>
          <Block>span=8</Block>
        </Col>
      ))}
    </Row>
  ),
};

export const Offset: Story = {
  args: {
    gutter: 16,
  },
  render: args => (
    <Row {...args}>
      <Col span={8}>
        <Block>span=8</Block>
      </Col>
      <Col span={8} offset={8}>
        <Block>span=8 offset=8</Block>
      </Col>
    </Row>
  ),
};

export const AlignAndJustify: Story = {
  args: {
    gutter: 16,
    align: 'middle',
    justify: 'space-between',
  },
  render: args => (
    <Row {...args} className="h-32 bg-gray-50">
      <Col span={4}>
        <Block>span=4</Block>
      </Col>
      <Col span={4}>
        <Block>span=4</Block>
      </Col>
      <Col span={4}>
        <Block>span=4</Block>
      </Col>
    </Row>
  ),
};
