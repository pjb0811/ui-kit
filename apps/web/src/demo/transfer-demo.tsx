import { useState } from 'react';

import { Transfer } from '@repo/ui';

export default function TransferDemo() {
  const [targetKeys, setTargetKeys] = useState<string[]>(['review']);

  return (
    <Transfer
      searchable
      targetKeys={targetKeys}
      onChange={setTargetKeys}
      titles={['Available permissions', 'Assigned permissions']}
      items={[
        { key: 'read', label: 'Read documents' },
        { key: 'write', label: 'Write documents' },
        { key: 'review', label: 'Review changes' },
        { key: 'admin', label: 'Administrator', disabled: true },
      ]}
    />
  );
}
