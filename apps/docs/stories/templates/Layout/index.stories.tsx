import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Layout, Typography } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof Layout> = {
  title: 'UI/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    children: {
      table: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const Header = () => (
  <div
    className={cn(
      'flex w-full items-center justify-between',
      'border-b bg-white p-3',
    )}
  >
    <Typography.Title className="text-3xl">Header</Typography.Title>
    <div className="flex gap-2">
      <button
        className={cn(
          'rounded border px-3 py-1 text-sm',
          'transition-colors hover:bg-gray-50',
        )}
      >
        로그인
      </button>
      <button
        className={cn(
          'rounded bg-blue-500 px-3 py-1 text-sm text-white',
          'transition-colors hover:bg-blue-600',
        )}
      >
        회원가입
      </button>
    </div>
  </div>
);

const Content = () => (
  <div className="p-6">
    <Typography.Title className="text-2xl">Content</Typography.Title>
    <Typography.Paragraph>
      이것은 레이아웃의 메인 콘텐츠 영역입니다. 여기에 페이지의 주요 내용이
      들어갑니다.
    </Typography.Paragraph>
    <div
      className={cn('mt-4 rounded bg-gray-50 p-4', 'border border-gray-200')}
    >
      <Typography.Text>콘텐츠 예시</Typography.Text>
    </div>
  </div>
);

const Sider = () => (
  <div
    className={cn(
      'h-full bg-gray-50 p-4',
      'border-r border-gray-200',
      //
    )}
  >
    <Typography.Title className="text-xl">Sider</Typography.Title>
    <nav className="mt-4 space-y-2">
      <Typography.Link
        href="#"
        className={cn(
          'block rounded p-2',
          'transition-colors hover:bg-gray-200',
        )}
      >
        메뉴 1
      </Typography.Link>
      <Typography.Link
        href="#"
        className={cn(
          'block rounded p-2',
          'transition-colors hover:bg-gray-200',
        )}
      >
        메뉴 2
      </Typography.Link>
      <Typography.Link
        href="#"
        className={cn(
          'block rounded p-2',
          'transition-colors hover:bg-gray-200',
        )}
      >
        메뉴 3
      </Typography.Link>
    </nav>
  </div>
);

const Footer = () => (
  <div
    className={cn(
      'bg-gray-100 p-4 text-center',
      'border-t border-gray-200',
      //
    )}
  >
    <Typography.Text>Footer</Typography.Text>
  </div>
);

export const Default: Story = {
  render: () => (
    <Layout>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Content>
        <Content />
      </Layout.Content>
      <Layout.Footer>
        <Footer />
      </Layout.Footer>
    </Layout>
  ),
};

export const WithSider: Story = {
  render: () => (
    <Layout>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout>
        <Layout.Sider>
          <Sider />
        </Layout.Sider>
        <Layout.Content>
          <Content />
        </Layout.Content>
      </Layout>
      <Layout.Footer>
        <Footer />
      </Layout.Footer>
    </Layout>
  ),
};
