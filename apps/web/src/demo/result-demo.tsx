import { Button, Result } from '@repo/ui';

export default function ResultDemo() {
  return (
    <Result
      status="success"
      title="Payment successful"
      subTitle="Order #2024-0815 has been confirmed."
      extra={<Button type="primary">Back home</Button>}
    />
  );
}
