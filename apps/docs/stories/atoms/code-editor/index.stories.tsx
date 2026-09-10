'use client';

import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Config } from '@repo/ui';
import CodeEditor from '@repo/ui/CodeEditor';
import { cn } from '@repo/ui/utils';

const SAMPLE = `const greet = (name: string) => {
  return <p>Hello, {name}!</p>;
};
`;

const UNFORMATTED = `const sum = (a: number, b: number) => {
  return    a + b;
};
`;

const meta: Meta<typeof CodeEditor> = {
  title: 'Data Entry/CodeEditor',
  component: CodeEditor,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      control: { type: 'text' },
      description: 'CodeMirror 문서 내용 (제어 컴포넌트)',
    },
    height: {
      control: { type: 'text' },
      description: "CodeMirror에 그대로 전달. 기본값은 '100%'",
    },
    theme: {
      control: { type: 'inline-radio' },
      options: ['auto', 'light', 'dark', 'none'],
      description:
        "'light'/'dark'는 VSCode 테마 쌍, 'auto'(기본값)는 Config의 theme.dark를 따른다. CodeMirror 테마 Extension을 직접 넘겨도 된다",
    },
    editable: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: SAMPLE,
    height: '200px',
  },
  render: props => (
    <div className={cn('w-[36rem]')}>
      <CodeEditor {...props} />
    </div>
  ),
};

export const Dark: Story = {
  args: {
    value: SAMPLE,
    height: '200px',
  },
  render: props => (
    <div className={cn('w-[36rem]')}>
      <CodeEditor {...props} theme="dark" />
    </div>
  ),
};

// `theme` defaults to `'auto'`, which reads Config's `theme.dark` — so an app
// that already toggles dark mode through Config gets a matching editor without
// passing anything. `dark: 'system'` follows the OS instead.
export const AutoFollowsConfig: Story = {
  args: {
    value: SAMPLE,
    height: '200px',
  },
  render: props => (
    <Config theme={{ dark: 'dark' }}>
      <div className={cn('bg-background w-[36rem] p-4')}>
        <CodeEditor {...props} />
      </div>
    </Config>
  ),
};

export const Controlled: Story = {
  args: {
    value: SAMPLE,
    height: '200px',
  },
  render: function Render({ value: initialValue, ...props }) {
    const [value, setValue] = useState(initialValue);

    return (
      <div className={cn('w-[36rem] space-y-2')}>
        <CodeEditor {...props} value={value} onChange={setValue} />
        <p className={cn('text-muted-foreground text-sm')}>
          {value.split('\n').length} lines / {value.length} chars
        </p>
      </div>
    );
  },
};

// `formatCode` is injected, not bundled — the library owns no formatter. A real
// app passes prettier here; this stand-in only collapses runs of spaces so the
// Cmd+S round-trip is visible without a 9.6 MB dependency.
export const FormatOnSave: Story = {
  args: {
    value: UNFORMATTED,
    height: '200px',
  },
  render: function Render({ value: initialValue, ...props }) {
    const [value, setValue] = useState(initialValue);
    const [saved, setSaved] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    return (
      <div className={cn('w-[36rem] space-y-2')}>
        <CodeEditor
          {...props}
          value={value}
          formatCode={async code => code.replace(/ {2,}(?=\S)/g, ' ')}
          onChange={setValue}
          onSave={() => setSaved(new Date().toLocaleTimeString())}
          onFormatError={setError}
        />
        <p className={cn('text-muted-foreground text-sm')}>
          Press ⌘S / Ctrl+S to format and save.
          {saved && ` Last saved ${saved}.`}
          {error && ` Error: ${error}`}
        </p>
      </div>
    );
  },
};

export const Diff: Story = {
  args: {
    value: UNFORMATTED.replace('a + b', 'a + b + 1'),
    height: '200px',
    editable: false,
  },
  render: props => (
    <div className={cn('w-[36rem]')}>
      <CodeEditor {...props} diff={{ original: UNFORMATTED }} />
    </div>
  ),
};
