import { useState } from 'react';

import { AutoComplete } from '@repo/ui';

export default function AutoCompleteDemo() {
  const [value, setValue] = useState('');

  return (
    <div style={{ maxWidth: 360 }}>
      <AutoComplete
        aria-label="Project name"
        value={value}
        onChange={setValue}
        placeholder="Choose a suggestion or type your own name"
        options={[
          { value: 'website', label: 'Website' },
          { value: 'dashboard', label: 'Dashboard' },
          { value: 'archive', disabled: true },
        ]}
      />
      <p>Value: {value || 'Empty'}</p>
    </div>
  );
}
