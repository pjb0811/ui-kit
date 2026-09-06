import type { Editor } from '@tiptap/core';

import { cn } from '@repo/ui/utils';

import ToolbarButton from './toolbar-button';
import { TOOLBAR_PRESET_RENDERERS } from './toolbar-presets';
import type { ToolbarItem, ToolbarPreset } from './types';

export interface ToolbarProps {
  editor: Editor;
  presets: ToolbarPreset[];
  items?: ToolbarItem[];
  className?: string;
}

const Toolbar = ({ editor, presets, items, className }: ToolbarProps) => {
  return (
    <div
      data-slot="rich-text-editor-toolbar"
      className={cn(
        'flex flex-wrap items-center gap-1 border-b border-gray-200 px-2 py-1',
        className,
        //
      )}
    >
      {presets.map(preset => TOOLBAR_PRESET_RENDERERS[preset](editor))}
      {items?.map(item => (
        <ToolbarButton
          key={item.key}
          icon={item.icon}
          aria-label={item.label}
          active={item.isActive?.(editor)}
          onClick={() => item.onClick(editor)}
        />
      ))}
    </div>
  );
};

export default Toolbar;
