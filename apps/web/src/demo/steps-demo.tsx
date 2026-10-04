'use client';

import { useState } from 'react';

import { Button, Steps } from '@repo/ui';

const items = [
  { title: 'Account', description: 'Create your account' },
  { title: 'Profile', description: 'Add your details' },
  { title: 'Review', description: 'Confirm and submit' },
];

export default function StepsDemo() {
  const [current, setCurrent] = useState(1);

  return (
    <div className="my-6 space-y-5">
      <Steps items={items} current={current} />
      <div className="flex gap-2">
        <Button
          variant="outlined"
          disabled={current === 0}
          onClick={() => setCurrent(index => index - 1)}
        >
          Previous
        </Button>
        <Button
          disabled={current === items.length - 1}
          onClick={() => setCurrent(index => index + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
