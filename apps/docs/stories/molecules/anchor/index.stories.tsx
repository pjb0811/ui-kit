import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Anchor } from '@repo/ui';

const meta: Meta<typeof Anchor> = {
  title: 'UI/Anchor',
  component: Anchor,
  args: {
    current: '#details',
    items: [
      { key: 'intro', href: '#intro', title: 'Introduction' },
      { key: 'details', href: '#details', title: 'Details' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      canvas.getByRole('navigation', { name: 'On this page' }),
    ).toBeVisible();
    expect(canvas.getByRole('link', { name: 'Details' })).toHaveAttribute(
      'aria-current',
      'location',
    );
    expect(canvas.getByRole('link', { name: 'Introduction' })).toHaveAttribute(
      'href',
      '#intro',
    );
  },
};
export const Nested: Story = {
  args: {
    items: [
      {
        key: 'intro',
        href: '#intro',
        title: 'Introduction',
        children: [{ key: 'details', href: '#details', title: 'Details' }],
      },
    ],
  },
};
