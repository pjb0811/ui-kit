import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Config, Divider, Space, Typography } from '@repo/ui';

const meta: Meta<typeof Divider> = {
  title: 'UI/Divider',
  component: Divider,
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['solid', 'dashed', 'dotted'] },
    titlePlacement: { control: 'select', options: ['start', 'center', 'end'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Labeled: Story = { args: { children: 'Account details' } };
export const Start: Story = {
  args: { children: 'Account details', titlePlacement: 'start' },
};
export const End: Story = {
  args: { children: 'Account details', titlePlacement: 'end' },
};
export const Dashed: Story = { args: { variant: 'dashed' } };
export const Dotted: Story = { args: { variant: 'dotted' } };
export const Vertical: Story = {
  render: props => (
    <Space
      className="h-10"
      split={<Divider {...props} orientation="vertical" />}
    >
      <Typography.Text>Profile</Typography.Text>
      <Typography.Text>Settings</Typography.Text>
      <Typography.Text>Activity</Typography.Text>
    </Space>
  ),
};
export const Semantic: Story = {
  args: {
    decorative: false,
    children: 'Account details',
    id: 'account-divider',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const divider = canvas.getByRole('separator', { name: 'Account details' });

    expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
    expect(divider).toHaveAttribute('id', 'account-divider');
    expect(canvas.getAllByRole('separator')).toHaveLength(1);
  },
};
export const Decorative: Story = {
  args: { children: 'Visual label' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.queryByRole('separator')).toBeNull();
    expect(canvas.getByText('Visual label')).toBeVisible();
  },
};
export const ZeroLabel: Story = { args: { children: 0 } };
export const LongLabel: Story = {
  args: { children: 'LongUnbrokenLabel'.repeat(20) },
};
export const RTL: Story = {
  args: { children: 'Account details', titlePlacement: 'start' },
  render: props => (
    <Config direction="rtl">
      <Divider {...props} />
    </Config>
  ),
};
export const Dark: Story = {
  args: { children: 'Account details' },
  render: props => (
    <Config theme={{ dark: 'dark' }}>
      <Divider {...props} />
    </Config>
  ),
};
