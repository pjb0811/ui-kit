'use client';

import { useState } from 'react';

import { Segmented } from '@repo/ui';

export default function SegmentedDemo() {
  const [view, setView] = useState('Grid');

  return (
    <div className="my-6 flex items-center gap-3">
      <Segmented
        aria-label="View"
        options={['Grid', 'List', 'Compact']}
        value={view}
        onChange={setView}
      />
      <span>{view} view</span>
    </div>
  );
}
