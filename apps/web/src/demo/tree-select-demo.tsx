import { useState } from 'react';

import { TreeSelect } from '@repo/ui';

export default function TreeSelectDemo() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className="flex max-w-lg flex-col gap-3">
      <TreeSelect
        aria-label="Folder"
        value={value}
        onChange={setValue}
        defaultExpandedKeys={['project']}
        nodes={[
          {
            key: 'project',
            label: 'Project',
            children: [
              { key: 'src', label: 'Source' },
              { key: 'docs', label: 'Docs' },
            ],
          },
          { key: 'archive', label: 'Archive' },
        ]}
      />
      <output>{value ?? 'No selection'}</output>
    </div>
  );
}
