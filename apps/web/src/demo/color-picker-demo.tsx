import { useState } from 'react';

import { ColorPicker, Space } from '@repo/ui';

export default function ColorPickerDemo() {
  const [color, setColor] = useState('#1677ff');

  return (
    <Space align="center" size="middle">
      <ColorPicker value={color} onChange={setColor} showText />
    </Space>
  );
}
