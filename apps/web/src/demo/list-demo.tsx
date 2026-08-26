import { List } from '@repo/ui';

const people = [
  { id: 1, name: 'Ada Lovelace', role: 'Mathematician' },
  { id: 2, name: 'Alan Turing', role: 'Computer Scientist' },
  { id: 3, name: 'Grace Hopper', role: 'Rear Admiral' },
  { id: 4, name: 'Katherine Johnson', role: 'Aerospace Engineer' },
];

export default function ListDemo() {
  return (
    <List
      title="People"
      data={people}
      itemKey={item => item.id}
      renderItem={item => (
        <div
          className="flex items-center justify-between rounded-lg border
            border-gray-200 bg-white px-4 py-3 dark:border-gray-700
            dark:bg-gray-800"
        >
          <span className="font-medium">{item.name}</span>
          <span className="text-sm opacity-70">{item.role}</span>
        </div>
      )}
    />
  );
}
