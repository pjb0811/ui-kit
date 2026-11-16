import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Table, type TableColumn, Tag } from '@repo/ui';

interface Person {
  id: number;
  name: string;
  role: string;
  status: 'Active' | 'Away';
}

const people: Person[] = [
  { id: 1, name: 'Ada Lovelace', role: 'Mathematician', status: 'Active' },
  { id: 2, name: 'Alan Turing', role: 'Computer scientist', status: 'Away' },
  { id: 3, name: 'Grace Hopper', role: 'Computer scientist', status: 'Active' },
  { id: 4, name: 'Katherine Johnson', role: 'Mathematician', status: 'Active' },
  {
    id: 5,
    name: 'Margaret Hamilton',
    role: 'Software engineer',
    status: 'Away',
  },
];

const columns: TableColumn<Person>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name' },
  { key: 'role', title: 'Role', dataIndex: 'role' },
  {
    key: 'status',
    title: 'Status',
    render: person => (
      <Tag color={person.status === 'Active' ? 'green' : 'default'}>
        {person.status}
      </Tag>
    ),
  },
];

const meta: Meta<typeof Table<Person>> = {
  title: 'Data Display/Table',
  component: Table,
  parameters: { layout: 'padded' },
  args: {
    columns,
    data: people,
    rowKey: person => person.id,
    caption: 'People',
  },
  argTypes: {
    size: { control: 'select', options: ['small', 'middle', 'large'] },
    bordered: { control: 'boolean' },
    striped: { control: 'boolean' },
    hoverable: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BorderedAndStriped: Story = {
  args: { bordered: true, striped: true, size: 'small' },
};

export const Loading: Story = {
  args: { loading: true },
};

export const Empty: Story = {
  args: { data: [], empty: 'No people found.' },
};

export const Paginated: Story = {
  args: { pagination: { defaultPageSize: 2, showSizeChanger: true } },
};

export const ControlledPagination: Story = {
  render: function Render(args) {
    const [page, setPage] = useState(1);

    return (
      <div className="space-y-4">
        <p>Page {page}</p>
        <Table
          {...args}
          pagination={{ page, pageSize: 2, onChange: setPage }}
        />
      </div>
    );
  },
};

export const ServerPagination: Story = {
  args: {
    data: people.slice(0, 2),
    pagination: { mode: 'server', total: people.length, pageSize: 2 },
  },
};

const refetchRows = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `row ${index + 1}`,
}));
const refetchColumns: TableColumn<(typeof refetchRows)[number]>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name' },
];

export const ClientRefetchKeepsPage: Story = {
  name: 'Client mode: empty data while refetching keeps the page',
  render: function Render() {
    const [data, setData] = useState(refetchRows);

    return (
      <div className="flex flex-col items-start gap-2">
        <button
          type="button"
          onClick={() => {
            setData([]);
            setTimeout(() => setData(refetchRows), 100);
          }}
        >
          Refetch
        </button>
        <span>rows: {data.length}</span>
        <Table
          columns={refetchColumns}
          data={data}
          rowKey={row => row.id}
          pagination
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Page 5' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Refetch' }));
    await canvas.findByText('rows: 0');
    await canvas.findByText('rows: 50');
    await expect(
      canvas.getByRole('button', { name: 'Page 5' }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByText('row 41')).toBeInTheDocument();
  },
};

export const ServerRefetchKeepsPage: Story = {
  name: 'Server mode: missing total while refetching keeps the page',
  render: function Render() {
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState<number | undefined>(50);

    return (
      <div className="flex flex-col items-start gap-2">
        <button
          type="button"
          onClick={() => {
            setTotal(undefined);
            setTimeout(() => setTotal(50), 100);
          }}
        >
          Refetch
        </button>
        <span>total: {total ?? 'loading'}</span>
        <span>consumer page: {page}</span>
        <Table
          columns={refetchColumns}
          data={refetchRows.slice((page - 1) * 10, page * 10)}
          rowKey={row => row.id}
          pagination={{
            mode: 'server',
            total: total as number,
            onChange: setPage,
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Page 5' }));
    await canvas.findByText('consumer page: 5');
    await userEvent.click(canvas.getByRole('button', { name: 'Refetch' }));
    await canvas.findByText('total: loading');
    await canvas.findByText('total: 50');
    await expect(
      canvas.getByRole('button', { name: 'Page 5' }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByText('consumer page: 5')).toBeInTheDocument();
  },
};
