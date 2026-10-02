'use client';

import { Alert, Button } from '@repo/ui';

export default function AlertDemo() {
  return (
    <div className="space-y-3">
      <Alert
        status="info"
        title="Account information"
        description="Your profile is visible to members of your workspace."
      />
      <Alert
        status="success"
        variant="filled"
        title="Changes saved"
        description="Your settings are ready to use."
        closable
      />
      <Alert
        status="warning"
        title="Session expiring"
        action={<Button size="small">Extend session</Button>}
      />
      <Alert
        status="error"
        role="alert"
        title="Connection lost"
        description="Save your work locally before leaving this page."
      />
    </div>
  );
}
