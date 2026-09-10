'use client';

// Subpath-only component (`@jbpark/ui-kit/CodeEditor`). Deliberately NOT
// re-exported from `atoms/index.ts` — CodeMirror is an *optional* peer
// dependency, and an ESM re-export from the root barrel is eager, so
// `import { Button } from '@jbpark/ui-kit'` would fail to resolve for every
// consumer that never asked for an editor. Keeping it behind its own subpath
// is what makes the peer set genuinely opt-in (#346).
import { useCallback, useMemo, useRef } from 'react';

import { javascript } from '@codemirror/lang-javascript';
import { unifiedMergeView } from '@codemirror/merge';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import CodeMirror, {
  type Extension,
  type ReactCodeMirrorRef,
} from '@uiw/react-codemirror';
import { EditorView } from 'codemirror';

import { cn } from '@repo/ui/utils';

// Relative rather than `@repo/ui/providers`, because this hook is deliberately
// absent from that barrel — it is a published subpath, and the hook is internal.
// Both specifiers resolve to the same files, so there is still one Config
// context.
import { useIsDarkActive } from '../../providers/config';

export interface Props extends Omit<
  React.ComponentProps<typeof CodeMirror>,
  'value' | 'extensions' | 'onChange' | 'ref' | 'theme'
> {
  value: string;
  /** Passed through to CodeMirror; `'100%'` fills the wrapper. */
  height?: string;
  /**
   * `'light'`/`'dark'` pick the VSCode theme pair, `'auto'` (the default)
   * follows the nearest `Config`'s `theme.dark`, and an `Extension` is any
   * CodeMirror theme of your own.
   *
   * This narrows CodeMirror's own meaning for two of the strings — upstream,
   * `'light'`/`'dark'` are *its* built-in themes — so that the two named
   * options match what the component actually renders by default. `'none'`
   * still means what it does upstream: no theme extension, style it yourself.
   */
  theme?: 'light' | 'dark' | 'auto' | 'none' | Extension;
  /** Appended after the built-in JS/TS + line-wrapping extensions. */
  extensions?: Extension[];
  /**
   * Renders a read-through unified diff against `original` instead of a plain
   * document. `mergeControls` defaults to `false` (display-only review, no
   * accept/reject gutters).
   */
  diff?: {
    original: string;
    mergeControls?: boolean;
  };
  /**
   * Formatter run on the Cmd/Ctrl+S value before it is written back. Omitted,
   * the shortcut still fires `onSave` — it just doesn't reformat. Kept as an
   * injected function so this package carries no formatter dependency of its
   * own (prettier is ~9.6 MB); pass the one your app already owns.
   */
  formatCode?: (code: string) => Promise<string>;
  className?: string;
  onChange?: (value: string) => void;
  /** Fires on Cmd/Ctrl+S with the value that was written back. */
  onSave?: (value: string) => void;
  /**
   * `null` on a clean save; a string carries the message a failed `formatCode`
   * threw. Named `onFormatError` rather than `onError` because the base props
   * already carry the DOM `onError` handler, and silently shadowing it would
   * be worse than the extra word.
   */
  onFormatError?: (error: string | null) => void;
}

const CodeEditor = ({
  value,
  theme = 'auto',
  height,
  className,
  extensions: extraExtensions,
  diff,
  formatCode,
  onChange,
  onSave,
  onFormatError,
  ...props
}: Props) => {
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const isDarkActive = useIsDarkActive();

  const resolvedTheme = useMemo(() => {
    if (theme === 'auto') {
      return isDarkActive ? vscodeDark : vscodeLight;
    }
    if (theme === 'light') {
      return vscodeLight;
    }
    if (theme === 'dark') {
      return vscodeDark;
    }

    // `'none'` and a caller-supplied Extension both mean what they mean
    // upstream, so hand them straight to CodeMirror.
    return theme;
  }, [theme, isDarkActive]);

  const extensions = useMemo(() => {
    const base: Extension[] = [
      javascript({ jsx: true, typescript: true }),
      EditorView.lineWrapping,
    ];

    if (diff) {
      base.push(
        unifiedMergeView({
          original: diff.original,
          mergeControls: diff.mergeControls ?? false,
        }),
      );
    }

    return [...base, ...(extraExtensions ?? [])];
  }, [diff, extraExtensions]);

  const save = useCallback(
    async (val: string) => {
      const view = editorRef.current?.view;
      if (!view) {
        return;
      }

      try {
        const currentLength = view.state.doc.length;
        const cursorPos = view.state.selection.main.head;
        const next = formatCode ? await formatCode(val) : val;

        // Formatting is async, so the document may have moved on while it ran
        // — writing back then would clobber keystrokes typed in the meantime.
        if (currentLength !== view.state.doc.length) {
          onFormatError?.(null);
          return;
        }

        // Skip the transaction when the text is unchanged (the common case
        // without a `formatCode`): replacing the doc with itself would push a
        // pointless undo entry. The callbacks still fire, so a save handler
        // sees every Cmd+S.
        if (next !== val) {
          view.dispatch(
            view.state.update({
              changes: { from: 0, to: currentLength, insert: next },
              selection: { anchor: Math.min(cursorPos, next.length) },
            }),
          );
        }

        onChange?.(next);
        onSave?.(next);
        onFormatError?.(null);
      } catch (e) {
        onFormatError?.(e instanceof Error ? e.message : String(e));
      }
    },
    [formatCode, onChange, onSave, onFormatError],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        save(editorRef.current?.view?.state.doc.toString() ?? value);
      }
    },
    [save, value],
  );

  return (
    <div
      data-slot="code-editor"
      className={cn(
        className,
        // ...
      )}
      onKeyDown={onKeyDown}
    >
      <CodeMirror
        ref={editorRef}
        theme={resolvedTheme}
        height={height || '100%'}
        value={value}
        extensions={extensions}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

export default CodeEditor;
