import { Button, PageHeader } from '@repo/ui';

export default function PageHeaderDemo() {
  return (
    <PageHeader
      title="Project settings"
      subTitle="Manage your project configuration"
      onBack={() => {}}
      extra={<Button variant="solid">Save</Button>}
    />
  );
}
