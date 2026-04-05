import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button, ConfigProvider, Switch } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof ConfigProvider> = {
  title: 'UI/ConfigProvider',
  component: ConfigProvider,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ThemeToken: Story = {
  render: () => (
    <div className={cn('flex flex-col gap-4')}>
      <div className={cn('flex items-center gap-2')}>
        <Button>Default Theme</Button>
        <Switch />
      </div>

      <ConfigProvider
        theme={{
          token: { colorPrimary: 'oklch(0.6 0.25 30)' },
        }}
      >
        <div className={cn('flex items-center gap-2')}>
          <Button>Red Primary</Button>
          <Switch />
        </div>
      </ConfigProvider>

      <ConfigProvider
        theme={{
          token: { colorPrimary: 'oklch(0.55 0.2 260)' },
        }}
      >
        <div className={cn('flex items-center gap-2')}>
          <Button>Blue Primary</Button>
          <Switch />
        </div>
      </ConfigProvider>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div className={cn('flex gap-4')}>
      <div className={cn('rounded-lg border p-4')}>
        <p className={cn('mb-2 text-sm')}>Light</p>
        <Button>Button</Button>
      </div>

      <ConfigProvider theme={{ dark: true }}>
        <div
          className={cn('bg-background text-foreground rounded-lg border p-4')}
        >
          <p className={cn('mb-2 text-sm')}>Dark</p>
          <Button>Button</Button>
        </div>
      </ConfigProvider>
    </div>
  ),
};

export const Nested: Story = {
  render: () => (
    <ConfigProvider theme={{ token: { colorPrimary: 'oklch(0.55 0.2 260)' } }}>
      <div className={cn('flex flex-col gap-4')}>
        <div className={cn('flex items-center gap-2')}>
          <Button>Blue (Parent)</Button>
          <Switch />
        </div>

        <ConfigProvider
          theme={{ token: { colorPrimary: 'oklch(0.6 0.2 150)' } }}
        >
          <div className={cn('flex items-center gap-2')}>
            <Button>Green (Child)</Button>
            <Switch />
          </div>
        </ConfigProvider>
      </div>
    </ConfigProvider>
  ),
};
