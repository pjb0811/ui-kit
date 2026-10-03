import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Avatar, Badge, Button, Config } from '@repo/ui';

const meta: Meta<typeof Badge> = {
  title: 'Data Display/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'danger'],
    },
    classNames: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Count: Story = {
  args: {
    count: 5,
    indicatorLabel: '5 unread messages',
  },
  render: args => (
    <Badge {...args}>
      <Button variant="outlined">Inbox</Button>
    </Badge>
  ),
};

export const Overflow: Story = {
  args: { count: 120, maxCount: 99 },
  render: args => (
    <Badge {...args}>
      <Avatar alt="Ada Lovelace" fallback="AL" />
    </Badge>
  ),
};

export const Dot: Story = {
  args: { dot: true, color: 'success', indicatorLabel: 'Online' },
  render: args => (
    <Badge {...args}>
      <Avatar alt="Ada Lovelace" fallback="AL" />
    </Badge>
  ),
};

export const Zero: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Badge count={0}>
        <Button variant="outlined">Hidden zero</Button>
      </Badge>
      <Badge count={0} showZero>
        <Button variant="outlined">Shown zero</Button>
      </Badge>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {(['primary', 'success', 'warning', 'danger'] as const).map(color => (
        <Badge key={color} dot color={color} indicatorLabel={color}>
          <Avatar alt="Ada Lovelace" fallback="AL" />
        </Badge>
      ))}
    </div>
  ),
};

export const Standalone: Story = {
  args: { count: 12 },
};

export const Offset: Story = {
  args: { count: 3, offset: [8, 4] },
  render: args => (
    <Badge {...args}>
      <Avatar alt="Ada Lovelace" fallback="AL" />
    </Badge>
  ),
};

export const DarkTheme: Story = {
  render: () => (
    <Config theme={{ dark: 'dark' }}>
      <div className="bg-background rounded-lg p-6">
        <Badge count={7}>
          <Avatar alt="Ada Lovelace" fallback="AL" />
        </Badge>
      </div>
    </Config>
  ),
};
