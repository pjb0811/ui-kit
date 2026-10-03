import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Avatar, Config } from '@repo/ui';

const image =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"%3E%3Crect width="80" height="80" fill="%239bb7cd"/%3E%3Ccircle cx="40" cy="30" r="15" fill="%23f7d6bc"/%3E%3Cpath d="M8 80c2-23 14-34 32-34s30 11 32 34" fill="%233b5871"/%3E%3C/svg%3E';

const meta: Meta<typeof Avatar> = {
  title: 'Data Display/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['small', 'middle', 'large'] },
    loading: { control: 'select', options: ['eager', 'lazy'] },
    classNames: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Loaded: Story = {
  args: { src: image, alt: 'Ada Lovelace', fallback: 'AL' },
};

export const Loading: Story = {
  args: {
    src: 'https://example.invalid/avatar.png',
    alt: 'Ada Lovelace',
    fallback: 'AL',
  },
};

export const FailedImage: Story = {
  args: {
    src: 'data:image/png;base64,invalid',
    alt: 'Ada Lovelace',
    fallback: 'AL',
  },
};

export const Initials: Story = {
  args: { alt: 'Ada Lovelace', fallback: 'AL' },
};

export const Sizes: Story = {
  args: { alt: 'Ada Lovelace', fallback: 'AL' },
  render: args => (
    <div className="flex items-center gap-4">
      <Avatar {...args} size="small" />
      <Avatar {...args} size="middle" />
      <Avatar {...args} size="large" />
    </div>
  ),
};

export const DarkTheme: Story = {
  args: { alt: 'Ada Lovelace', fallback: 'AL' },
  render: args => (
    <Config theme={{ dark: 'dark' }}>
      <div className="bg-background rounded-lg p-6">
        <Avatar {...args} />
      </div>
    </Config>
  ),
};

export const Decorative: Story = {
  args: { src: image, alt: '' },
};
