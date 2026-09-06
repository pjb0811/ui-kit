'use client';

import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Eraser } from 'lucide-react';

import { RichTextEditor } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof RichTextEditor> = {
  title: 'Data Entry/RichTextEditor',
  component: RichTextEditor,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      control: { type: 'text' },
      description: 'HTML 문자열 값 (blur 시 onChange로 커밋됨)',
    },
    placeholder: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '<p>Hello, <strong>world</strong>!</p>',
    placeholder: 'Enter text...',
  },
  render: props => (
    <div className={cn('w-96')}>
      <RichTextEditor {...props} />
    </div>
  ),
};

export const WithToolbar: Story = {
  args: {
    value: '<p>Select this text and try the toolbar.</p>',
    toolbar: true,
  },
  render: props => (
    <div className={cn('w-[36rem]')}>
      <RichTextEditor {...props} />
    </div>
  ),
};

export const CustomToolbar: Story = {
  args: {
    value: '<p>Only a subset of presets, plus one custom button.</p>',
    toolbar: ['bold', 'italic', 'bulletList', 'link'],
    toolbarItems: [
      {
        key: 'clearFormatting',
        icon: <Eraser />,
        label: 'Clear formatting',
        onClick: editor =>
          editor.chain().focus().clearNodes().unsetAllMarks().run(),
      },
    ],
  },
  render: props => (
    <div className={cn('w-96')}>
      <RichTextEditor {...props} />
    </div>
  ),
};

export const Controlled: Story = {
  args: {
    value: '<p>Edit me and click outside to commit.</p>',
  },
  render: function Render({ value: initialValue = '' }) {
    const [value, setValue] = useState(initialValue);

    return (
      <div className={cn('w-96')}>
        <RichTextEditor value={value} onChange={setValue} />
      </div>
    );
  },
};
