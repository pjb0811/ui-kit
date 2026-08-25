import { Marquees } from '@repo/ui';

const row = (
  <div className="flex gap-3">
    {['React', 'TypeScript', 'Vite', 'Tailwind', 'Docusaurus'].map(label => (
      <span
        key={label}
        className="bg-accent text-accent-foreground rounded-full px-5 py-2
          text-sm font-medium"
      >
        {label}
      </span>
    ))}
  </div>
);

const items = [{ key: 0, children: row }];

export default function MarqueesDemo() {
  return <Marquees speed={40} items={items} />;
}
