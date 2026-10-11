import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { Calendar } from '@repo/ui';

const meta: Meta<typeof Calendar> = {
  title: 'UI/Calendar',
  component: Calendar,
  args: { defaultMonth: new Date(2026, 9, 1) },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = {
  args: { defaultValue: new Date(2026, 9, 11) },
};
export const Bounds: Story = {
  args: { minDate: new Date(2026, 9, 5), maxDate: new Date(2026, 9, 20) },
};
export const Markers: Story = {
  args: {
    expanded: true,
    renderDate: date => (date.getDate() === 11 ? 'Meeting' : null),
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.textContent).toContain('Meeting');
    expect(
      canvasElement.querySelectorAll('button[aria-label]'),
    ).not.toHaveLength(0);
  },
};
