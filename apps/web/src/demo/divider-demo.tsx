import { Divider, Space, Typography } from '@repo/ui';

export default function DividerDemo() {
  return (
    <div>
      <Typography.Paragraph>
        Separate related sections with a label.
      </Typography.Paragraph>
      <Divider titlePlacement="start">Account details</Divider>
      <Typography.Paragraph>
        Use a dashed or dotted line for visual grouping.
      </Typography.Paragraph>
      <Divider variant="dashed" />
      <Space className="h-10" split={<Divider orientation="vertical" />}>
        <Typography.Text>Profile</Typography.Text>
        <Typography.Text>Settings</Typography.Text>
      </Space>
    </div>
  );
}
