import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Alert, Button, Config } from '@repo/ui';

const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <div className="w-[min(90vw,32rem)]">
        <Story />
      </div>
    ),
  ],
  args: {
    title: 'Changes saved',
    description: 'Your settings are ready to use.',
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
    variant: {
      control: 'select',
      options: ['outlined', 'filled'],
    },
    role: { control: 'select', options: ['status', 'alert'] },
    closable: { control: 'boolean' },
    icon: { control: false },
    action: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Statuses: Story = {
  render: args => (
    <div className="space-y-3">
      {(['info', 'success', 'warning', 'error'] as const).map(status => (
        <Alert key={status} {...args} status={status} title={status} />
      ))}
    </div>
  ),
};

export const Filled: Story = {
  render: args => (
    <div className="space-y-3">
      {(['info', 'success', 'warning', 'error'] as const).map(status => (
        <Alert
          key={status}
          {...args}
          status={status}
          variant="filled"
          title={status}
        />
      ))}
    </div>
  ),
};

export const Action: Story = {
  args: {
    status: 'warning',
    title: 'Your session will expire soon',
    action: <Button size="small">Extend session</Button>,
  },
};

export const Iconless: Story = {
  args: { icon: null, description: undefined },
};

export const Urgent: Story = {
  args: {
    status: 'error',
    role: 'alert',
    title: 'Connection lost',
    description: 'Save your work locally before leaving this page.',
  },
};

export const Dismissible: Story = {
  args: { closable: true, onClose: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
    await expect(args.onClose).toHaveBeenCalledOnce();
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument();
  },
};

export const KeyboardDismiss: Story = {
  args: { closable: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const close = canvas.getByRole('button', { name: 'Close' });

    close.focus();
    await userEvent.keyboard(' ');
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument();
  },
};

export const DarkRtl: Story = {
  render: args => (
    <Config direction="rtl" theme={{ dark: 'dark' }}>
      <Alert
        {...args}
        status="success"
        variant="filled"
        title="تم حفظ التغييرات"
        description="إعداداتك جاهزة للاستخدام."
        closable
      />
    </Config>
  ),
};
