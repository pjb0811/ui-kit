import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

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
