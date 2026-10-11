import { useState } from 'react';

import { ContextMenu } from '@repo/ui';

export default function ContextMenuDemo() {
  const [action, setAction] = useState('none');
  return (
    <div>
      <ContextMenu
        actionLabel="Actions"
        triggerProps={{
          'aria-label': 'Document actions',
          className: 'rounded-md border p-6',
        }}
        items={[
          { key: 'open', label: 'Open' },
          { key: 'copy', label: 'Copy' },
          { key: 'line', type: 'separator' },
          { key: 'delete', label: 'Delete', disabled: true },
        ]}
        onSelect={key => setAction(String(key))}
      >
        Right click this document, press Shift+F10, or use Actions.
      </ContextMenu>
      <output aria-live="polite">Last action: {action}</output>
    </div>
  );
}
