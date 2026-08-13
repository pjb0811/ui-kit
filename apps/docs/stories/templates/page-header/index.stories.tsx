import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button, PageHeader } from '@repo/ui';

const meta: Meta<typeof PageHeader> = {
  title: 'Navigation/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onBack: {
      table: { disable: true },
    },
    backIcon: {
      table: { disable: true },
    },
    extra: {
      table: { disable: true },
    },
    classNames: {
      table: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '상품 상세',
    onBack: () => {},
  },
};

export const WithSubTitle: Story = {
  args: {
    title: '주문 #2026081300001',
    subTitle: '2026년 8월 13일 결제 완료',
    onBack: () => {},
  },
};

export const WithExtra: Story = {
  args: {
    title: '상품 상세',
    onBack: () => {},
  },
  render: args => (
    <PageHeader
      {...args}
      extra={
        <div className="flex gap-2">
          <Button variant="outlined">공유</Button>
          <Button color="primary">수정</Button>
        </div>
      }
    />
  ),
};

export const NoBackButton: Story = {
  args: {
    title: '설정',
  },
};
