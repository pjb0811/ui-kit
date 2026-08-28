import { useState } from 'react';

import { Button, Drawer } from '@repo/ui';

export default function DrawerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Open drawer
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Settings"
        direction="right"
        size="small"
        footer={
          <Button type="primary" onClick={() => setOpen(false)}>
            Done
          </Button>
        }
      >
        <p>Drawer content goes here.</p>
        <p className="mt-2 text-sm opacity-70">
          Slides in from the right. Click the mask or the close button to
          dismiss.
        </p>
      </Drawer>
    </>
  );
}
