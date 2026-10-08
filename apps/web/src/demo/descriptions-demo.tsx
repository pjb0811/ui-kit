import { Descriptions } from '@repo/ui';

export default function DescriptionsDemo() {
  return (
    <Descriptions
      title="Account details"
      items={[
        { key: 'name', label: 'Name', value: 'Ada Lovelace' },
        { key: 'team', label: 'Team', value: 'Platform' },
        { key: 'tasks', label: 'Open tasks', value: 0 },
        { key: 'notes', label: 'Notes', value: null },
        {
          key: 'website',
          label: 'Website',
          value: <a href="https://example.com">View profile</a>,
        },
        {
          key: 'description',
          label: 'Description',
          value:
            'A record summary that wraps while preserving the label and value reading order.',
        },
      ]}
    />
  );
}
