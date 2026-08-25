import { Collapse } from '@repo/ui';

const items = [
  {
    key: '0',
    label: 'What is this?',
    children: (
      <div className="p-4 text-sm">An answer to the first question.</div>
    ),
  },
  {
    key: '1',
    label: 'How does it work?',
    children: (
      <div className="p-4 text-sm">An answer to the second question.</div>
    ),
  },
  {
    key: '2',
    label: 'Anything else?',
    children: (
      <div className="p-4 text-sm">An answer to the third question.</div>
    ),
  },
];

export default function CollapseDemo() {
  return (
    <Collapse
      defaultActiveKey={['0']}
      className="border-border w-100 rounded-md border p-4"
      items={items}
    />
  );
}
