import { useState } from 'react';

import { Button, Modal, Space } from '@repo/ui';

export default function ModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Space>
      <Button variant="solid" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Button
        onClick={() =>
          Modal.confirm({
            title: 'Delete this item?',
            content: 'This action cannot be undone.',
            onOk: () => Modal.info({ title: 'Deleted.' }),
          })
        }
      >
        Confirm (imperative)
      </Button>
      <Modal
        open={open}
        title="Title"
        content="A controlled modal driven by open / onOk / onCancel."
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </Space>
  );
}
