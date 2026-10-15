// apps/docs/stories/molecules/Space/index.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Button, Config, Space } from '@repo/ui';

const meta: Meta<typeof Space> = {
  title: 'General/Space',
  component: Space,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'middle', 'large'],
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },
    wrap: {
      control: { type: 'boolean' },
    },
    align: {
      control: { type: 'select' },
      options: ['start', 'end', 'center', 'baseline', 'stretch'],
    },
    justify: {
      control: { type: 'select' },
      options: [
        undefined,
        'start',
        'end',
        'center',
        'space-between',
        'space-around',
        'space-evenly',
      ],
    },
    split: {
      control: { type: 'text' },
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
  render: props => {
    return (
      <div className="w-full max-w-2xl">
        <Space {...props}>
          <Button>첫 번째</Button>
          <Button variant="outlined">두 번째</Button>
          <Button variant="dashed">세 번째</Button>
          <Button variant="filled">네 번째</Button>
        </Space>
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'middle',
    orientation: 'horizontal',
    wrap: false,
    align: 'center',
    loading: false,
  },
};

const justifyValues = [
  ['start', 'flex-start'],
  ['end', 'flex-end'],
  ['center', 'center'],
  ['space-between', 'space-between'],
  ['space-around', 'space-around'],
  ['space-evenly', 'space-evenly'],
] as const;

export const Justify: Story = {
  render: () => (
    <div className="flex w-[32rem] flex-col gap-2">
      {justifyValues.map(([justify]) => (
        <Space
          key={justify}
          justify={justify}
          data-testid={justify}
          className="rounded border p-2"
        >
          <Button size="small">{justify}</Button>
          <Button size="small">Two</Button>
        </Space>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const [justify, value] of justifyValues) {
      await expect(
        getComputedStyle(canvas.getByTestId(justify)).justifyContent,
      ).toBe(value);
    }
  },
};

export const VerticalJustify: Story = {
  render: () => (
    <Space
      orientation="vertical"
      justify="space-between"
      data-testid="column"
      className="h-48 rounded border p-2"
    >
      <Button size="small">Top</Button>
      <Button size="small">Bottom</Button>
    </Space>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const column = canvas.getByTestId('column').getBoundingClientRect();
    const bottom = canvas
      .getByRole('button', { name: 'Bottom' })
      .getBoundingClientRect();

    await expect(column.bottom - bottom.bottom).toBeLessThanOrEqual(9);
  },
};

export const ToolbarEnds: Story = {
  render: () => (
    <Space
      justify="space-between"
      data-testid="toolbar"
      className="w-[32rem] rounded border p-2"
    >
      <Space size="small">
        <Button size="small">Bold</Button>
        <Button size="small">Italic</Button>
      </Space>
      <Button size="small" type="primary">
        Save
      </Button>
    </Space>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toolbar = canvas.getByTestId('toolbar').getBoundingClientRect();
    const save = canvas
      .getByRole('button', { name: 'Save' })
      .getBoundingClientRect();

    await expect(toolbar.right - save.right).toBeLessThanOrEqual(9);
  },
};

export const RTLJustifyStart: Story = {
  render: () => (
    <Config direction="rtl">
      <div dir="rtl">
        <Space
          justify="start"
          data-testid="row"
          className="w-[32rem] rounded border p-2"
        >
          <Button size="small">First</Button>
        </Space>
      </div>
    </Config>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const row = canvas.getByTestId('row').getBoundingClientRect();
    const first = canvas
      .getByRole('button', { name: 'First' })
      .getBoundingClientRect();

    await expect(row.right - first.right).toBeLessThanOrEqual(9);
  },
};

export const VerticalStretch: Story = {
  render: () => (
    <Space
      orientation="vertical"
      align="stretch"
      data-testid="stack"
      className="w-64 rounded border p-2"
    >
      <Button size="small">Short</Button>
      <Button size="small">A longer action</Button>
    </Space>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const short = canvas
      .getByRole('button', { name: 'Short' })
      .getBoundingClientRect();
    const long = canvas
      .getByRole('button', { name: 'A longer action' })
      .getBoundingClientRect();

    await expect(short.width).toBe(long.width);
  },
};

export const WrappedControls: Story = {
  args: { wrap: true, justify: 'center' },
  render: props => (
    <div className="w-72 rounded border p-2">
      <Space {...props}>
        {['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map(label => (
          <Button key={label} size="small">
            {label}
          </Button>
        ))}
      </Space>
    </div>
  ),
};

export const CallerOverride: Story = {
  render: () => (
    <Space justify="end" data-testid="override" className="justify-center">
      <Button size="small">Centered</Button>
    </Space>
  ),
  play: async ({ canvasElement }) => {
    const override = within(canvasElement).getByTestId('override');

    await expect(getComputedStyle(override).justifyContent).toBe('center');
    await expect(override).not.toHaveAttribute('justify');
  },
};
