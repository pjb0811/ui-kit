import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Statistic } from '@repo/ui';

const meta: Meta<typeof Statistic> = {
  title: 'UI/Statistic',
  component: Statistic,
  args: { title: 'Active accounts', value: 12345.67 },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Precision: Story = { args: { precision: 2, prefix: '$' } };
export const Locale: Story = { args: { locale: 'de-DE', suffix: 'EUR' } };
export const Zero: Story = {
  args: { value: 0 },
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByText('0')).toBeVisible();
  },
};
export const Loading: Story = { args: { loading: true } };
export const Invalid: Story = { args: { value: NaN } };
export const CustomFormat: Story = {
  args: { value: '12 / 24', formatter: value => <strong>{value}</strong> },
};
