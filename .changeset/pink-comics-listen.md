---
'@repo/ui': minor
---

Add `CodeEditor`, a CodeMirror 6 editing surface published at its own subpath
(ui-kit#346).

Extracted from live-editor's editor, which already split into a reusable
CodeMirror surface and app-specific glue. Only the surface moved: JS/TS
highlighting (`javascript({ jsx: true, typescript: true })`), line wrapping, the
VSCode theme pair, the Cmd/Ctrl+S write-back, and CodeMirror's unified diff
view.

```tsx
import CodeEditor from '@jbpark/ui-kit/CodeEditor';

<CodeEditor value={code} onChange={setCode} height="200px" />;
```

**CodeMirror is an optional peer, and `CodeEditor` is reachable only through
`@jbpark/ui-kit/CodeEditor`** — it is deliberately absent from the root barrel.
An ESM re-export is eager, so exposing it there would make
`import { Button } from '@jbpark/ui-kit'` fail to resolve for every consumer
that never asked for an editor. Nothing changes for existing imports; using the
new subpath means installing the peer set:

```bash
pnpm add @uiw/react-codemirror @uiw/codemirror-theme-vscode \
  @codemirror/lang-javascript @codemirror/merge codemirror
```

**No formatter ships with it.** Format-on-save is injected as
`formatCode?: (code: string) => Promise<string>`, so the package carries none of
prettier's ~9.6 MB; pass the formatter your app already owns. Cmd+S runs it,
writes the result back with the cursor preserved, then fires `onChange`/`onSave`
— and without `formatCode` the shortcut still fires `onSave`, unformatted. The
write-back discards its result if the document moved while an async format was
in flight, and skips the transaction entirely when the text is unchanged so no
no-op undo entry is pushed. Errors surface through `onFormatError` (named around
the DOM `onError` handler the underlying props already carry).

`diff={{ original }}` renders `unifiedMergeView` against `original` instead of a
plain document, for a read-only review step before persisting; `mergeControls`
defaults to `false`.

`theme` is `'light' | 'dark' | 'auto' | 'none' | Extension`, defaulting to
`'auto'`, which follows the nearest `Config`'s `theme.dark` (`'system'` resolved
against `prefers-color-scheme`) and stays light when no `Config` sets it. The
two named options select the VSCode pair — narrowing CodeMirror's own meaning
for `'light'`/`'dark'`, which upstream are its built-in themes — while `'none'`
and a theme extension pass straight through. Apps that toggle the `.dark` class
themselves instead of going through `Config` should pass `theme` explicitly.
