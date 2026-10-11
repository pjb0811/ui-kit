import { useId, useState } from 'react';

import { Anchor, type AnchorItem } from '@repo/ui';

export default function AnchorDemo() {
  const id = useId();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const items: AnchorItem[] = [
    { key: 'intro', href: `#${id}-intro`, title: 'Introduction' },
    { key: 'details', href: `#${id}-details`, title: 'Details' },
    { key: 'next', href: `#${id}-next`, title: 'Next steps' },
  ];

  return (
    <div className="flex gap-4">
      <Anchor
        items={items}
        container={container}
        updateHash={false}
        className="shrink-0"
      />
      <div
        ref={setContainer}
        className="h-64 min-w-0 flex-1 overflow-auto rounded border p-4"
      >
        {items.map(item => (
          <section key={item.key} id={item.href.slice(1)} className="min-h-64">
            <h3>{item.title}</h3>
            <p>
              Scroll this panel or use the links to navigate between sections.
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
