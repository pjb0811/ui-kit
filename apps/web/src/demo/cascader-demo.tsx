import { useState } from 'react';

import { Cascader } from '@repo/ui';

export default function CascaderDemo() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <Cascader
      aria-label="Region"
      value={value}
      onChange={setValue}
      options={[
        {
          value: 'europe',
          label: 'Europe',
          children: [
            {
              value: 'france',
              label: 'France',
              children: [
                { value: 'paris', label: 'Paris' },
                { value: 'lyon', label: 'Lyon' },
              ],
            },
          ],
        },
        {
          value: 'asia',
          label: 'Asia',
          children: [
            {
              value: 'korea',
              label: 'Korea',
              children: [{ value: 'seoul', label: 'Seoul' }],
            },
          ],
        },
      ]}
    />
  );
}
