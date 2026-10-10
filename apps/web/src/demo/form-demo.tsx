import { useState } from 'react';

import { Button, Form, Select } from '@repo/ui';

export default function FormDemo() {
  const [submitted, setSubmitted] = useState('');

  return (
    <Form
      className="max-w-lg"
      onSubmit={event => {
        event.preventDefault();
        setSubmitted(
          JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
        );
      }}
    >
      <Form.Field
        name="email"
        label="Email"
        description="Use your work email."
        required
      >
        <Form.Control type="email" placeholder="you@company.com" />
      </Form.Field>
      <Form.Field name="role" label="Role" required>
        <Select
          required
          placeholder="Choose a role"
          options={[
            { value: 'member', label: 'Member' },
            { value: 'admin', label: 'Administrator' },
          ]}
        />
      </Form.Field>
      <Button htmlType="submit">Submit</Button>
      <output aria-live="polite">{submitted}</output>
    </Form>
  );
}
