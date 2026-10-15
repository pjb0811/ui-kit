'use client';

import { useState } from 'react';

import { Bold, Italic, Underline } from 'lucide-react';

import { ToggleGroup } from '@repo/ui';

export default function ToggleGroupDemo() {
  const [formats, setFormats] = useState<string[]>(['bold']);
  const [filters, setFilters] = useState<string[]>([]);

  return (
    <div className="my-6 flex flex-col items-start gap-4">
      <ToggleGroup
        aria-label="Text formatting"
        options={[
          { value: 'bold', label: 'Bold', icon: <Bold />, iconOnly: true },
          {
            value: 'italic',
            label: 'Italic',
            icon: <Italic />,
            iconOnly: true,
          },
          {
            value: 'underline',
            label: 'Underline',
            icon: <Underline />,
            iconOnly: true,
          },
        ]}
        value={formats}
        onChange={setFormats}
      />
      <ToggleGroup
        aria-label="Filters"
        options={[
          { value: 'open', label: 'Open' },
          { value: 'mine', label: 'Assigned to me' },
          { value: 'archived', label: 'Archived', disabled: true },
        ]}
        value={filters}
        onChange={setFilters}
      />
      <span>
        Formats: {formats.join(', ') || 'none'} · Filters:{' '}
        {filters.join(', ') || 'none'}
      </span>
    </div>
  );
}
