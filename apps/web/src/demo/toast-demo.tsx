import { Button, Space, Toast } from '@repo/ui';

export default function ToastDemo() {
  return (
    <Space wrap>
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
      <Button
        onClick={() => {
          Toast.loading('Saving…', { id: 'demo-save' });
          setTimeout(() => {
            Toast.success('Saved', { id: 'demo-save' });
          }, 1500);
        }}
      >
        Loading → success
      </Button>
      <Button
        onClick={() =>
          Toast.info('Shown at the top center.', { placement: 'top' })
        }
      >
        Top
      </Button>
    </Space>
  );
}
