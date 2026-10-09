import { Timeline } from '@repo/ui';

export default function TimelineDemo() {
  return (
    <Timeline
      aria-label="Delivery history"
      items={[
        {
          key: 'created',
          title: 'Order created',
          timestamp: {
            label: '8 October 2026, 09:00 UTC',
            dateTime: '2026-10-08T09:00:00Z',
          },
          description: 'Your order has been received.',
        },
        {
          key: 'packed',
          title: 'Order packed',
          timestamp: {
            label: '8 October 2026, 10:00 UTC',
            dateTime: '2026-10-08T10:00:00Z',
          },
          status: 'primary',
        },
        {
          key: 'delayed',
          title: 'Delivery delayed',
          description: 'Contact support for an update.',
          status: 'error',
        },
      ]}
    />
  );
}
