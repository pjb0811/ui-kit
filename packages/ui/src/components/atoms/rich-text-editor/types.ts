import type { ReactNode } from 'react';

import type { Editor } from '@tiptap/core';

export type ToolbarPreset =
  | 'undo'
  | 'redo'
  | 'heading'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code'
  | 'bulletList'
  | 'orderedList'
  | 'blockquote'
  | 'codeBlock'
  | 'horizontalRule'
  | 'link'
  | 'fontSize'
  | 'color';

export interface ToolbarItem {
  key: string;
  icon: ReactNode;
  label?: string;
  isActive?: (editor: Editor) => boolean;
  onClick: (editor: Editor) => void;
}
