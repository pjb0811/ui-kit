import { useState } from 'react';

import { useColorMode } from '@docusaurus/theme-common';

import { Space, Typography } from '@repo/ui';
import CodeEditor from '@repo/ui/CodeEditor';

const SAMPLE = `const greet = (name: string) => {
  return <p>Hello, {name}!</p>;
};
`;

// `formatCode` is injected rather than bundled, so this page needs no
// formatter dependency. The stand-in below collapses runs of spaces, which is
// enough to show the Cmd+S round-trip; a real app passes prettier.
const collapseSpaces = async (code: string) =>
  code.replace(/ {2,}(?=\S)/g, ' ');

export default function CodeEditorDemo() {
  const [value, setValue] = useState(SAMPLE);
  const [saved, setSaved] = useState<string | null>(null);
  // `theme` defaults to `'auto'`, which follows <Config theme={{ dark }}>. This
  // site doesn't use that — DemoTheme toggles `.dark` on <html> directly (see
  // its comment for why) — so the color mode is handed over explicitly.
  const { colorMode } = useColorMode();

  return (
    <Space
      orientation="vertical"
      align="start"
      size="small"
      className="w-full max-w-2xl"
    >
      <div className="border-border w-full rounded border">
        <CodeEditor
          value={value}
          theme={colorMode}
          height="200px"
          formatCode={collapseSpaces}
          onChange={setValue}
          onSave={() => setSaved(new Date().toLocaleTimeString())}
        />
      </div>
      <Typography.Text className="text-muted-foreground text-sm">
        Press ⌘S / Ctrl+S to format and save.
        {saved ? ` Last saved ${saved}.` : ''}
      </Typography.Text>
    </Space>
  );
}
