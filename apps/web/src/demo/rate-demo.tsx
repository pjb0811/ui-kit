import { useState } from 'react';

import { Rate } from '@repo/ui';

export default function RateDemo() {
  const [value, setValue] = useState(3);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Rate aria-label="Your rating" value={value} onChange={setValue} />
      <span>{value} / 5</span>
    </div>
  );
}
