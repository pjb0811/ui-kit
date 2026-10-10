'use client';

import {
  type ComponentPropsWithRef,
  type ReactNode,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { useControllableState } from '@jbpark/use-hooks';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import Button from '../atoms/button';
import Checkbox from '../atoms/checkbox';

export interface Node {
  key: string;
  label: string;
  icon?: ReactNode;
  children?: readonly Node[];
  disabled?: boolean;
}

export interface Props extends Omit<
  ComponentPropsWithRef<'ul'>,
  'children' | 'onSelect'
> {
  nodes: readonly Node[];
  expandedKeys?: readonly string[];
  defaultExpandedKeys?: readonly string[];
  onExpand?: (keys: string[]) => void;
  selectedKeys?: readonly string[];
  defaultSelectedKeys?: readonly string[];
  onSelect?: (keys: string[]) => void;
  multiple?: boolean;
  checkable?: boolean;
  checkedKeys?: readonly string[];
  defaultCheckedKeys?: readonly string[];
  onCheck?: (keys: string[]) => void;
  disabled?: boolean;
  emptyText?: ReactNode;
  classNames?: {
    item?: string;
    row?: string;
    group?: string;
    label?: string;
    icon?: string;
    toggle?: string;
    checkbox?: string;
    empty?: string;
  };
}

interface Entry {
  node: Node;
  ancestors: string[];
  isDisabled: boolean;
}

const Tree = ({
  nodes,
  expandedKeys,
  defaultExpandedKeys = [],
  onExpand,
  selectedKeys,
  defaultSelectedKeys = [],
  onSelect,
  multiple = false,
  checkable = false,
  checkedKeys,
  defaultCheckedKeys = [],
  onCheck,
  disabled = false,
  emptyText = 'No nodes',
  className,
  classNames,
  dir,
  ref,
  'aria-label': ariaLabel = 'Tree',
  ...props
}: Props) => {
  const { direction } = useConfig();
  const [expanded, setExpanded] = useControllableState<readonly string[]>({
    value: expandedKeys,
    defaultValue: defaultExpandedKeys,
    onChange: keys => onExpand?.([...keys]),
  });
  const [selected, setSelected] = useControllableState<readonly string[]>({
    value: selectedKeys,
    defaultValue: defaultSelectedKeys,
    onChange: keys => onSelect?.([...keys]),
  });
  const [checked, setChecked] = useControllableState<readonly string[]>({
    value: checkedKeys,
    defaultValue: defaultCheckedKeys,
    onChange: keys => onCheck?.([...keys]),
  });
  const [focused, setFocused] = useState<{
    key: string;
    ancestors: string[];
  } | null>(null);
  const focusedKey = focused?.key;
  const root = useRef<HTMLUListElement>(null);
  useImperativeHandle(ref, () => root.current!, []);

  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const hasFocus = useRef(false);
  const entries: Entry[] = [];
  const visit = (
    list: readonly Node[],
    ancestors: string[],
    isDisabled: boolean,
  ) => {
    for (const node of list) {
      const entry = {
        node,
        ancestors,
        isDisabled: isDisabled || !!node.disabled,
      };
      entries.push(entry);
      visit(node.children ?? [], [...ancestors, node.key], entry.isDisabled);
    }
  };

  visit(nodes, [], disabled);
  const byKey = new Map(entries.map(entry => [entry.node.key, entry]));
  const expandedSet = new Set(expanded);
  const selectedSet = new Set(multiple ? selected : selected.slice(0, 1));
  const visible = entries.filter(entry =>
    entry.ancestors.every(key => expandedSet.has(key)),
  );
  const visibleKeys = new Set(visible.map(entry => entry.node.key));
  const activeKey =
    focusedKey && visibleKeys.has(focusedKey)
      ? focusedKey
      : ([...(focused?.ancestors ?? [])]
          .reverse()
          .find(key => visibleKeys.has(key)) ?? visible[0]?.node.key);

  const getChecks = (keys: ReadonlySet<string>) => {
    const states = new Map<string, { isChecked: boolean; isMixed: boolean }>();
    const evaluate = (
      node: Node,
      isInherited: boolean,
    ): { isChecked: boolean; isMixed: boolean } => {
      const entry = byKey.get(node.key)!;
      const children = (node.children ?? []).map(child => ({
        node: child,
        state: evaluate(
          child,
          !entry.isDisabled && (isInherited || keys.has(node.key)),
        ),
      }));
      const enabled = children.filter(
        child => !byKey.get(child.node.key)?.isDisabled,
      );
      const isChecked = entry.isDisabled
        ? keys.has(node.key)
        : enabled.length
          ? enabled.every(child => child.state.isChecked)
          : isInherited || keys.has(node.key);
      const isMixed =
        !entry.isDisabled &&
        !isChecked &&
        enabled.some(child => child.state.isChecked || child.state.isMixed);
      const state = { isChecked, isMixed };
      states.set(node.key, state);

      return state;
    };

    for (const node of nodes) evaluate(node, false);

    return states;
  };
  const checks = getChecks(new Set(checked));

  const focus = (key: string | undefined) => {
    if (key) itemRefs.current.get(key)?.focus();
  };

  useLayoutEffect(() => {
    if (
      hasFocus.current &&
      activeKey &&
      root.current &&
      document.activeElement !== itemRefs.current.get(activeKey)
    ) {
      itemRefs.current.get(activeKey)?.focus();
    }
  }, [activeKey, nodes]);

  const expand = (entry: Entry) => {
    if (entry.isDisabled || !entry.node.children?.length) return;

    const next = new Set(expanded);

    if (next.has(entry.node.key)) next.delete(entry.node.key);
    else next.add(entry.node.key);

    setExpanded([...next]);
  };

  const select = (entry: Entry) => {
    if (entry.isDisabled) return;

    if (!multiple) {
      setSelected([entry.node.key]);

      return;
    }

    const next = new Set(selected);

    if (next.has(entry.node.key)) next.delete(entry.node.key);
    else next.add(entry.node.key);

    setSelected([...next]);
  };

  const check = (entry: Entry) => {
    if (entry.isDisabled) return;

    const next = new Set(
      checked.filter(key => !byKey.has(key) || byKey.get(key)?.isDisabled),
    );

    for (const item of entries) {
      if (!item.isDisabled && checks.get(item.node.key)?.isChecked)
        next.add(item.node.key);
    }

    for (const ancestor of entry.ancestors) next.delete(ancestor);

    const shouldCheck = !checks.get(entry.node.key)?.isChecked;

    for (const item of entries) {
      if (
        item.isDisabled ||
        (item.node.key !== entry.node.key &&
          !item.ancestors.includes(entry.node.key))
      )
        continue;

      if (shouldCheck) next.add(item.node.key);
      else next.delete(item.node.key);
    }

    const derived = getChecks(next);
    const result = entries
      .filter(item => derived.get(item.node.key)?.isChecked)
      .map(item => item.node.key);

    setChecked([
      ...new Set([...result, ...[...next].filter(key => !byKey.has(key))]),
    ]);
  };

  const renderNodes = (list: readonly Node[], level: number): ReactNode =>
    list.map((node, position) => {
      const entry = byKey.get(node.key)!;
      const hasChildren = !!node.children?.length;
      const isExpanded = expandedSet.has(node.key);
      const state = checks.get(node.key)!;

      return (
        <li
          key={node.key}
          ref={element => {
            if (element) itemRefs.current.set(node.key, element);
            else itemRefs.current.delete(node.key);
          }}
          data-slot="tree-item"
          data-key={node.key}
          role="treeitem"
          aria-label={node.label}
          aria-level={level}
          aria-posinset={position + 1}
          aria-setsize={list.length}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-selected={selectedSet.has(node.key)}
          aria-checked={
            checkable ? (state.isMixed ? 'mixed' : state.isChecked) : undefined
          }
          aria-disabled={entry.isDisabled || undefined}
          tabIndex={node.key === activeKey ? 0 : -1}
          className={cn(
            `focus-visible:ring-ring m-0 min-w-0 list-none rounded-sm
            outline-none focus-visible:ring-2`,
            classNames?.item, //
          )}
          onFocus={event => {
            if (event.target !== event.currentTarget) return;

            hasFocus.current = true;
            setFocused({ key: node.key, ancestors: entry.ancestors });
          }}
          onKeyDown={event => {
            if (event.target !== event.currentTarget) return;
            if (event.key === 'Escape' || event.key === 'Tab') return;

            event.stopPropagation();
            const position = visible.findIndex(
              item => item.node.key === node.key,
            );
            const isRTL =
              getComputedStyle(event.currentTarget).direction === 'rtl';
            const forward = isRTL ? 'ArrowLeft' : 'ArrowRight';
            const backward = isRTL ? 'ArrowRight' : 'ArrowLeft';

            if (
              [
                'ArrowDown',
                'ArrowUp',
                'Home',
                'End',
                forward,
                backward,
                'Enter',
                ' ',
              ].includes(event.key)
            )
              event.preventDefault();

            if (event.key === 'ArrowDown')
              focus(
                visible[Math.min(position + 1, visible.length - 1)]?.node.key,
              );
            else if (event.key === 'ArrowUp')
              focus(visible[Math.max(position - 1, 0)]?.node.key);
            else if (event.key === 'Home') focus(visible[0]?.node.key);
            else if (event.key === 'End') focus(visible.at(-1)?.node.key);
            else if (event.key === forward && hasChildren) {
              if (!isExpanded) expand(entry);
              else focus(node.children?.[0]?.key);
            } else if (event.key === backward) {
              if (hasChildren && isExpanded && !entry.isDisabled) expand(entry);
              else focus(entry.ancestors.at(-1));
            } else if (event.key === 'Enter') select(entry);
            else if (event.key === ' ') {
              if (checkable) check(entry);
              else select(entry);
            } else if (
              event.key.length === 1 &&
              !event.ctrlKey &&
              !event.metaKey &&
              !event.altKey
            ) {
              const candidates = [
                ...visible.slice(position + 1),
                ...visible.slice(0, position + 1),
              ];
              focus(
                candidates.find(item =>
                  item.node.label
                    .toLocaleLowerCase()
                    .startsWith(event.key.toLocaleLowerCase()),
                )?.node.key,
              );
            }
          }}
        >
          <div
            data-slot="tree-row"
            className={cn(
              'flex min-w-0 items-center gap-2 rounded-sm px-2 py-1.5 text-sm',
              selectedSet.has(node.key) && 'bg-accent text-accent-foreground',
              entry.isDisabled && 'cursor-not-allowed opacity-50',
              !entry.isDisabled && 'hover:bg-accent/50 cursor-pointer',
              classNames?.row, //
            )}
            onClick={() => {
              focus(node.key);
              select(entry);
            }}
          >
            {hasChildren ? (
              <Button
                tabIndex={-1}
                aria-hidden="true"
                variant="text"
                size="small"
                disabled={entry.isDisabled}
                className={cn(
                  'size-5 shrink-0 p-0',
                  classNames?.toggle, //
                )}
                onMouseDown={event => event.preventDefault()}
                onClick={event => {
                  event.stopPropagation();
                  focus(node.key);
                  expand(entry);
                }}
              >
                {isExpanded ? (
                  <ChevronDown />
                ) : (dir ?? direction) === 'rtl' ? (
                  <ChevronLeft />
                ) : (
                  <ChevronRight />
                )}
              </Button>
            ) : (
              <span aria-hidden="true" className="size-5 shrink-0" />
            )}
            {checkable && (
              <span
                data-slot="tree-check"
                className={cn(
                  'shrink-0',
                  classNames?.checkbox, //
                )}
                onClick={event => {
                  event.stopPropagation();
                  focus(node.key);
                  check(entry);
                }}
              >
                <span aria-hidden="true" inert className="pointer-events-none">
                  <Checkbox
                    checked={state.isChecked}
                    indeterminate={state.isMixed}
                    disabled={entry.isDisabled}
                  />
                </span>
              </span>
            )}
            {node.icon != null && (
              <span
                aria-hidden="true"
                className={cn(
                  'flex shrink-0 [&>svg]:size-4',
                  classNames?.icon, //
                )}
              >
                {node.icon}
              </span>
            )}
            <span
              className={cn(
                'min-w-0 [overflow-wrap:anywhere]',
                classNames?.label, //
              )}
            >
              {node.label}
            </span>
          </div>
          {hasChildren && isExpanded && (
            <ul
              role="group"
              className={cn(
                'border-border m-0 ms-4 list-none border-s ps-2',
                classNames?.group, //
              )}
            >
              {renderNodes(node.children!, level + 1)}
            </ul>
          )}
        </li>
      );
    });

  return (
    <ul
      {...props}
      ref={root}
      dir={dir ?? direction}
      data-slot="tree"
      role="tree"
      aria-label={ariaLabel}
      aria-multiselectable={multiple || undefined}
      className={cn(
        'text-foreground m-0 min-w-0 list-none p-0',
        className, //
      )}
      onBlur={event => {
        hasFocus.current =
          !!event.relatedTarget &&
          event.currentTarget.contains(event.relatedTarget);
        props.onBlur?.(event);
      }}
    >
      {renderNodes(nodes, 1)}
      {!nodes.length && (
        <li
          role="none"
          className={cn(
            'text-muted-foreground p-3 text-sm',
            classNames?.empty, //
          )}
        >
          {emptyText}
        </li>
      )}
    </ul>
  );
};

export default Tree;
