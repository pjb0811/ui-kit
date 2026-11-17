'use client';

import { type ReactNode, useState } from 'react';

import type { Editor } from '@tiptap/core';
import {
  Bold,
  Code,
  Code2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from 'lucide-react';

import { type ResolvedLocale, formatLocale } from '../../../providers/config';
import Button from '../button';
import ColorPicker from '../color-picker';
import Input from '../input';
import Popover from '../popover';
import Select from '../select';
import ToolbarButton from './toolbar-button';
import type { ToolbarPreset } from './types';

type Text = ResolvedLocale['RichTextEditor'];

const FONT_SIZE_OPTIONS = [
  { label: '12', value: '12px' },
  { label: '14', value: '14px' },
  { label: '16', value: '16px' },
  { label: '18', value: '18px' },
  { label: '24', value: '24px' },
  { label: '32', value: '32px' },
];

const HEADING_LEVELS = [1, 2, 3, 4] as const;

const headingOptions = (text: Text) => [
  { label: text.paragraph, value: 'paragraph' },
  ...HEADING_LEVELS.map(level => ({
    label: formatLocale(text.heading, { level }),
    value: String(level),
  })),
];

// Owns its own open/href state, so it has to be a real component (not a
// plain render function like the other presets) for the hooks below to be
// valid.
const LinkControl = ({ editor, text }: { editor: Editor; text: Text }) => {
  const [open, setOpen] = useState(false);
  const [href, setHref] = useState('');

  const apply = () => {
    const next = href.trim();

    if (next) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: next })
        .run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setOpen(false);
  };

  return (
    <Popover
      placement="bottom"
      open={open}
      onOpenChange={next => {
        if (next) {
          setHref(editor.getAttributes('link').href ?? '');
        }
        setOpen(next);
      }}
      content={
        <div className="flex items-center gap-2">
          <Input
            value={href}
            placeholder="https://"
            className="w-48"
            onChange={e => setHref(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                apply();
              }
            }}
          />
          <Button size="small" onClick={apply}>
            {text.apply}
          </Button>
        </div>
      }
    >
      <ToolbarButton
        icon={<LinkIcon />}
        aria-label={text.link}
        active={editor.isActive('link')}
      />
    </Popover>
  );
};

export const TOOLBAR_PRESET_RENDERERS: Record<
  ToolbarPreset,
  (editor: Editor, text: Text) => ReactNode
