import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Heart } from 'lucide-react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Config, Rate } from '@repo/ui';

const meta: Meta<typeof Rate> = {
  title: 'Data Entry/Rate',
  component: Rate,
  args: { 'aria-label': 'Your rating', onChange: fn() },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const third = canvas.getByRole('radio', { name: '3 of 5 stars' });

    await userEvent.click(third);
    expect(third).toHaveAttribute('aria-checked', 'true');
    expect(args.onChange).toHaveBeenLastCalledWith(3);
    expect(
      canvasElement.querySelector('[data-slot=rate-status]'),
    ).toHaveTextContent('3 of 5 stars');
    await userEvent.click(third);
    expect(third).toHaveAttribute('aria-checked', 'false');
    expect(args.onChange).toHaveBeenLastCalledWith(0);
    expect(
      canvasElement.querySelector('[data-slot=rate-status]'),
    ).toHaveTextContent('No rating');
  },
};
export const Controlled: Story = {
  render: function Render(props) {
    const [value, setValue] = useState(2);

    return (
      <>
        <Rate {...props} value={value} onChange={setValue} />
        <output className="ms-3">{value}</output>
      </>
    );
  },
};
export const ControlledUnchanged: Story = { args: { value: 2 } };
export const InitialValue: Story = { args: { defaultValue: 3 } };
export const NoClear: Story = { args: { defaultValue: 3, allowClear: false } };
export const Disabled: Story = { args: { defaultValue: 3, disabled: true } };
export const ReadOnly: Story = { args: { value: 3, readOnly: true } };
export const TenItems: Story = { args: { count: 10, defaultValue: 7 } };
export const CustomIcon: Story = {
  args: {
    defaultValue: 3,
    icon: <Heart />,
    classNames: { filledItem: 'text-pink-600' },
  },
};
export const RTL: Story = {
  render: props => (
    <Config direction="rtl">
      <Rate {...props} defaultValue={2} />
    </Config>
  ),
};
export const Dark: Story = {
  render: props => (
    <Config theme={{ dark: 'dark' }}>
      <div className="bg-background rounded-lg p-4">
        <Rate {...props} defaultValue={3} />
      </div>
    </Config>
  ),
};
export const Localized: Story = {
  args: {
    'aria-label': '평점',
    defaultValue: 2,
    getItemLabel: (value, count) => `${count}점 중 ${value}점`,
    getValueText: (value, count) =>
      value === 0 ? '선택한 평점 없음' : `${count}점 중 ${value}점`,
  },
};
export const FormValue: Story = {
  render: function Render(props) {
    const [submitted, setSubmitted] = useState('');

    return (
      <form
        onChange={event =>
          setSubmitted(
            String(new FormData(event.currentTarget).get('rating') ?? ''),
          )
        }
      >
        <Rate {...props} name="rating" defaultValue={3} />
        <output className="ms-3">{submitted}</output>
      </form>
    );
  },
};
