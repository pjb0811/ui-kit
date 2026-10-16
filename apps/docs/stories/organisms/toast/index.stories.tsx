import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { Button, Config, Toast } from '@repo/ui';

const placements = [
  'top-start',
  'top',
  'top-end',
  'bottom-start',
  'bottom',
  'bottom-end',
] as const;

const stack = (placement: string) =>
  document.querySelector<HTMLElement>(
    `[data-slot="toast-stack"][data-placement="${placement}"]`,
  );

const toasts = () => [...document.querySelectorAll('[data-slot="toast"]')];

const reset = () => {
  Toast.destroyAll();
  Toast.config({
    placement: undefined,
    maxCount: undefined,
    duration: undefined,
  });
};

const meta: Meta<typeof Toast> = {
  title: 'Feedback/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['info', 'success', 'error', 'warning', 'loading'],
    },
    closable: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: 'info',
    title: '알림',
    description: '이것은 토스트 알림입니다.',
    closable: true,
  },
};

export const StaticToast: Story = {
  render: () => {
    const showInfo = () => {
      Toast.info('정보', { description: '이것은 정보 토스트입니다.' });
    };

    const showSuccess = () => {
      Toast.success('성공', {
        description: '작업이 성공적으로 완료되었습니다.',
      });
    };

    const showError = () => {
      Toast.error('오류', { description: '오류가 발생했습니다.' });
    };

    const showWarning = () => {
      Toast.warning('경고', { description: '주의가 필요한 작업입니다.' });
    };

    return (
      <div className="flex flex-wrap gap-2">
        <Button onClick={showInfo} variant="outlined">
          Info
        </Button>
        <Button onClick={showSuccess} variant="outlined">
          Success
        </Button>
        <Button onClick={showError} variant="outlined">
          Error
        </Button>
        <Button onClick={showWarning} variant="outlined">
          Warning
        </Button>
      </div>
    );
  },
};

export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-2">
      {placements.map(placement => (
        <Button
          key={placement}
          variant="outlined"
          onClick={() => Toast.info(placement, { placement, duration: 0 })}
        >
          {placement}
        </Button>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    reset();

    for (const placement of placements) {
      await userEvent.click(canvas.getByRole('button', { name: placement }));
    }

    await waitFor(() => expect(toasts()).toHaveLength(6));

    const width = window.innerWidth;
    const height = window.innerHeight;
    const box = (placement: string) =>
      stack(placement)!
        .querySelector('[data-slot="toast"]')!
        .getBoundingClientRect();

    await expect(box('top-start').left).toBeLessThan(width / 2);
    await expect(box('top-start').top).toBeLessThan(height / 2);
    await expect(box('top-end').right).toBeGreaterThan(width / 2);
    await expect(box('bottom-start').bottom).toBeGreaterThan(height / 2);
    await expect(box('bottom-end').right).toBeGreaterThan(width / 2);
    await expect(
      Math.abs(box('top').left + box('top').width / 2 - width / 2),
    ).toBeLessThan(2);
    await expect(
      Math.abs(box('bottom').left + box('bottom').width / 2 - width / 2),
    ).toBeLessThan(2);
    reset();
  },
};

export const UpdateById: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button onClick={() => Toast.loading('Saving…', { id: 'save' })}>
        Save
      </Button>
      <Button
        onClick={() =>
          Toast.success('Saved', {
            id: 'save',
            description: 'All changes are stored.',
            duration: 600,
          })
        }
      >
        Finish
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);

    reset();
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(await page.findByText('Saving…')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Finish' }));
    await waitFor(() => expect(page.getByText('Saved')).toBeVisible());
    await expect(page.queryByText('Saving…')).not.toBeInTheDocument();
    await expect(toasts()).toHaveLength(1);
    await waitFor(() => expect(toasts()).toHaveLength(0), { timeout: 3000 });
    reset();
  },
};

export const QueueWithMaxCount: Story = {
  args: { onClose: fn() },
  render: args => (
    <Button
      onClick={() => {
        Toast.config({ maxCount: 2 });

        for (const title of ['First', 'Second', 'Third']) {
          Toast.info(title, {
            duration: 0,
            action: <Button size="small">Undo {title}</Button>,
            onClose: () => args.onClose?.(),
          });
        }
      }}
    >
      Show three
    </Button>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);

    reset();
    await userEvent.click(canvas.getByRole('button', { name: 'Show three' }));
    await waitFor(() => expect(toasts()).toHaveLength(2));
    await expect(page.queryByText('Third')).not.toBeInTheDocument();

    const first = page.getByText('First').closest('[data-slot="toast"]')!;

    await userEvent.click(
      within(first as HTMLElement).getByRole('button', { name: '닫기' }),
    );
    await expect(args.onClose).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(page.getByText('Third')).toBeVisible());
    await waitFor(() => expect(toasts()).toHaveLength(2));
    await expect(
      page.getByRole('button', { name: 'Undo Third' }),
    ).toBeInTheDocument();
    reset();
  },
};

export const CloseOnce: Story = {
  args: { onClose: fn() },
  render: args => (
    <Button
      onClick={() =>
        Toast.info('Close me', { duration: 0, onClose: () => args.onClose?.() })
      }
    >
      Show
    </Button>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);

    reset();
    await userEvent.click(canvas.getByRole('button', { name: 'Show' }));

    const close = await page.findByRole('button', { name: '닫기' });

    close.click();
    close.click();
    await expect(args.onClose).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(toasts()).toHaveLength(0));
    reset();
  },
};

export const PauseOnHover: Story = {
  render: () => (
    <Button onClick={() => Toast.info('Hover me', { duration: 400 })}>
      Show
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);

    reset();
    await userEvent.click(canvas.getByRole('button', { name: 'Show' }));

    const toast = await page.findByText('Hover me');

    await userEvent.hover(toast);
    await new Promise(resolve => setTimeout(resolve, 700));
    await expect(toast).toBeInTheDocument();
    await userEvent.unhover(toast);
    await waitFor(() => expect(toasts()).toHaveLength(0), { timeout: 2000 });
    reset();
  },
};

export const IsolatedStacks: Story = {
  render: () => (
    <Button
      onClick={() => {
        Toast.info('Top', { id: 'top', placement: 'top-end', duration: 0 });
        Toast.info('Bottom', { id: 'bottom', duration: 0 });
      }}
    >
      Show both
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);

    reset();
    await userEvent.click(canvas.getByRole('button', { name: 'Show both' }));
    await waitFor(() => expect(toasts()).toHaveLength(2));
    Toast.destroy('top');
    await waitFor(() =>
      expect(page.queryByText('Top')).not.toBeInTheDocument(),
    );
    await expect(page.getByText('Bottom')).toBeVisible();
    await waitFor(() => expect(stack('top-end')).toBeNull());
    await expect(stack('bottom-end')).not.toBeNull();
    reset();
  },
};

export const RTL: Story = {
  render: () => (
    <Config direction="rtl">
      <Button onClick={() => Toast.info('End in RTL', { duration: 0 })}>
        Show
      </Button>
    </Config>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    reset();
    await userEvent.click(canvas.getByRole('button', { name: 'Show' }));
    await waitFor(() => expect(toasts()).toHaveLength(1));
    await expect(toasts()[0]!.getBoundingClientRect().left).toBeLessThan(
      window.innerWidth / 2,
    );
    reset();
  },
};
