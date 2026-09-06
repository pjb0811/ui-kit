import { cn } from '@repo/ui/utils';

// The package ships no global Tailwind preflight (see src/globals.css), and a
// host that runs its own preflight (most do) resets bare h1-h6/ul/ol/blockquote
// to look like plain text. Since the toolbar can now produce all of these
// nodes, they need their own scoped typography here or toggling them would be
// visibly a no-op. Selectors are written out per Tailwind utility (not built
// via string interpolation) because v4 only extracts class candidates that
// appear as literal strings in source (see popover.tsx's arrow-class comment).
export const RICH_TEXT_CONTENT_CLASSES = cn(
  '[&_.tiptap]:outline-none',
  // Every block element (p/h1/ul/blockquote/...) carries its own UA top
  // margin — without this, the first one stacks on top of the box's own
  // py-2, doubling the padding visually.
  '[&_.tiptap>*:first-child]:mt-0',

  '[&_.tiptap_h1]:mt-6',
  '[&_.tiptap_h1]:mb-2',
  '[&_.tiptap_h1]:text-2xl',
  '[&_.tiptap_h1]:font-bold',
  '[&_.tiptap_h2]:mt-5',
  '[&_.tiptap_h2]:mb-2',
  '[&_.tiptap_h2]:text-xl',
  '[&_.tiptap_h2]:font-bold',
  '[&_.tiptap_h3]:mt-4',
  '[&_.tiptap_h3]:mb-2',
  '[&_.tiptap_h3]:text-lg',
  '[&_.tiptap_h3]:font-semibold',
  '[&_.tiptap_h4]:mt-3',
  '[&_.tiptap_h4]:mb-1',
  '[&_.tiptap_h4]:text-base',
  '[&_.tiptap_h4]:font-semibold',

  '[&_.tiptap_ul]:my-2',
  '[&_.tiptap_ul]:list-disc',
  '[&_.tiptap_ul]:pl-5',
  '[&_.tiptap_ol]:my-2',
  '[&_.tiptap_ol]:list-decimal',
  '[&_.tiptap_ol]:pl-5',
  '[&_.tiptap_li]:my-1',

  '[&_.tiptap_blockquote]:my-2',
  '[&_.tiptap_blockquote]:border-l-2',
  '[&_.tiptap_blockquote]:border-gray-300',
  '[&_.tiptap_blockquote]:pl-3',
  '[&_.tiptap_blockquote]:text-gray-600',
  '[&_.tiptap_blockquote]:italic',

  // A long unwrapped code line would otherwise blow out the box width.
  '[&_.tiptap_pre]:overflow-x-auto',
  '[&_.tiptap_pre]:my-2',
  '[&_.tiptap_pre]:rounded',
  '[&_.tiptap_pre]:bg-gray-900',
  '[&_.tiptap_pre]:p-3',
  '[&_.tiptap_pre]:font-mono',
  '[&_.tiptap_pre]:text-sm',
  '[&_.tiptap_pre]:text-gray-100',
  // Reset the inline `code` treatment below when it's nested inside `pre`,
  // so a code block doesn't get a second (redundant) chip background.
  '[&_.tiptap_pre_code]:bg-transparent',
  '[&_.tiptap_pre_code]:p-0',
  '[&_.tiptap_pre_code]:text-inherit',
  '[&_.tiptap_code]:rounded',
  '[&_.tiptap_code]:bg-gray-100',
  '[&_.tiptap_code]:px-1',
  '[&_.tiptap_code]:py-0.5',
  '[&_.tiptap_code]:font-mono',
  '[&_.tiptap_code]:text-[0.85em]',

  '[&_.tiptap_hr]:my-4',
  '[&_.tiptap_hr]:border-gray-200',

  '[&_.tiptap_a]:text-blue-600',
  '[&_.tiptap_a]:underline',
  '[&_.tiptap_a]:underline-offset-2',

  '[&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none',
  '[&_.tiptap_p.is-editor-empty:first-child::before]:float-left',
  '[&_.tiptap_p.is-editor-empty:first-child::before]:h-0',
  '[&_.tiptap_p.is-editor-empty:first-child::before]:text-gray-400',
  '[&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
);
