import { Reveals } from '@repo/ui';

const cards = [
  { title: 'First', tone: 'bg-blue-500' },
  { title: 'Second', tone: 'bg-green-500' },
  { title: 'Third', tone: 'bg-purple-500' },
];

export default function RevealsDemo() {
  return (
    <Reveals effect="fadeInUp" cascade={0.15}>
      {cards.map(({ title, tone }) => (
        <div key={title} className={`w-40 rounded-lg p-6 text-white ${tone}`}>
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm opacity-90">Revealed on scroll.</p>
        </div>
      ))}
    </Reveals>
  );
}
