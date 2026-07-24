import { useState } from 'react';

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

const DemoHeader = () => (
  <>
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
  </>
);

const DemoContent = () => (
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

const DemoSider = ({ collapsed = false }: { collapsed?: boolean }) => (
  <div
    className={cn(
      'h-full bg-gray-50 p-4',
      'border-r border-gray-200',
      //
    )}
  >
    {!collapsed && (
      <Typography.Title className="text-xl">Sider</Typography.Title>
    )}
    <nav className="mt-4 space-y-2">
      {['메뉴 1', '메뉴 2', '메뉴 3'].map((label, index) => (
        <Typography.Link
          key={label}
          href="#"
          className={cn(
            'block rounded p-2 text-center',
            'transition-colors hover:bg-gray-200',
          )}
        >
          {collapsed ? index + 1 : label}
        </Typography.Link>
      ))}
    </nav>
  </div>
);

const DemoFooter = () => (
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
      <Layout.Header className="justify-between border-b bg-white py-3">
        <DemoHeader />
      </Layout.Header>
      <Layout.Content>
        <DemoContent />
      </Layout.Content>
      <Layout.Footer>
        <DemoFooter />
      </Layout.Footer>
    </Layout>
  ),
};

export const WithSider: Story = {
  render: () => (
    <Layout>
      <Layout.Header className="justify-between border-b bg-white py-3">
        <DemoHeader />
      </Layout.Header>
      <Layout>
        <Layout.Sider>
          <DemoSider />
        </Layout.Sider>
        <Layout.Content>
          <DemoContent />
        </Layout.Content>
      </Layout>
      <Layout.Footer>
        <DemoFooter />
      </Layout.Footer>
    </Layout>
  ),
};

export const CollapsibleSider: Story = {
  name: 'WithSider (Collapsible)',
  render: () => (
    <Layout>
      <Layout.Header className="justify-between border-b bg-white py-3">
        <DemoHeader />
      </Layout.Header>
      <Layout>
        <Layout.Sider collapsible defaultCollapsed={false}>
          <DemoSider />
        </Layout.Sider>
        <Layout.Content>
          <DemoContent />
        </Layout.Content>
      </Layout>
      <Layout.Footer>
        <DemoFooter />
      </Layout.Footer>
    </Layout>
  ),
};

const DemoControlledSider = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Layout.Header className="justify-between border-b bg-white py-3">
        <Typography.Title className="text-3xl">Header</Typography.Title>
        <button
          onClick={() => setCollapsed(prev => !prev)}
          className={cn(
            'rounded border px-3 py-1 text-sm',
            'transition-colors hover:bg-gray-50',
          )}
        >
          {collapsed ? '펼치기' : '접기'}
        </button>
      </Layout.Header>
      <Layout>
        <Layout.Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
        >
          <DemoSider collapsed={collapsed} />
        </Layout.Sider>
        <Layout.Content>
          <DemoContent />
        </Layout.Content>
      </Layout>
      <Layout.Footer>
        <DemoFooter />
      </Layout.Footer>
    </Layout>
  );
};

export const ControlledSider: Story = {
  render: () => <DemoControlledSider />,
};

export const WithSiderRight: Story = {
  render: () => (
    <Layout>
      <Layout.Header className="justify-between border-b bg-white py-3">
        <DemoHeader />
      </Layout.Header>
      <Layout>
        <Layout.Content>
          <DemoContent />
        </Layout.Content>
        <Layout.Sider className="border-r-0 border-l">
          <DemoSider />
        </Layout.Sider>
      </Layout>
      <Layout.Footer>
        <DemoFooter />
      </Layout.Footer>
    </Layout>
  ),
};

export const HeaderOnly: Story = {
  render: () => (
    <Layout>
      <Layout.Header className="justify-between border-b bg-white py-3">
        <DemoHeader />
      </Layout.Header>
      <Layout.Content>
        <DemoContent />
      </Layout.Content>
    </Layout>
  ),
};

export const FooterOnly: Story = {
  render: () => (
    <Layout>
      <Layout.Content>
        <DemoContent />
      </Layout.Content>
      <Layout.Footer>
        <DemoFooter />
      </Layout.Footer>
    </Layout>
  ),
};
