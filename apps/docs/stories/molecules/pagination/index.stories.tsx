import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

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
