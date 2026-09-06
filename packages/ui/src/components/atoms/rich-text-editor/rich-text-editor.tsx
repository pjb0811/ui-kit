'use client';

import { useEffect } from 'react';

import Placeholder from '@tiptap/extension-placeholder';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { cn } from '@repo/ui/utils';

import { RICH_TEXT_CONTENT_CLASSES } from './content-classes';
import Toolbar from './toolbar';
import { DEFAULT_TOOLBAR_PRESETS } from './toolbar-presets';
import type { ToolbarItem, ToolbarPreset } from './types';

export interface Props {
  value?: string;
  placeholder?: string;
  className?: string;
  classNames?: {
    toolbar?: string;
    content?: string;
  };
  /**
   * `true` shows every built-in preset; an array shows only the listed
   * presets, in the given order. Omitted or `false` renders no toolbar,
   * matching the original (toolbar-less) output.
   */
  toolbar?: boolean | ToolbarPreset[];
  /** Extra buttons appended after the built-in presets. */
  toolbarItems?: ToolbarItem[];
  onChange?: (value: string) => void;
}

const RichTextEditor = ({
  value = '',
  placeholder = 'Enter text...',
  className,
  classNames,
  toolbar = false,
  toolbarItems,
  onChange,
}: Props) => {
  const presets = toolbar === true ? DEFAULT_TOOLBAR_PRESETS : toolbar || [];
  const showToolbar = presets.length > 0 || (toolbarItems?.length ?? 0) > 0;

  const editor = useEditor({
    // SSR renders every exported component without effects running, so the
    // editor must not touch the DOM during that first pass — deferring
    // creation to mount keeps `renderToStaticMarkup` from throwing.
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      TextStyleKit.configure({
        fontFamily: false,
        lineHeight: false,
        backgroundColor: false,
      }),
    ],
    content: value,
    onBlur: ({ editor: e }) => {
      onChange?.(e.getHTML());
    },
    // @tiptap/react v3 only re-renders on selection/transaction changes when
    // explicitly opted in — the toolbar's isActive()/getAttributes() reads
    // need that to reflect the caret position live.
    shouldRerenderOnTransaction: showToolbar,
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const current = editor.getHTML();

    if (current !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  return (
    <div
      data-slot="rich-text-editor"
      className={cn(
        'rounded border border-gray-200 bg-white text-sm text-gray-800',
        className,
        //
      )}
    >
      {showToolbar && editor && (
        <Toolbar
          editor={editor}
          presets={presets}
          items={toolbarItems}
          className={classNames?.toolbar}
        />
      )}
      <div
        data-slot="rich-text-editor-content"
        className={cn(
          'min-h-20 px-3 py-2',
          RICH_TEXT_CONTENT_CLASSES,
          classNames?.content,
          //
        )}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
