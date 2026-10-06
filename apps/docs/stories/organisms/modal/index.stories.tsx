import { useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button, Modal } from '@repo/ui';

const meta: Meta<typeof Modal> = {
  title: 'Feedback/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    open: {
      control: { type: 'boolean' },
    },
    maskClosable: {
      control: { type: 'boolean' },
    },
    closable: {
      control: { type: 'boolean' },
    },
    okText: {
      control: { type: 'text' },
    },
    cancelText: {
      control: { type: 'text' },
    },
    onOk: {
      action: 'onOk',
    },
    onCancel: {
      action: 'onCancel',
    },
  },
  render: function Render(props) {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>모달 열기</Button>
        <Modal
          {...props}
          open={open}
          onCancel={() => setOpen(false)}
          onOk={() => setOpen(false)}
        >
          <p>모달 내용입니다.</p>
        </Modal>
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: false,
    maskClosable: true,
    closable: true,
    okText: '확인',
    cancelText: '취소',
  },
};

export const StaticModal: Story = {
  render: () => {
    const showInfo = () => {
      Modal.info({
        title: '정보',
        content: '이것은 정보 모달입니다.',
      });
    };

    const showSuccess = () => {
      Modal.success({
        title: '성공',
        content: '작업이 성공적으로 완료되었습니다.',
      });
    };

    const showError = () => {
      Modal.error({
        title: '오류',
        content: '오류가 발생했습니다.',
      });
    };

    const showWarning = () => {
      Modal.warning({
        title: '경고',
        content: '주의가 필요한 작업입니다.',
      });
    };

    const showConfirm = () => {
      Modal.confirm({
        title: '확인',
        content: '정말로 실행하시겠습니까?',
        onOk: () => console.log('확인됨'),
        onCancel: () => console.log('취소됨'),
      });
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
        <Button onClick={showConfirm} variant="outlined">
          Confirm
        </Button>
      </div>
    );
  },
};

export const ClosingLifecycle: Story = {
  render: function Render() {
    const container = useRef<HTMLDivElement>(null);
    const lastId = useRef<string | undefined>(undefined);
    const [actions, setActions] = useState(0);
    const [completed, setCompleted] = useState(0);

    const show = (duration: number, confirm = true) => {
      const create = confirm ? Modal.confirm : Modal.info;

      lastId.current = create({
        title: 'Closing lifecycle',
        content: 'The modal remains mounted until its transition finishes.',
        container: container.current!,
        closable: true,
        maskClosable: true,
        okText: 'Accept',
        cancelText: 'Dismiss',
        style: { transitionDuration: `${duration}ms` },
        classNames: { mask: 'transition-none' },
        onOk: () => setActions(value => value + 1),
        onCancel: () => setActions(value => value + 1),
        onOpenChangeComplete: open => {
          if (!open) {
            setCompleted(value => value + 1);
          }
        },
      });
    };

    return (
      <div>
        <Button onClick={() => show(1000)}>Open long transition</Button>
        <Button onClick={() => show(200)}>Open default transition</Button>
        <Button onClick={() => show(0, false)}>Open without animation</Button>
        <Button onClick={() => Modal.destroy(lastId.current)}>
          Destroy latest
        </Button>
        <Button onClick={() => Modal.destroyAll()}>Destroy all</Button>
        <output>
          Actions: {actions}; completed: {completed}
        </output>
        <div ref={container} data-modal-test-container="" />
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const container = canvasElement.querySelector(
      '[data-modal-test-container]',
    ) as HTMLElement;
    const portals = within(container);
    const delay = (ms: number) =>
      new Promise(resolve => setTimeout(resolve, ms));
    const open = async (label = 'Open long transition') => {
      canvas.getByText(label).click();
      await waitFor(() => {
        expect(
          portals.getAllByRole('dialog', { hidden: true }).length,
        ).toBeGreaterThan(0);
      });
      await waitFor(() => {
        expect(container.querySelector('[data-starting-style]')).toBeNull();
      });
      await delay(label === 'Open long transition' ? 1100 : 250);
    };
    const expectEmpty = async () => {
      await waitFor(() => expect(container.childElementCount).toBe(0), {
        timeout: 3000,
      });
    };

    try {
      for (const action of [
        'Accept',
        'Dismiss',
        'Escape',
        'Close',
        'Backdrop',
      ]) {
        await step(`Long transition: ${action}`, async () => {
          await open();

          if (action === 'Escape') {
            await userEvent.keyboard('{Escape}');
          } else if (action === 'Backdrop') {
            await userEvent.click(
              container.querySelector('[data-slot="dialog-overlay"]')!,
            );
          } else {
            const button = portals.getByRole('button', { name: action });

            await userEvent.click(button);

            if (action === 'Accept') {
              button.click();
            }
          }

          await waitFor(() => {
            expect(
              container.querySelector('[data-ending-style]'),
            ).not.toBeNull();
          });
          await delay(300);
          expect(container.querySelector('[role="dialog"]')).not.toBeNull();
          await expectEmpty();
        });
      }

      await step('Default and no-animation completion', async () => {
        await open('Open default transition');
        await userEvent.click(portals.getByRole('button', { name: 'Accept' }));
        await expectEmpty();
        await open('Open without animation');
        await userEvent.click(portals.getByRole('button', { name: 'Accept' }));
        await expectEmpty();
        expect(canvas.getByText('Actions: 7; completed: 7')).toBeVisible();
      });

      await step('Closing one entry preserves another', async () => {
        await open();
        await open();
        await userEvent.click(
          portals
            .getAllByRole('button', { name: 'Dismiss', hidden: true })
            .at(-1)!,
        );
        await waitFor(
          () =>
            expect(
              portals.getAllByRole('dialog', { hidden: true }),
            ).toHaveLength(1),
          { timeout: 3000 },
        );
        expect(container.childElementCount).toBe(2);
      });

      await step('Force removal during closing', async () => {
        await open();
        await userEvent.click(
          portals
            .getAllByRole('button', { name: 'Accept', hidden: true })
            .at(-1)!,
        );
        canvas.getByText('Destroy latest').click();
        await waitFor(() => {
          expect(portals.getAllByRole('dialog', { hidden: true })).toHaveLength(
            1,
          );
        });
        canvas.getByText('Destroy all').click();
        await expectEmpty();
        await delay(1200);
        expect(canvas.getByText('Actions: 9; completed: 8')).toBeVisible();

        await open();
        await userEvent.click(portals.getByRole('button', { name: 'Accept' }));
        canvas.getByText('Destroy all').click();
        await expectEmpty();
        await delay(1200);
        expect(canvas.getByText('Actions: 10; completed: 8')).toBeVisible();
      });

      canvasElement.dataset.modalLifecycle = 'passed';
    } finally {
      Modal.destroyAll();
    }
  },
};
