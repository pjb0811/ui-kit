import { useState } from 'react';

import { Button, Popconfirm, Typography } from '@repo/ui';

export default function PopconfirmDemo() {
  const [result, setResult] = useState('No action yet');
  const [reject, setReject] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Popconfirm
        title="Delete this item?"
        description="This action cannot be undone."
        confirmText="Delete"
        confirmButtonProps={{ danger: true }}
        onConfirm={() => setResult('Deleted')}
        onCancel={() => setResult('Cancelled')}
      >
        <Button>Delete item</Button>
      </Popconfirm>
      <Popconfirm
        title="Save changes?"
        description="Confirmation takes one second."
        onConfirm={async () => {
          await new Promise(resolve => setTimeout(resolve, 1000));

          if (reject) {
            throw new Error('Example failure');
          }

          setResult('Saved');
        }}
        errorMessage="Save failed. Turn off failure mode and retry."
      >
        <Button>Async confirmation</Button>
      </Popconfirm>
      <Button onClick={() => setReject(value => !value)}>
        Failure mode: {reject ? 'on' : 'off'}
      </Button>
      <Popconfirm
        title="Controlled confirmation?"
        open={open}
        onOpenChange={setOpen}
      >
        <Button>Controlled</Button>
      </Popconfirm>
      <Popconfirm title="Unavailable" disabled>
        <Button>Disabled confirmation</Button>
      </Popconfirm>
      <Typography.Text aria-live="polite">{result}</Typography.Text>
    </div>
  );
}
