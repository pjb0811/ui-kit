import { Table, type TableColumn } from '@repo/ui';

const people = [
  { id: 1, name: 'Ada Lovelace', role: 'Mathematician' },
  { id: 2, name: 'Alan Turing', role: 'Computer scientist' },
  { id: 3, name: 'Grace Hopper', role: 'Computer scientist' },
  { id: 4, name: 'Katherine Johnson', role: 'Mathematician' },
];

const columns: TableColumn<(typeof people)[number]>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name' },
  { key: 'role', title: 'Role', dataIndex: 'role' },
];

export default function TableDemo() {
  return (
    <Table
      caption="People"
      columns={columns}
      data={people}
      rowKey={person => person.id}
      pagination={{ defaultPageSize: 2 }}
      bordered
    />
  );
}
