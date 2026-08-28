import { Button, Empty } from '@repo/ui';

export default function EmptyDemo() {
  return (
    <Empty
      title="No projects yet"
      description="Create your first project to get started."
      action={<Button variant="solid">New project</Button>}
    />
  );
}
