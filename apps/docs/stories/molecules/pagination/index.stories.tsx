import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { Button, Config, Pagination } from '@repo/ui';

const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  args: {
    total: 200,
    pageSize: 10,
    defaultPage: 10,
  },
  argTypes: {
    total: { control: 'number' },
    pageSize: { control: 'number' },
    defaultPageSize: { control: 'number' },
    pageSizeOptions: { control: 'object' },
    showSizeChanger: { control: 'boolean' },
    showQuickJumper: { control: 'boolean' },
    defaultPage: { control: 'number' },
    siblingCount: { control: 'number' },
    boundaryCount: { control: 'number' },
    showFirstLast: { control: 'boolean' },
    hideOnSinglePage: { control: 'boolean' },
    size: { control: 'select', options: ['small', 'middle', 'large'] },
    disabled: { control: 'boolean' },
    onChange: { action: 'pageChanged' },
    onPageSizeChange: { action: 'pageSizeChanged' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ShortRange: Story = {
  args: { total: 40, defaultPage: 1 },
};

export const LongRange: Story = {
  args: { total: 500, defaultPage: 25 },
};

export const Controlled: Story = {
  render: function Render(args) {
    const [page, setPage] = useState(10);

    return (
      <div className="space-y-3">
        <p>Current page: {page}</p>
        <Pagination {...args} page={page} onChange={setPage} />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Empty: Story = {
  args: { total: 0, defaultPage: 1 },
};

export const FirstAndLast: Story = {
  args: { showFirstLast: true },
};

export const HideOnSinglePage: Story = {
  args: { total: 10, hideOnSinglePage: true },
  render: args => (
    <div>
      <p>The pager is hidden for a single page.</p>
      <Pagination {...args} />
    </div>
  ),
};

export const Links: Story = {
  args: { showFirstLast: true },
  render: args => (
    <Pagination {...args} getPageHref={page => `#page-${page}`} />
  ),
};

export const ChangingTotal: Story = {
  render: function Render(args) {
    const [total, setTotal] = useState(200);

    return (
      <div className="space-y-3">
        <Button onClick={() => setTotal(value => (value === 200 ? 30 : 200))}>
          Toggle total
        </Button>
        <Pagination {...args} total={total} />
      </div>
    );
  },
};

export const FullControls: Story = {
  args: {
    pageSize: undefined,
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50],
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, [start, end]) => `${start}–${end} of ${total} items`,
  },
};

export const ControlledPageSize: Story = {
  render: function Render(args) {
    const [page, setPage] = useState(10);
    const [pageSize, setPageSize] = useState(10);

    return (
      <div className="space-y-3">
        <p>
          Page {page}, {pageSize} items per page
        </p>
        <Pagination
          {...args}
          page={page}
          onChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          showSizeChanger
          showQuickJumper
        />
      </div>
    );
  },
};

export const EmptyWithControls: Story = {
  args: {
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, [start, end]) => `${start}–${end} of ${total} items`,
  },
};

export const Rtl: Story = {
  render: args => (
    <Config direction="rtl">
      <Pagination
        {...args}
        showFirstLast
        labels={{
          navigation: 'الصفحات',
          page: page => `صفحة ${page}`,
          previous: 'الصفحة السابقة',
          next: 'الصفحة التالية',
          first: 'الصفحة الأولى',
          last: 'الصفحة الأخيرة',
        }}
      />
    </Config>
  ),
};

export const RefetchKeepsPage: Story = {
  name: 'Empty total while refetching keeps the page',
  args: { onChange: fn() },
  render: function Render({ onChange }) {
    const [total, setTotal] = useState(50);

    return (
      <div className="flex flex-col items-start gap-2">
        <Button
          onClick={() => {
            setTotal(0);
            setTimeout(() => setTotal(50), 100);
          }}
        >
          Refetch
        </Button>
        <span>total: {total}</span>
        <Pagination total={total} onChange={onChange} />
      </div>
    );
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Page 5' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Refetch' }));
    await canvas.findByText('total: 0');
    await canvas.findByText('total: 50');
    await expect(
      canvas.getByRole('button', { name: 'Page 5' }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
};

export const ShrinkClampsPage: Story = {
  name: 'Shrinking total clamps the page',
  render: function Render() {
    const [total, setTotal] = useState(50);

    return (
      <div className="flex flex-col items-start gap-2">
        <Button onClick={() => setTotal(20)}>Shrink</Button>
        <Button onClick={() => setTotal(50)}>Grow</Button>
        <Pagination total={total} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const current = () =>
      canvasElement.querySelector('[aria-current="page"]')?.textContent;

    await userEvent.click(canvas.getByRole('button', { name: 'Page 5' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Shrink' }));
    await waitFor(() => expect(current()).toBe('2'));
    // A real shrink is kept: growing again stays on the clamped page.
    await userEvent.click(canvas.getByRole('button', { name: 'Grow' }));
    await waitFor(() => expect(current()).toBe('2'));
  },
};
