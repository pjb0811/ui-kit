import { Button, Space, Toast } from '@repo/ui';

export default function ToastDemo() {
  return (
    <Space>
      <Button onClick={() => Toast.info('Heads up — something happened.')}>
        Info
      </Button>
      <Button onClick={() => Toast.success('Saved successfully.')}>
        Success
      </Button>
      <Button
        onClick={() =>
          Toast.warning('Careful', { description: 'This might need a review.' })
        }
      >
        Warning
      </Button>
      <Button
        onClick={() =>
          Toast.error('Something went wrong', {
            description: 'Please try again.',
          })
        }
      >
        Error
      </Button>
    </Space>
  );
}
