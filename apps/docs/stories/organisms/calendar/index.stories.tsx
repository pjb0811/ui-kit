import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Calendar, Config } from '@repo/ui';

const meta: Meta<typeof Calendar> = {
  title: 'UI/Calendar',
  component: Calendar,
  args: { defaultMonth: new Date(2026, 9, 1) },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Day buttons are named like "Thursday, October 15th, 2026".
const dayButton = (canvasElement: HTMLElement, name: RegExp) =>
  within(canvasElement).getByRole('button', { name });

// The dates a mocked callback received, as "YYYY-M-D" strings.
const datesOf = (callback: unknown) =>
  (callback as ReturnType<typeof fn>).mock.calls.map(([date]) => {
    const value = date as Date;

    return `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`;
  });

export const Default: Story = {};
export const Selected: Story = {
  args: { defaultValue: new Date(2026, 9, 11) },
};

export const SelectionAndNavigation: Story = {
  args: { onChange: fn(), onMonthChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(dayButton(canvasElement, /October 15th, 2026/));
    await expect(datesOf(args.onChange)).toEqual(['2026-10-15']);
    await expect(args.onMonthChange).not.toHaveBeenCalled();
    await expect(canvas.getByText('October 2026')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: /next month/i }));
    await expect(args.onMonthChange).toHaveBeenCalledTimes(1);
    await expect(args.onChange).toHaveBeenCalledTimes(1);
    await expect(canvas.getByText('November 2026')).toBeVisible();
  },
};

export const KeyboardSelection: Story = {
  args: { defaultValue: new Date(2026, 9, 15), onChange: fn() },
  play: async ({ args, canvasElement }) => {
    dayButton(canvasElement, /October 15th, 2026/).focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(dayButton(canvasElement, /October 16th, 2026/)).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(datesOf(args.onChange)).toEqual(['2026-10-23']);
  },
};

export const Bounds: Story = {
  args: {
    minDate: new Date(2026, 9, 5),
    maxDate: new Date(2026, 9, 20),
    onChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const beforeMin = dayButton(canvasElement, /October 4th, 2026/);
    const afterMax = dayButton(canvasElement, /October 21st, 2026/);

    await expect(beforeMin).toBeDisabled();
    await expect(afterMax).toBeDisabled();
    await expect(dayButton(canvasElement, /October 5th, 2026/)).toBeEnabled();
    await expect(dayButton(canvasElement, /October 20th, 2026/)).toBeEnabled();

    await userEvent.click(beforeMin, { pointerEventsCheck: 0 });
    await userEvent.click(afterMax, { pointerEventsCheck: 0 });
    await expect(args.onChange).not.toHaveBeenCalled();

    // Arrow keys skip disabled days, so Enter never selects outside the bounds.
    dayButton(canvasElement, /October 5th, 2026/).focus();
    await userEvent.keyboard('{ArrowLeft}{Enter}');
    dayButton(canvasElement, /October 20th, 2026/).focus();
    await userEvent.keyboard('{ArrowRight}{Enter}');

    for (const date of datesOf(args.onChange)) {
      const [, , day] = date.split('-').map(Number);

      await expect(date.startsWith('2026-10-')).toBe(true);
      await expect(day).toBeGreaterThanOrEqual(5);
      await expect(day).toBeLessThanOrEqual(20);
    }
  },
};

export const DisabledDates: Story = {
  args: {
    disabledDate: date => date.getDay() === 0 || date.getDay() === 6,
    onChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const saturday = dayButton(canvasElement, /Saturday, October 10th, 2026/);

    await expect(saturday).toBeDisabled();
    await userEvent.click(saturday, { pointerEventsCheck: 0 });
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(
      dayButton(canvasElement, /Friday, October 9th, 2026/),
    ).toBeEnabled();
  },
};

export const LeapYear: Story = {
  args: { defaultMonth: new Date(2028, 1, 1) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(dayButton(canvasElement, /February 29th, 2028/)).toBeVisible();
    for (let step = 0; step < 12; step += 1) {
      await userEvent.click(
        canvas.getByRole('button', { name: /next month/i }),
      );
    }
    await expect(canvas.getByText('February 2029')).toBeVisible();
    await expect(
      canvas.queryByRole('button', { name: /February 29th/ }),
    ).not.toBeInTheDocument();
    await expect(dayButton(canvasElement, /February 28th, 2029/)).toBeVisible();
  },
};

export const YearTransition: Story = {
  args: { defaultMonth: new Date(2026, 11, 1), onMonthChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: /next month/i }));
    await expect(canvas.getByText('January 2027')).toBeVisible();
    await expect(dayButton(canvasElement, /January 31st, 2027/)).toBeVisible();

    await expect(datesOf(args.onMonthChange)).toEqual(['2027-1-1']);

    await userEvent.click(
      canvas.getByRole('button', { name: /previous month/i }),
    );
    await expect(canvas.getByText('December 2026')).toBeVisible();
  },
};

export const Today: Story = {
  args: { today: new Date(2026, 9, 20) },
  play: async ({ canvasElement }) => {
    const today = dayButton(
      canvasElement,
      /^Today, Tuesday, October 20th, 2026$/,
    );

    await expect(today.closest('td')).toHaveAttribute('data-today', 'true');
    await expect(today).toHaveAttribute('tabindex', '0');
    await expect(
      canvasElement.querySelectorAll('[data-today="true"]'),
    ).toHaveLength(1);
  },
};

export const Markers: Story = {
  args: {
    expanded: true,
    renderDate: date => (date.getDate() === 11 ? 'Meeting' : null),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The marker is aria-hidden, so the date stays the button's whole name.
    const marked = canvas.getByRole('button', {
      name: /^Sunday, October 11th, 2026$/,
    });

    await expect(marked).toHaveTextContent('Meeting');
    await expect(
      marked.querySelectorAll('a, button, input, select, textarea, [tabindex]'),
    ).toHaveLength(0);
    await expect(
      canvas.getByRole('button', { name: /October 12th, 2026/ }),
    ).not.toHaveTextContent('Meeting');
  },
};

export const RTL: Story = {
  args: {
    defaultValue: new Date(2026, 9, 11),
    expanded: true,
    renderDate: date => (date.getDate() === 11 ? 'Meeting' : null),
  },
  render: props => (
    <Config direction="rtl">
      <Calendar {...props} />
    </Config>
  ),
};
// Calendar paints its own surface, so its dates must stay readable under a
// dark Config even when the page sets no text color.
export const Dark: Story = {
  args: {
    defaultValue: new Date(2026, 9, 11),
    disabledDate: date => date.getDay() === 0,
  },
  render: props => (
    <Config theme={{ dark: 'dark' }}>
      <Calendar {...props} />
    </Config>
  ),
  play: async ({ canvasElement }) => {
    const calendar = canvasElement.querySelector<HTMLElement>(
      '[data-slot="calendar"]',
    )!;
    const probe = canvasElement.ownerDocument.createElement('span');

    probe.className = 'text-foreground';
    calendar.append(probe);

    const foreground = getComputedStyle(probe).color;

    probe.remove();

    await expect(
      getComputedStyle(dayButton(canvasElement, /October 12th, 2026/)).color,
    ).toBe(foreground);
  },
};
