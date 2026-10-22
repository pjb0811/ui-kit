import { useState } from 'react';

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

export const RootProps: Story = {
  render: function Render() {
    const [roots, setRoots] = useState<Record<string, HTMLElement | null>>({});
    const refFor = (name: string) => (element: HTMLElement | null) => {
      if (element && roots[name] !== element) {
        setRoots(current => ({ ...current, [name]: element }));
      }
    };

    return (
      <div className="flex h-24 flex-col gap-2">
        <Divider
          ref={refFor('plain')}
          className="plain"
          style={{ opacity: 0.5 }}
        />
        <Divider
          ref={refFor('labeled')}
          className="labeled"
          style={{ opacity: 0.5 }}
        >
          Labeled
        </Divider>
        <Divider
          ref={refFor('vertical')}
          orientation="vertical"
          className="vertical"
          style={{ opacity: 0.5 }}
        />
        <output>{Object.keys(roots).sort().join(',')}</output>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByRole('status')).toHaveTextContent(
      'labeled,plain,vertical',
    );

    for (const name of ['plain', 'labeled', 'vertical']) {
      const root = canvasElement.querySelector(`.${name}`) as HTMLElement;

      await expect(root).toHaveAttribute('data-slot', 'divider');
      await expect(root.style.opacity).toBe('0.5');
    }
  },
};
