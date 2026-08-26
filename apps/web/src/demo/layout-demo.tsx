import { Layout } from '@repo/ui';

export default function LayoutDemo() {
  return (
    <Layout
      className="h-80! min-h-0! overflow-hidden rounded-lg border
        border-gray-200 dark:border-gray-700"
    >
      <Layout.Header className="bg-blue-600 text-white">Header</Layout.Header>
      <Layout>
        <Layout.Sider collapsible className="bg-gray-100 p-4 dark:bg-gray-800">
          Sider
        </Layout.Sider>
        <Layout.Content className="p-4">
          Content — the main area grows to fill the space between the header and
          footer.
        </Layout.Content>
      </Layout>
      <Layout.Footer className="bg-gray-100 p-4 text-center dark:bg-gray-800">
        Footer
      </Layout.Footer>
    </Layout>
  );
}
