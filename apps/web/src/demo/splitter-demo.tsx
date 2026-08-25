import { Splitter } from '@repo/ui';

function Pane({ label }: { label: string }) {
  return (
    <div
      className="flex h-full items-center justify-center p-4 text-sm
        font-medium"
    >
      {label}
    </div>
  );
}

export default function SplitterDemo() {
  return (
    <div className="h-64 w-full">
      <Splitter>
        <Splitter.Panel defaultSize="30%" minSize="20%">
          <Pane label="Sidebar" />
        </Splitter.Panel>
        <Splitter.Panel defaultSize="70%" minSize="30%">
          <Pane label="Content" />
        </Splitter.Panel>
      </Splitter>
    </div>
  );
}
