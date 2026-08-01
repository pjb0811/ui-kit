import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button, Toast } from '@repo/ui';

const meta: Meta<typeof Toast> = {
  title: 'Feedback/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['info', 'success', 'error', 'warning'],
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
    type: 'info',
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
