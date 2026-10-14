'use client';

import {
  type ComponentPropsWithRef,
  type ReactNode,
  type Ref,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useControllableState,
  useLatest,
  useMergedRef,
} from '@jbpark/use-hooks';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { autocomplete } from '../../core';
import Input from './input';
import { findToken, insertToken } from './mentions-token';

export interface Option {
  /** Unique, non-empty token text without whitespace or the prefix. */
  value: string;
  label?: string;
  prefix?: string;
  disabled?: boolean;
}

export interface Props extends Omit<
  ComponentPropsWithRef<'textarea'>,
  'children' | 'value' | 'defaultValue' | 'onChange' | 'onSelect'
> {
  options: readonly Option[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSelect?: (option: Option, prefix: string) => void;
  onSearch?: (query: string, prefix: string) => void;
  prefixes?: readonly string[];
  filterOption?: false | ((query: string, option: Option) => boolean);
  loading?: boolean;
  loadingText?: ReactNode;
  emptyText?: ReactNode;
  container?: HTMLElement;
  classNames?: {
    root?: string;
    content?: string;
    list?: string;
    option?: string;
    empty?: string;
  };
}

const DEFAULT_PREFIXES = ['@'];

function TextareaBridge({
  primitiveRef,
  ref,
  ...props
}: ComponentPropsWithRef<'textarea'> & {
  primitiveRef?: Ref<HTMLTextAreaElement>;
}) {
  const mergedRef = useMergedRef(primitiveRef, ref);

  return <Input.TextArea {...props} ref={mergedRef} />;
}

const Mentions = ({
  options,
  value,
  defaultValue = '',
  onChange,
  onSelect,
  onSearch,
  prefixes = DEFAULT_PREFIXES,
  filterOption,
  loading = false,
  loadingText = 'Loading suggestions…',
  emptyText = 'No suggestions',
  container,
  disabled,
  readOnly,
  name,
  form,
  className,
  classNames,
  dir,
  ref,
  onFocus,
  onBlur,
  onClick,
  onKeyDown,
  onKeyUp,
  onCompositionStart,
  onCompositionEnd,
  ...props
}: Props) => {
  const { direction } = useConfig();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const mergedRef = useMergedRef(ref, textareaRef);
  const composingRef = useRef(false);
  const pendingCaret = useRef<{ value: string; caret: number } | null>(null);
  const [text, setText] = useControllableState<string>({
    value,
    defaultValue,
    onChange,
  });
  const [focused, setFocused] = useState(false);
  const [composing, setComposing] = useState(false);
  const [selection, setSelection] = useState({ text: '', start: 0, end: 0 });
  const [dismissed, setDismissed] = useState<readonly (string | null)[]>([]);
  const token =
    focused && !composing && !disabled && !readOnly && selection.text === text
      ? findToken(text, selection.start, selection.end, prefixes)
      : null;
  const signature = token
    ? JSON.stringify([text, selection.start, selection.end, token.prefix])
    : null;
  const open = token !== null && !dismissed.includes(signature);
  const query = token?.query;
  const prefix = token?.prefix;
  const searchRef = useLatest(onSearch);

  useEffect(() => {
    if (query !== undefined && prefix !== undefined) {
      searchRef.current?.(query, prefix);
    }
  }, [query, prefix, searchRef]);

  useEffect(() => {
    const pending = pendingCaret.current;
    const textarea = textareaRef.current;

    if (pending && textarea && text === pending.value) {
      pendingCaret.current = null;

      if (textarea.ownerDocument.activeElement === textarea) {
        textarea.setSelectionRange(pending.caret, pending.caret);
      }
    }
  });

  const syncSelection = (textarea: HTMLTextAreaElement) => {
    setSelection(previous => {
      const next = {
        text: textarea.value,
        start: textarea.selectionStart,
        end: textarea.selectionEnd,
      };

      return previous.text === next.text &&
        previous.start === next.start &&
        previous.end === next.end
        ? previous
        : next;
    });
  };
  const filtered = options.filter(option => {
    if (
      !option.value ||
      /\s/u.test(option.value) ||
      prefixes.some(
        prefix => prefix.length > 0 && option.value.startsWith(prefix),
      ) ||
      (option.prefix !== undefined && option.prefix !== prefix)
    ) {
      return false;
    }

    if (filterOption === false) {
      return true;
    }

    return filterOption
      ? filterOption(query ?? '', option)
      : [option.value, option.label ?? ''].some(label =>
          label.toLowerCase().includes((query ?? '').toLowerCase()),
        );
  });
  const select = (option: Option) => {
    const textarea = textareaRef.current;

    if (
      !open ||
      !textarea ||
      composingRef.current ||
      option.disabled ||
      disabled ||
      readOnly ||
      textarea.value !== text
    ) {
      return;
    }

    const currentToken = findToken(
      text,
      textarea.selectionStart,
      textarea.selectionEnd,
      prefixes,
    );

    if (
      !currentToken ||
      currentToken.start !== token?.start ||
      currentToken.query !== token.query ||
      (currentToken.prefix !== option.prefix && option.prefix !== undefined)
    ) {
      return;
    }

    const next = insertToken(text, currentToken, option.value);

    pendingCaret.current = next;
    setDismissed([
      signature,
      JSON.stringify([next.value, next.caret, next.caret, currentToken.prefix]),
    ]);
    setText(next.value);
    onSelect?.(option, currentToken.prefix);
  };
  const {
    Autocomplete: Root,
    AutocompleteInput,
    AutocompleteContent,
    AutocompleteList,
    AutocompleteItem,
  } = autocomplete;

  return (
    <div
      data-slot="mentions"
      dir={dir ?? direction}
      className={cn(
        'relative min-w-0',
        classNames?.root, //
      )}
    >
      <Root
        items={loading ? [] : filtered}
        filter={null}
        value={text}
        defaultValue={defaultValue}
        onValueChange={(next, details) => {
          if (
            details.reason === 'item-press' ||
            details.reason === 'escape-key'
          ) {
            details.cancel();

            return;
          }

          pendingCaret.current = null;
          setText(next);

          if (textareaRef.current) {
            syncSelection(textareaRef.current);
          }
        }}
        disabled={disabled}
        readOnly={readOnly}
        name={name}
        form={form}
        open={open}
        onOpenChange={next => {
          if (!next) {
            setDismissed([signature]);
          }
        }}
        itemToStringValue={option => option.value}
      >
        <AutocompleteInput
          render={inputProps => {
            // Base UI's input handlers use the shared text-control DOM contract.
            // Adapt their input-only types while preserving the textarea atom.
            const native =
              inputProps as unknown as ComponentPropsWithRef<'textarea'>;

            return (
              <TextareaBridge
                {...native}
                {...props}
                ref={mergedRef}
                primitiveRef={native.ref}
                dir={dir ?? direction}
                data-slot="mentions-input"
                className={cn(
                  native.className,
                  className, //
                )}
                onFocus={event => {
                  onFocus?.(event);
                  native.onFocus?.(event);
                  setFocused(true);
                  setDismissed([]);
                  syncSelection(event.currentTarget);
                }}
                onBlur={event => {
                  onBlur?.(event);
                  native.onBlur?.(event);
                  setFocused(false);
                }}
                onSelect={event => syncSelection(event.currentTarget)}
                onClick={event => {
                  onClick?.(event);
                  native.onClick?.(event);
                  syncSelection(event.currentTarget);
                }}
                onKeyDown={event => {
                  onKeyDown?.(event);

                  if (event.defaultPrevented) {
                    return;
                  }

                  if (
                    !open ||
                    composingRef.current ||
                    event.nativeEvent.isComposing ||
                    event.keyCode === 229 ||
                    event.key === 'Home' ||
                    event.key === 'End'
                  ) {
                    return;
                  }

                  native.onKeyDown?.(event);
                }}
                onKeyUp={event => {
                  onKeyUp?.(event);
                  native.onKeyUp?.(event);
                  syncSelection(event.currentTarget);
                }}
                onCompositionStart={event => {
                  composingRef.current = true;
                  setComposing(true);
                  onCompositionStart?.(event);
                  native.onCompositionStart?.(event);
                }}
                onCompositionEnd={event => {
                  composingRef.current = false;
                  setComposing(false);
                  onCompositionEnd?.(event);
                  native.onCompositionEnd?.(event);
                  syncSelection(event.currentTarget);
                }}
              />
            );
          }}
        />
        <AutocompleteContent
          container={container}
          dir={dir ?? direction}
          className={classNames?.content}
        >
          {(loading || filtered.length === 0) && (
            <div
              role="status"
              className={cn(
                'text-muted-foreground px-3 py-2 text-sm',
                classNames?.empty, //
              )}
            >
              {loading ? loadingText : emptyText}
            </div>
          )}
          <AutocompleteList
            className={cn(
              'max-h-60 overflow-y-auto p-1',
              classNames?.list, //
            )}
          >
            {(option: Option) => (
              <AutocompleteItem
                key={option.value}
                value={option}
                disabled={option.disabled}
                onMouseUp={event => event.preventBaseUIHandler()}
                onClick={event => {
                  event.preventBaseUIHandler();
                  select(option);
                }}
                className={cn(
                  `data-highlighted:bg-accent
                  data-highlighted:text-accent-foreground cursor-default
                  rounded-sm px-2 py-1.5 text-sm [overflow-wrap:anywhere]
                  outline-none data-disabled:opacity-50`,
                  classNames?.option, //
                )}
              >
                {option.label ?? option.value}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Root>
    </div>
  );
};

export default Mentions;
