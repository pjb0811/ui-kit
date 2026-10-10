import { useRef, useState } from 'react';

import { Button, Tour } from '@repo/ui';

export default function TourDemo() {
  const target = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => setOpen(true)}>Start tour</Button>
      <Button ref={target}>Create document</Button>
      <Tour
        open={open}
        onOpenChange={setOpen}
        steps={[
          {
            key: 'create',
            title: 'Create a document',
            description: 'This button starts a new document.',
            target: () => target.current,
          },
          {
            key: 'done',
            title: 'You are ready',
            description: 'Finish the guide and try it yourself.',
          },
        ]}
      />
    </div>
  );
}
