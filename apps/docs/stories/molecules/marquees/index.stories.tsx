import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { Button, Marquees, Typography } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof Marquees> = {
  title: 'Data Display/Marquees',
  component: Marquees,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    speed: {
      control: { type: 'range', min: 10, max: 500, step: 10 },
    },
    pauseOnHover: {
      control: { type: 'boolean' },
    },
    items: {
      control: { type: 'object' },
    },
    autoFill: {
      control: { type: 'boolean' },
    },
    gap: {
      control: { type: 'range', min: 0, max: 100, step: 4 },
    },
  },
  // The rows below space their own children by `gap-2`; `gap` applies the same
  // 8px between the repeated copies so the seam is not tighter than the rest.
  args: {
    gap: 8,
  },
  render: props => {
    return (
      <div
        className={cn(
          'h-screen w-full',
          'flex items-center',
          //
        )}
      >
        <Marquees {...props} />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems = Array.from({ length: 2 }, (_, i) => ({
  key: i,
  children: (
    <div className="flex gap-2">
      {Array.from({ length: 2 }, (_, j) => (
        <div
          key={`${i}-${j}`}
          className={cn(
            'flex items-center',
            'rounded-full bg-gray-100 px-6 py-3',
            'text-gray-700',
          )}
        >
          <span className="text-lg font-semibold">
            아이템 {i}-{j}
          </span>
        </div>
      ))}
    </div>
  ),
}));

export const Default: Story = {
  args: {
    speed: 100,
    pauseOnHover: false,
    autoFill: false,
    items: defaultItems,
  },
};

export const RepeatCount: Story = {
  argTypes: {
    autoFill: {
      control: { type: 'number', min: 0 },
    },
  },
  args: {
    speed: 100,
    autoFill: 1,
    items: defaultItems,
  },
};

export const MultipleSpeed: Story = {
  args: {
    autoFill: false,
    items: defaultItems.map((item, i) => ({
      speed: 100 * (i + 1),
      ...item,
    })),
  },
};

export const MultipleHoverEvent: Story = {
  args: {
    autoFill: false,
    pauseOnHover: false,
    items: defaultItems.map((item, i) => ({
      pauseOnHover: i === 0,
      ...item,
    })),
  },
};

const interactiveItems = [
  {
    key: 'links',
    children: (
      <div className="flex gap-6 px-6 py-4">
        <Typography.Link href="#first">First link</Typography.Link>
        <Typography.Link href="#second">Second link</Typography.Link>
      </div>
    ),
  },
];

const expectTrackMotion = async (track: HTMLElement, isMoving: boolean) => {
  await waitFor(
    async () => {
      const before = getComputedStyle(track).transform;

      await new Promise(resolve => setTimeout(resolve, 200));

      const after = getComputedStyle(track).transform;
      const distance = Math.abs(
        new DOMMatrixReadOnly(after).m41 - new DOMMatrixReadOnly(before).m41,
      );

      if (isMoving) {
        await expect(distance).toBeGreaterThan(2);
      } else {
        await expect(distance).toBeLessThan(1);
      }
    },
    { timeout: 4000, interval: 250 },
  );
};

export const HoverAndFocus: Story = {
  args: { speed: 80, autoFill: false, items: interactiveItems },
  render: props => (
    <div className="space-y-4 p-8">
      <Marquees {...props} data-testid="interactive-marquee" />
      <Button>Outside focus target</Button>
    </div>
  ),
  play: async ({ canvas }) => {
    const marquee = canvas.getByTestId('interactive-marquee');
    const track = marquee.querySelector<HTMLElement>('.flex-nowrap');
    const first = canvas.getAllByRole('link', { name: 'First link' })[0]!;
    const second = canvas.getAllByRole('link', { name: 'Second link' })[0]!;
    const outside = canvas.getByRole('button', {
      name: 'Outside focus target',
    });

    await expect(track).not.toBeNull();
    await expectTrackMotion(track!, true);
    await userEvent.hover(first);
    first.focus();
    await expectTrackMotion(track!, false);
    await userEvent.unhover(first);
    await expect(first).toHaveFocus();
    await expectTrackMotion(track!, false);
    await userEvent.tab();
    await expect(second).toHaveFocus();
    await expectTrackMotion(track!, false);
    await userEvent.hover(second);
    outside.focus();
    await expectTrackMotion(track!, false);
    await userEvent.unhover(second);
    await expectTrackMotion(track!, true);
  },
};

export const RowHoverAndFocus: Story = {
  ...HoverAndFocus,
  args: {
    ...HoverAndFocus.args,
    pauseOnHover: false,
    items: interactiveItems.map(item => ({ ...item, pauseOnHover: true })),
  },
};

export const PauseDisabled: Story = {
  ...HoverAndFocus,
  args: { ...HoverAndFocus.args, pauseOnHover: false },
  play: async ({ canvas }) => {
    const marquee = canvas.getByTestId('interactive-marquee');
    const track = marquee.querySelector<HTMLElement>('.flex-nowrap');
    const first = canvas.getAllByRole('link', { name: 'First link' })[0]!;

    await expect(track).not.toBeNull();
    await userEvent.hover(first);
    first.focus();
    await expect(first).toHaveFocus();
    await expectTrackMotion(track!, true);
    await userEvent.unhover(first);
    await expectTrackMotion(track!, true);
  },
};
