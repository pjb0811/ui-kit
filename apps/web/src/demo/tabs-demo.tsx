import { Tabs, Typography } from '@repo/ui';

const ITEMS = [
  {
    key: 'overview',
    label: 'Overview',
    children: (
      <Typography.Paragraph className="m-0 pt-3">
        A summary of the project.
      </Typography.Paragraph>
    ),
  },
  {
    key: 'activity',
    label: 'Activity',
    children: (
      <Typography.Paragraph className="m-0 pt-3">
        Recent changes and comments.
      </Typography.Paragraph>
    ),
  },
  {
    key: 'settings',
    label: 'Settings',
    disabled: true,
    children: null,
  },
];

export default function TabsDemo() {
  return <Tabs items={ITEMS} listLabel="Project sections" />;
}
