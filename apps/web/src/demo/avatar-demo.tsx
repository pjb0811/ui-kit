import { Avatar, Space } from '@repo/ui';

const image =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"%3E%3Crect width="80" height="80" fill="%239bb7cd"/%3E%3Ccircle cx="40" cy="30" r="15" fill="%23f7d6bc"/%3E%3Cpath d="M8 80c2-23 14-34 32-34s30 11 32 34" fill="%233b5871"/%3E%3C/svg%3E';

export default function AvatarDemo() {
  return (
    <Space align="center">
      <Avatar src={image} alt="Ada Lovelace" fallback="AL" size="large" />
      <Avatar alt="Grace Hopper" fallback="GH" />
      <Avatar alt="Linus Torvalds" size="small" />
    </Space>
  );
}
