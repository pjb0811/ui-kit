import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button, Modal } from '@repo/ui';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
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
