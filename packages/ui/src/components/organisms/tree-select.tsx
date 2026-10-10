'use client';

import {
  type ComponentPropsWithRef,
  type ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { DirectionProvider } from '@base-ui/react/direction-provider';
import { ChevronDown, X } from 'lucide-react';

import { DEFAULT_LOCALE, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { popover } from '../../core';
import Button from '../atoms/button';
import Tree, { type Node, type Props as TreeProps } from './tree';

export type { Node } from './tree';

export interface Props extends Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'value' | 'defaultValue' | 'onChange' | 'type'
> {
  nodes: readonly Node[];
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null, node: Node | null) => void;
  expandedKeys?: readonly string[];
  defaultExpandedKeys?: readonly string[];
  onExpand?: (keys: string[]) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  allowClear?: boolean;
  clearLabel?: string;
  placeholder?: string;
  popupLabel?: string;
  emptyText?: ReactNode;
  container?: HTMLElement;
  form?: string;
  classNames?: {
    trigger?: string;
    value?: string;
    clear?: string;
    popup?: string;
    tree?: string;
    nodes?: TreeProps['classNames'];
  };
}

const TreeSelect = ({
  nodes,
  value,
  defaultValue = null,
  onChange,
  expandedKeys,
  defaultExpandedKeys = [],
  onExpand,
  open,
  defaultOpen = false,
  onOpenChange,
  allowClear = true,
  clearLabel,
  placeholder = 'Choose a node',
  popupLabel = 'Choose a node',
  emptyText = 'No nodes',
  container,
  name,
  form,
  disabled = false,
  className,
  classNames,
  dir,
  ref,
  onKeyDown,
  ...props
}: Props) => {
  const { direction, locale } = useConfig();
  const resolvedDirection = dir === 'ltr' || dir === 'rtl' ? dir : direction;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [internalExpanded, setInternalExpanded] =
    useState<readonly string[]>(defaultExpandedKeys);
  const selected = value === undefined ? internalValue : value;
  const isOpen = (open ?? internalOpen) && !disabled;
  const expanded = expandedKeys ?? internalExpanded;
  const tree = useRef<HTMLUListElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useImperativeHandle(ref, () => trigger.current!, []);
  const { Popover, PopoverTrigger, PopoverContent, PopoverTitle } = popover;
  const entries = new Map<string, { node: Node; isDisabled: boolean }>();
  const visit = (list: readonly Node[], isDisabled: boolean) => {
    for (const node of list) {
      const entry = { node, isDisabled: isDisabled || !!node.disabled };
      entries.set(node.key, entry);
      visit(node.children ?? [], entry.isDisabled);
    }
  };

  visit(nodes, disabled);

  const changeOpen = (next: boolean) => {
    if (disabled && next) return;
    if (open === undefined) setInternalOpen(next);
    if (next !== isOpen) onOpenChange?.(next);
  };
  const select = (next: string | null) => {
    const entry = next === null ? null : entries.get(next);

    if (disabled || (next !== null && (!entry || entry.isDisabled))) return;
    if (value === undefined) setInternalValue(next);
    if (next !== selected) onChange?.(next, entry?.node ?? null);

    changeOpen(false);
  };

  return (
    <DirectionProvider direction={resolvedDirection}>
      <div
        data-slot="tree-select"
        dir={resolvedDirection}
        className={cn(
          'flex w-full min-w-0 items-center gap-1',
          className, //
        )}
      >
        {name && (
          <input
            type="hidden"
            name={name}
            form={form}
            disabled={disabled}
            value={selected ?? ''}
          />
        )}
        <Popover open={isOpen} onOpenChange={changeOpen}>
          <PopoverTrigger
            {...props}
            ref={trigger}
            disabled={disabled}
            render={<Button variant="outlined" />}
            className={cn(
              'h-9 min-w-0 flex-1 justify-between text-start',
              classNames?.trigger, //
            )}
            onKeyDown={event => {
              onKeyDown?.(event);

              if (
                !event.defaultPrevented &&
                (event.key === 'ArrowDown' || event.key === 'ArrowUp')
              ) {
                event.preventDefault();
                changeOpen(true);
              }
            }}
          >
            <span
              className={cn(
                'min-w-0 truncate',
                selected === null && 'text-muted-foreground',
                classNames?.value, //
              )}
            >
              {selected === null
                ? placeholder
                : (entries.get(selected)?.node.label ?? selected)}
            </span>
            <ChevronDown aria-hidden="true" className="size-4 shrink-0" />
          </PopoverTrigger>
          <PopoverContent
            container={container}
            dir={resolvedDirection}
            align="start"
            initialFocus={() =>
              tree.current?.querySelector<HTMLElement>(
                '[role="treeitem"][aria-selected="true"]',
              ) ??
              tree.current?.querySelector<HTMLElement>(
                '[role="treeitem"][tabindex="0"]',
              ) ??
              true
            }
            className={cn(
              'w-(--anchor-width) max-w-(--available-width) p-2',
              classNames?.popup, //
            )}
          >
            <PopoverTitle className="sr-only">{popupLabel}</PopoverTitle>
            <Tree
              ref={tree}
              nodes={nodes}
              selectedKeys={selected === null ? [] : [selected]}
              onSelect={keys => select(keys[0] ?? null)}
              expandedKeys={expanded}
              onExpand={keys => {
                if (expandedKeys === undefined) setInternalExpanded(keys);
                onExpand?.(keys);
              }}
              emptyText={emptyText}
              aria-label={popupLabel}
              dir={resolvedDirection}
              className={cn(
                'max-h-[min(20rem,var(--available-height))] overflow-y-auto',
                classNames?.tree, //
              )}
              classNames={classNames?.nodes}
            />
          </PopoverContent>
        </Popover>
        {allowClear && selected !== null && (
          <Button
            variant="text"
            size="small"
            disabled={disabled}
            aria-label={clearLabel ?? locale.clear ?? DEFAULT_LOCALE.clear}
            onClick={() => {
              select(null);
              trigger.current?.focus();
            }}
            className={cn(
              'size-8 shrink-0 p-0',
              classNames?.clear, //
            )}
          >
            <X aria-hidden="true" className="size-4" />
          </Button>
        )}
      </div>
    </DirectionProvider>
  );
};

export default TreeSelect;