> = {
  undo: (editor, text) => (
    <ToolbarButton
      key="undo"
      icon={<Undo2 />}
      aria-label={text.undo}
      disabled={!editor.can().undo()}
      onClick={() => editor.chain().focus().undo().run()}
    />
  ),
  redo: (editor, text) => (
    <ToolbarButton
      key="redo"
      icon={<Redo2 />}
      aria-label={text.redo}
      disabled={!editor.can().redo()}
      onClick={() => editor.chain().focus().redo().run()}
    />
  ),
  heading: (editor, text) => {
    const activeLevel = HEADING_LEVELS.find(level =>
      editor.isActive('heading', { level }),
    );

    return (
      <Select
        key="heading"
        className="h-6 w-28"
        placeholder={text.style}
        options={headingOptions(text)}
        value={activeLevel ? String(activeLevel) : 'paragraph'}
        // No `.focus()` here — the Select is still open when this fires,
        // and refocusing the editor mid-selection dismisses it early (same
        // class of bug as the color picker below).
        onChange={value =>
          value === 'paragraph'
            ? editor.chain().setParagraph().run()
            : editor
                .chain()
                .setHeading({ level: Number(value) as 1 | 2 | 3 | 4 })
                .run()
        }
      />
    );
  },
  bold: (editor, text) => (
    <ToolbarButton
      key="bold"
      icon={<Bold />}
      aria-label={text.bold}
      active={editor.isActive('bold')}
      onClick={() => editor.chain().focus().toggleBold().run()}
    />
  ),
  italic: (editor, text) => (
    <ToolbarButton
      key="italic"
      icon={<Italic />}
      aria-label={text.italic}
      active={editor.isActive('italic')}
      onClick={() => editor.chain().focus().toggleItalic().run()}
    />
  ),
  underline: (editor, text) => (
    <ToolbarButton
      key="underline"
      icon={<Underline />}
      aria-label={text.underline}
      active={editor.isActive('underline')}
      onClick={() => editor.chain().focus().toggleUnderline().run()}
    />
  ),
  strike: (editor, text) => (
    <ToolbarButton
      key="strike"
      icon={<Strikethrough />}
      aria-label={text.strikethrough}
      active={editor.isActive('strike')}
      onClick={() => editor.chain().focus().toggleStrike().run()}
    />
  ),
  code: (editor, text) => (
    <ToolbarButton
      key="code"
      icon={<Code />}
      aria-label={text.inlineCode}
      active={editor.isActive('code')}
      onClick={() => editor.chain().focus().toggleCode().run()}
    />
  ),
  bulletList: (editor, text) => (
    <ToolbarButton
      key="bulletList"
      icon={<List />}
      aria-label={text.bulletList}
      active={editor.isActive('bulletList')}
      onClick={() => editor.chain().focus().toggleBulletList().run()}
    />
  ),
  orderedList: (editor, text) => (
    <ToolbarButton
      key="orderedList"
      icon={<ListOrdered />}
      aria-label={text.orderedList}
      active={editor.isActive('orderedList')}
      onClick={() => editor.chain().focus().toggleOrderedList().run()}
    />
  ),
  blockquote: (editor, text) => (
    <ToolbarButton
      key="blockquote"
      icon={<Quote />}
      aria-label={text.blockquote}
      active={editor.isActive('blockquote')}
      onClick={() => editor.chain().focus().toggleBlockquote().run()}
    />
  ),
  codeBlock: (editor, text) => (
    <ToolbarButton
      key="codeBlock"
      icon={<Code2 />}
      aria-label={text.codeBlock}
      active={editor.isActive('codeBlock')}
      onClick={() => editor.chain().focus().toggleCodeBlock().run()}
    />
  ),
  horizontalRule: (editor, text) => (
    <ToolbarButton
      key="horizontalRule"
      icon={<Minus />}
      aria-label={text.horizontalRule}
      onClick={() => editor.chain().focus().setHorizontalRule().run()}
    />
  ),
  link: (editor, text) => (
    <LinkControl key="link" editor={editor} text={text} />
  ),
  fontSize: (editor, text) => (
    <Select
      key="fontSize"
      className="h-6 w-20"
      placeholder={text.fontSize}
      options={FONT_SIZE_OPTIONS}
      value={editor.getAttributes('textStyle').fontSize ?? undefined}
      // No `.focus()` — see the `heading` preset above.
      onChange={value => editor.chain().setFontSize(value).run()}
    />
  ),
  color: editor => (
    <ColorPicker
      key="color"
      value={editor.getAttributes('textStyle').color || '#000000'}
      // No `.focus()`: react-colorful fires `onChange` continuously while
      // dragging, and refocusing the editor on every tick moves DOM focus
      // out from under the still-open popover, which Base UI reads as an
      // outside interaction and dismisses immediately (ui-kit reported
      // symptom: "picker closes as soon as you try to change the color").
      // The mark still applies to the stored selection without it.
      onChange={value => editor.chain().setColor(value).run()}
    />
  ),
};

export const DEFAULT_TOOLBAR_PRESETS: ToolbarPreset[] = [
  'undo',
  'redo',
  'heading',
  'bold',
  'italic',
  'underline',
  'strike',
  'code',
  'bulletList',
  'orderedList',
  'blockquote',
  'codeBlock',
  'horizontalRule',
  'link',
  'fontSize',
  'color',
];
