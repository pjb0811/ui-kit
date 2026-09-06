---
'@repo/ui': minor
---

Add a `RichTextEditor` atom, ported from `@jbpark/live-editor`'s
Tiptap-based `richtext` binding editor. Wraps `@tiptap/react`'s
`useEditor`/`EditorContent` with `StarterKit` and `extension-placeholder`;
accepts `value`/`placeholder`/`className`/`onChange`, committing the
edited HTML via `onChange` on blur and syncing external `value` changes
back into the editor. Ships its own scoped typography for headings,
lists, blockquotes, and code blocks in place of the `@tailwindcss/typography`
classes the source component depended on, since this package doesn't carry
that plugin (ui-kit#336).

Adds an optional toolbar: `toolbar` (`true` for every built-in preset, or
an array to pick a subset and order) and `toolbarItems` for extra custom
buttons `{ key, icon, label?, isActive?, onClick }`, each receiving the
live `Editor` instance. Presets cover everything `StarterKit` already
registers plus the added `TextStyleKit` marks — `undo`, `redo`,
`heading` (paragraph/H1-H4 via `Select`), `bold`, `italic`, `underline`,
`strike`, `code`, `bulletList`, `orderedList`, `blockquote`, `codeBlock`,
`horizontalRule`, `link` (a small URL popover), `fontSize`, and `color` —
so no extension beyond `@tiptap/extension-text-style`'s `TextStyleKit`
(`fontFamily`/`lineHeight`/`backgroundColor` disabled) was needed. New
`classNames.toolbar` / `classNames.content` slots style the toolbar row
and editor body independently, and the editor content now carries its
own scoped typography for headings/lists/blockquotes/code so those nodes
render correctly even in hosts that reset them via their own Tailwind
preflight.

Fixes the `fontSize`/`color` controls calling `.focus()` on every change
while their own picker (a `Select`/`ColorPicker` `Popover`) was still
open — moving DOM focus back to the editor mid-interaction made Radix
read it as an outside interaction and dismiss the picker immediately,
most visibly as the color picker closing the instant you tried to drag
in it. Commands apply to the stored ProseMirror selection regardless of
DOM focus, so dropping the `.focus()` call for these two presets doesn't
lose anything.

Restructures `rich-text-editor.tsx` into a `rich-text-editor/` folder
(`rich-text-editor.tsx`, `toolbar.tsx`, `toolbar-button.tsx`,
`toolbar-presets.tsx`, `content-classes.ts`, `types.ts`, `index.ts`) now
that the toolbar preset registry has real room to grow.
