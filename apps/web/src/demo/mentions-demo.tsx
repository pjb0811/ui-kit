import { useState } from 'react';

import { Mentions } from '@repo/ui';

export default function MentionsDemo() {
  const [value, setValue] = useState('');

  return (
    <div style={{ maxWidth: 480 }}>
      <Mentions
        aria-label="Message"
        value={value}
        onChange={setValue}
        rows={4}
        placeholder="Type @ for people or # for topics"
        prefixes={['@', '#']}
        options={[
          { value: 'alice', label: 'Alice Park', prefix: '@' },
          { value: 'bob', label: 'Bob Kim', prefix: '@' },
          { value: 'release', label: 'Release', prefix: '#' },
          { value: 'design', label: 'Design', prefix: '#' },
        ]}
      />
      <p>Message: {value || 'Empty'}</p>
    </div>
  );
}
