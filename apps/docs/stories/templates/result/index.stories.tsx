import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button, Result } from '@repo/ui';

const meta: Meta<typeof Result> = {
  title: 'Feedback/Result',
  component: Result,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['success', 'error', 'info', 'warning', '404', '403', '500'],
    },
    icon: { table: { disable: true } },
    extra: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    status: 'success',
    title: '주문이 완료되었습니다',
    subTitle: '주문번호 2026081300001을 확인해 주세요',
  },
  render: args => (
    <Result {...args} extra={<Button color="primary">주문 내역 보기</Button>} />
  ),
};

export const Error: Story = {
  args: {
    status: 'error',
    title: '처리 중 문제가 발생했습니다',
    subTitle: '입력하신 정보를 확인하고 다시 시도해 주세요',
  },
  render: args => (
    <Result {...args} extra={<Button color="primary">다시 시도</Button>} />
  ),
};

export const NotFound: Story = {
  name: '404',
  args: {
    status: '404',
    title: '404',
    subTitle: '요청하신 페이지를 찾을 수 없습니다',
  },
  render: args => (
    <Result {...args} extra={<Button color="primary">홈으로 이동</Button>} />
  ),
};

export const Forbidden: Story = {
  name: '403',
  args: {
    status: '403',
    title: '403',
    subTitle: '이 페이지에 접근할 권한이 없습니다',
  },
};

export const ServerError: Story = {
  name: '500',
  args: {
    status: '500',
    title: '500',
    subTitle: '서버에 일시적인 오류가 발생했습니다',
  },
};
