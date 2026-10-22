import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within } from 'storybook/test';

import { Statistic } from '@repo/ui';

const meta: Meta<typeof Statistic> = {
  title: 'UI/Statistic',
  component: Statistic,
  args: { title: 'Active accounts', value: 12345.67 },
};

export default meta;
type Story = StoryObj<typeof meta>;

const valueOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector('[data-slot="statistic"]')!;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(valueOf(canvasElement)).toHaveTextContent(
      'Active accounts12,345.67',
    );
  },
};
export const Precision: Story = {
  args: { precision: 2, prefix: '$', value: 0.125 },
  play: async ({ canvasElement }) => {
    await expect(valueOf(canvasElement)).toHaveTextContent('$0.13');
  },
};
export const Locale: Story = {
  args: { locale: 'de-DE', suffix: 'EUR' },
  play: async ({ canvasElement }) => {
    await expect(valueOf(canvasElement)).toHaveTextContent('12.345,67EUR');
  },
};
export const Zero: Story = {
  args: { value: 0 },
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByText('0')).toBeVisible();
  },
};
export const Loading: Story = {
  args: { loading: true, formatter: fn(value => `${value}`) },
  play: async ({ args, canvasElement }) => {
    const statistic = valueOf(canvasElement);

    await expect(statistic).toHaveAttribute('aria-busy', 'true');
    await expect(statistic).toHaveTextContent(/^Active accounts$/);
    await expect(args.formatter).not.toHaveBeenCalled();
  },
};
export const Invalid: Story = {
  args: { value: NaN },
  play: async ({ canvasElement }) => {
    await expect(valueOf(canvasElement)).toHaveTextContent('Active accounts—');
  },
};
export const CustomFormat: Story = {
  args: { value: '12 / 24', formatter: value => <strong>{value}</strong> },
};

// Each row renders `value` with the default en-US formatting unless noted.
const formattingCases = [
  { name: 'negative', value: -1234.5, expected: '-1,234.5' },
  { name: 'fraction', value: 0.000123, expected: '0' },
  { name: 'large', value: 12_345_678_901_234, expected: '12,345,678,901,234' },
  { name: 'precision zero', value: 2.5, precision: 0, expected: '3' },
  {
    name: 'precision clamp',
    value: 1,
    precision: 25,
    expected: '1.' + '0'.repeat(20),
  },
  { name: 'negative precision', value: 9.87, precision: -1, expected: '10' },
  { name: 'empty string', value: '', expected: '—' },
  { name: 'undefined', value: undefined, expected: '—' },
  { name: 'infinity', value: Infinity, expected: '—' },
  { name: 'string as is', value: '1,000+', expected: '1,000+' },
  {
    name: 'invalid locale',
    value: 1234.5,
    locale: 'not a locale',
    expected: '1,234.5',
  },
] as const;

export const FormattingCases: Story = {
  render: () => (
    <div className="grid gap-4">
      {formattingCases.map(({ name, expected: _expected, ...props }) => (
        <Statistic key={name} title={name} data-testid={name} {...props} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const { name, expected } of formattingCases) {
      await expect(canvas.getByTestId(name)).toHaveTextContent(
        `${name}${expected}`,
      );
    }
  },
};
