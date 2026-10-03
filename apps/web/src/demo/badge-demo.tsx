import { Avatar, Badge, Button, Space } from '@repo/ui';

export default function BadgeDemo() {
  return (
    <Space align="center" size="large">
      <Badge count={5} indicatorLabel="5 unread messages">
        <Button variant="outlined">Inbox</Button>
      </Badge>
      <Badge dot color="success" indicatorLabel="Online">
        <Avatar alt="Ada Lovelace" fallback="AL" />
      </Badge>
      <Badge count={120} maxCount={99}>
        <Avatar alt="Grace Hopper" fallback="GH" />
      </Badge>
    </Space>
  );
}
