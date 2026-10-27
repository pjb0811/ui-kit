'use client';

import {
  type CSSProperties,
  type ComponentPropsWithRef,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  useControllableState,
  useLatest,
  useResizeObserver,
} from '@jbpark/use-hooks';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Loader2,
} from 'lucide-react';

import { DEFAULT_LOCALE, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import Button from '../atoms/button';
import Checkbox from '../atoms/checkbox';

export interface Node {
  key: string;
  label: string;
  icon?: ReactNode;
  children?: readonly Node[];
  disabled?: boolean;
  // Overrides branch detection: `false` makes a branch whose children may
  // not be loaded yet, `true` makes a leaf and ignores `children`.
  leaf?: boolean;
}

export interface ExpandInfo {
  node: Node;
  expanded: boolean;
}

export interface LoadOptions {
  signal: AbortSignal;
}

export interface ScrollOptions {
  align?: 'auto' | 'start' | 'center' | 'end';
}

export interface Actions {
  // Scrolls a visible node into view; returns false when the key is not
  // visible because it is unknown or inside a collapsed branch.
  scrollTo: (key: string, options?: ScrollOptions) => boolean;
}

export interface Props extends Omit<
  ComponentPropsWithRef<'ul'>,
  'children' | 'onSelect'
> {
  nodes: readonly Node[];
  expandedKeys?: readonly string[];
  defaultExpandedKeys?: readonly string[];
  onExpand?: (keys: string[], info: ExpandInfo) => void;
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
  loadData?: (node: Node, options: LoadOptions) => Promise<void>;
  expandOnClick?: boolean;
  virtual?: boolean;
  height?: CSSProperties['height'];
  itemHeight?: number;
  overscan?: number;
  actionRef?: Ref<Actions>;
  classNames?: {
    item?: string;
    row?: string;
    group?: string;
    label?: string;
    icon?: string;
    toggle?: string;
    checkbox?: string;
    status?: string;
    retry?: string;
    empty?: string;
  };
}

interface Entry {
  node: Node;
  children: readonly Node[];
  ancestors: string[];
  index: number;
  level: number;
  position: number;
  setSize: number;
  isBranch: boolean;
  isDisabled: boolean;
}

interface CheckState {
  isChecked: boolean;
  isMixed: boolean;
}

type LoadStatus = 'pending' | 'error' | 'loaded';

const INDENT_REM = 1.5;

const isBranchNode = (node: Node) =>
  node.leaf === undefined ? !!node.children?.length : !node.leaf;

const isUnloaded = (entry: Entry) =>
  entry.isBranch && entry.node.children === undefined;

const deriveChecks = (
  roots: readonly Node[],
  byKey: ReadonlyMap<string, Entry>,
  keys: ReadonlySet<string>,
) => {
  const states = new Map<string, CheckState>();
  const evaluate = (node: Node, isInherited: boolean): CheckState => {
    const entry = byKey.get(node.key)!;
    const children = entry.children.map(child => ({
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

  for (const node of roots) {
    evaluate(node, false);
  }

  return states;
};

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
  loadData,
  expandOnClick = false,
  virtual = false,
  height,
  itemHeight = 32,
  overscan = 8,
  actionRef,
  className,
  classNames,
  style,
  dir,
  ref,
  'aria-label': ariaLabel = 'Tree',
  ...props
}: Props) => {
  const { direction, locale } = useConfig();
  const id = useId();
  const [expanded, setExpanded] = useControllableState<readonly string[]>({
    value: expandedKeys,
    defaultValue: defaultExpandedKeys,
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
  const [loadStatus, setLoadStatus] = useState<ReadonlyMap<string, LoadStatus>>(
    () => new Map(),
  );
  const controllers = useRef(new Map<string, AbortController>());
  const latestLoadData = useLatest(loadData);
  const [scrollTop, setScrollTop] = useState(0);
  const [observe, size] = useResizeObserver<HTMLUListElement>();
  const root = useRef<HTMLUListElement>(null);

  useImperativeHandle(ref, () => root.current!, []);

  const setRoot = useCallback(
    (element: HTMLUListElement | null) => {
      root.current = element;
      observe(virtual ? element : null);
    },
    [observe, virtual],
  );

  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const hasFocus = useRef(false);

  const { entries, byKey } = useMemo(() => {
    const list: Entry[] = [];
    const visit = (
      siblings: readonly Node[],
      ancestors: string[],
      isDisabled: boolean,
    ) => {
      siblings.forEach((node, position) => {
        const isBranch = isBranchNode(node);
        const entry: Entry = {
          node,
          children: isBranch ? (node.children ?? []) : [],
          ancestors,
          index: list.length,
          level: ancestors.length + 1,
          position: position + 1,
          setSize: siblings.length,
          isBranch,
          isDisabled: isDisabled || !!node.disabled,
        };

        list.push(entry);
        visit(entry.children, [...ancestors, node.key], entry.isDisabled);
      });
    };

    visit(nodes, [], disabled);

    return {
      entries: list,
      byKey: new Map(list.map(entry => [entry.node.key, entry])),
    };
  }, [nodes, disabled]);
  const expandedSet = useMemo(() => new Set(expanded), [expanded]);
  const visible = useMemo(() => {
    const shown = new Set<string>();

    return entries.filter(entry => {
      const parent = entry.ancestors.at(-1);

      if (
        parent !== undefined &&
        !(shown.has(parent) && expandedSet.has(parent))
      ) {
        return false;
      }

      shown.add(entry.node.key);

      return true;
    });
  }, [entries, expandedSet]);
  const visibleIndex = useMemo(
    () => new Map(visible.map((entry, index) => [entry.node.key, index])),
    [visible],
  );
  const selectedSet = new Set(multiple ? selected : selected.slice(0, 1));
  const activeKey =
    focusedKey && visibleIndex.has(focusedKey)
      ? focusedKey
      : ([...(focused?.ancestors ?? [])]
          .reverse()
          .find(key => visibleIndex.has(key)) ?? visible[0]?.node.key);
  const checks = useMemo(
    () =>
      checkable
        ? deriveChecks(nodes, byKey, new Set(checked))
        : new Map<string, CheckState>(),
    [checkable, nodes, byKey, checked],
  );
  const hasLoadData = !!loadData;

  // Starts loads for expanded, visible branches without children, and drops
  // load state for nodes that were removed or received children.
  useEffect(() => {
    const stale = [...loadStatus.keys()].filter(key => {
      const entry = byKey.get(key);

      return !entry || !isUnloaded(entry);
    });
    const targets = hasLoadData
      ? visible.filter(
          entry =>
            isUnloaded(entry) &&
            expandedSet.has(entry.node.key) &&
            !loadStatus.has(entry.node.key) &&
            !controllers.current.has(entry.node.key),
        )
      : [];

    if (!stale.length && !targets.length) {
      return;
    }

    for (const key of stale) {
      controllers.current.get(key)?.abort();
      controllers.current.delete(key);
    }

    for (const entry of targets) {
      const { key } = entry.node;
      const controller = new AbortController();
      const settle = (status: LoadStatus) => {
        if (
          controller.signal.aborted ||
          controllers.current.get(key) !== controller
        ) {
          return;
        }

        controllers.current.delete(key);
        setLoadStatus(current => new Map(current).set(key, status));
      };

      controllers.current.set(key, controller);
      Promise.resolve()
        .then(() =>
          latestLoadData.current?.(entry.node, { signal: controller.signal }),
        )
        .then(
          () => settle('loaded'),
          () => settle('error'),
        );
    }

    setLoadStatus(current => {
      const next = new Map(current);

      for (const key of stale) {
        next.delete(key);
      }

      for (const entry of targets) {
        next.set(entry.node.key, 'pending');
      }

      return next;
    });
  }, [byKey, visible, expandedSet, loadStatus, hasLoadData, latestLoadData]);

  useEffect(() => {
    const pending = controllers.current;

    return () => {
      for (const controller of pending.values()) {
        controller.abort();
      }

      pending.clear();
    };
  }, []);

  const viewportHeight =
    size?.height ?? (typeof height === 'number' ? height : itemHeight * 10);

  const scrollTo = (key: string, { align = 'auto' }: ScrollOptions = {}) => {
    const index = visibleIndex.get(key);
    const element = root.current;

    if (index === undefined || !element) {
      return false;
    }

    if (!virtual) {
      itemRefs.current.get(key)?.firstElementChild?.scrollIntoView({
        block: align === 'auto' ? 'nearest' : align,
      });

      return true;
    }

    const top = index * itemHeight;
    const bottom = top + itemHeight;
    const viewport = element.clientHeight;
    const next =
      align === 'start'
        ? top
        : align === 'end'
          ? bottom - viewport
          : align === 'center'
            ? top - (viewport - itemHeight) / 2
            : top < element.scrollTop
              ? top
              : bottom > element.scrollTop + viewport
                ? bottom - viewport
                : element.scrollTop;

    element.scrollTop = Math.max(0, next);
    setScrollTop(element.scrollTop);

    return true;
  };

  useImperativeHandle(actionRef, () => ({ scrollTo }));

  const focus = (key: string | undefined) => {
    if (!key) {
      return;
    }

    if (virtual) {
      scrollTo(key);
    }

    const element = itemRefs.current.get(key);
    const entry = byKey.get(key);

    if (element) {
      element.focus({ preventScroll: virtual });
    } else if (entry) {
      // Virtual rows outside the window mount once they become active.
      setFocused({ key, ancestors: entry.ancestors });
    }
  };

  useLayoutEffect(() => {
    if (
      hasFocus.current &&
      activeKey &&
      root.current &&
      document.activeElement !== itemRefs.current.get(activeKey)
    ) {
      itemRefs.current.get(activeKey)?.focus({ preventScroll: virtual });
    }
  }, [activeKey, nodes, virtual]);

  const clearStatus = (key: string) =>
    setLoadStatus(current => {
      const next = new Map(current);

      next.delete(key);

      return next;
    });

  const expand = (entry: Entry) => {
    if (entry.isDisabled || !entry.isBranch) {
      return;
    }

    const { key } = entry.node;
    const isOpening = !expandedSet.has(key);
    const next = new Set(expanded);

    if (isOpening) {
      next.add(key);
    } else {
      next.delete(key);
    }

    if (isOpening && loadStatus.get(key) === 'error') {
      clearStatus(key);
    }

    const keys = [...next];

    setExpanded(keys);
    onExpand?.([...keys], { node: entry.node, expanded: isOpening });
  };

  const retry = (entry: Entry) => {
    if (entry.isDisabled) {
      return;
    }

    if (expandedSet.has(entry.node.key)) {
      clearStatus(entry.node.key);
    } else {
      expand(entry);
    }
  };

  const select = (entry: Entry) => {
    if (entry.isDisabled) {
      return;
    }

    if (!multiple) {
      setSelected([entry.node.key]);

      return;
    }

    const next = new Set(selected);

    if (next.has(entry.node.key)) {
      next.delete(entry.node.key);
    } else {
      next.add(entry.node.key);
    }

    setSelected([...next]);
  };

  const check = (entry: Entry) => {
    if (entry.isDisabled) {
      return;
    }

    const next = new Set(
      checked.filter(key => !byKey.has(key) || byKey.get(key)?.isDisabled),
    );

    for (const item of entries) {
      if (!item.isDisabled && checks.get(item.node.key)?.isChecked) {
        next.add(item.node.key);
      }
    }

    for (const ancestor of entry.ancestors) {
      next.delete(ancestor);
    }

    const shouldCheck = !checks.get(entry.node.key)?.isChecked;

    for (const item of entries) {
      if (
        item.isDisabled ||
        (item.node.key !== entry.node.key &&
          !item.ancestors.includes(entry.node.key))
      ) {
        continue;
      }

      if (shouldCheck) {
        next.add(item.node.key);
      } else {
        next.delete(item.node.key);
      }
    }

    const derived = deriveChecks(nodes, byKey, next);
    const result = entries
      .filter(item => derived.get(item.node.key)?.isChecked)
      .map(item => item.node.key);

    setChecked([
      ...new Set([...result, ...[...next].filter(key => !byKey.has(key))]),
    ]);
  };

  const loadingLabel = locale.loading ?? DEFAULT_LOCALE.loading;
  const loadFailedLabel = locale.loadFailed ?? DEFAULT_LOCALE.loadFailed;
  const retryLabel = locale.retry ?? DEFAULT_LOCALE.retry;

  const renderItem = (entry: Entry, virtualIndex = 0): ReactNode => {
    const { node } = entry;
    const isExpanded = expandedSet.has(node.key);
    const status = loadStatus.get(node.key);
    const isPending = status === 'pending';
    const isFailed = status === 'error';
    const state = checks.get(node.key);
    const statusId = `${id}-status-${entry.index}`;

    return (
      <li
        key={node.key}
        ref={element => {
          if (element) {
            itemRefs.current.set(node.key, element);
          } else {
            itemRefs.current.delete(node.key);
          }
        }}
        data-slot="tree-item"
        data-key={node.key}
        role="treeitem"
        aria-label={node.label}
        aria-level={entry.level}
        aria-posinset={entry.position}
        aria-setsize={entry.setSize}
        aria-expanded={entry.isBranch ? isExpanded : undefined}
        aria-selected={selectedSet.has(node.key)}
        aria-checked={
          checkable && state
            ? state.isMixed
              ? 'mixed'
              : state.isChecked
            : undefined
        }
        aria-disabled={entry.isDisabled || undefined}
        aria-busy={isPending || undefined}
        aria-describedby={isPending || isFailed ? statusId : undefined}
        tabIndex={node.key === activeKey ? 0 : -1}
        style={
          virtual
            ? { top: virtualIndex * itemHeight, height: itemHeight }
            : undefined
        }
        className={cn(
          `m-0 min-w-0 list-none rounded-sm outline-none focus-visible:ring-2
          focus-visible:ring-ring`,
          virtual && 'absolute inset-x-0 focus-visible:ring-inset',
          classNames?.item, //
        )}
        onFocus={event => {
          if (event.target !== event.currentTarget) {
            return;
          }

          hasFocus.current = true;
          setFocused({ key: node.key, ancestors: entry.ancestors });
        }}
        onKeyDown={event => {
          if (event.target !== event.currentTarget) {
            return;
          }

          if (event.key === 'Escape' || event.key === 'Tab') {
            return;
          }

          event.stopPropagation();
          const position = visibleIndex.get(node.key) ?? 0;
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
          ) {
            event.preventDefault();
          }

          if (event.key === 'ArrowDown') {
            focus(
              visible[Math.min(position + 1, visible.length - 1)]?.node.key,
            );
          } else if (event.key === 'ArrowUp') {
            focus(visible[Math.max(position - 1, 0)]?.node.key);
          } else if (event.key === 'Home') {
            focus(visible[0]?.node.key);
          } else if (event.key === 'End') {
            focus(visible.at(-1)?.node.key);
          } else if (event.key === forward && entry.isBranch) {
            if (!isExpanded) {
              expand(entry);
            } else if (isFailed) {
              retry(entry);
            } else {
              focus(entry.children[0]?.key);
            }
          } else if (event.key === backward) {
            if (entry.isBranch && isExpanded && !entry.isDisabled) {
              expand(entry);
            } else {
              focus(entry.ancestors.at(-1));
            }
          } else if (event.key === 'Enter') {
            select(entry);
          } else if (event.key === ' ') {
            if (checkable) {
              check(entry);
            } else {
              select(entry);
            }
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
          style={
            virtual
              ? {
                  paddingInlineStart: `${(entry.level - 1) * INDENT_REM + 0.5}rem`,
                }
              : undefined
          }
          className={cn(
            'flex min-w-0 items-center gap-2 rounded-sm px-2 py-1.5 text-sm',
            virtual && 'h-full py-0',
            selectedSet.has(node.key) && 'bg-accent text-accent-foreground',
            entry.isDisabled && 'cursor-not-allowed opacity-50',
            !entry.isDisabled && 'cursor-pointer hover:bg-accent/50',
            classNames?.row, //
          )}
          onClick={() => {
            focus(node.key);

            if (expandOnClick && entry.isBranch) {
              expand(entry);
            }

            select(entry);
          }}
        >
          {entry.isBranch ? (
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
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : isExpanded ? (
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
          {checkable && state && (
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
              'min-w-0',
              virtual ? 'truncate' : '[overflow-wrap:anywhere]',
              classNames?.label, //
            )}
          >
            {node.label}
          </span>
          {isPending && (
            <span id={statusId} className="sr-only">
              {loadingLabel}
            </span>
          )}
          {isFailed && (
            <>
              <span
                id={statusId}
                data-slot="tree-status"
                className={cn(
                  'flex shrink-0 items-center gap-1 text-xs text-destructive',
                  classNames?.status, //
                )}
              >
                <CircleAlert aria-hidden="true" className="size-3.5" />
                {loadFailedLabel}
              </span>
              <Button
                tabIndex={-1}
                aria-hidden="true"
                variant="text"
                size="small"
                className={cn(
                  'h-6 shrink-0 px-1.5 text-xs',
                  classNames?.retry, //
                )}
                onMouseDown={event => event.preventDefault()}
                onClick={event => {
                  event.stopPropagation();
                  focus(node.key);
                  retry(entry);
                }}
              >
                {retryLabel}
              </Button>
            </>
          )}
        </div>
        {!virtual && isExpanded && entry.children.length > 0 && (
          <ul
            role="group"
            className={cn(
              'm-0 ms-4 list-none border-s border-border ps-2',
              classNames?.group, //
            )}
          >
            {renderNodes(entry.children)}
          </ul>
        )}
      </li>
    );
  };

  const renderNodes = (list: readonly Node[]): ReactNode =>
    list.map(node => renderItem(byKey.get(node.key)!));

  const renderWindow = () => {
    const first = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const last = Math.min(
      visible.length,
      Math.ceil((scrollTop + viewportHeight) / itemHeight) + overscan,
    );
    const indices: number[] = [];
    const activeIndex = activeKey ? visibleIndex.get(activeKey) : undefined;

    // The active row stays mounted outside the window so it keeps DOM focus
    // and remains the tree's tab stop.
    if (activeIndex !== undefined && activeIndex < first) {
      indices.push(activeIndex);
    }

    for (let index = first; index < last; index++) {
      indices.push(index);
    }

    if (activeIndex !== undefined && activeIndex >= last) {
      indices.push(activeIndex);
    }

    return (
      <>
        <li
          role="none"
          aria-hidden="true"
          style={{ height: visible.length * itemHeight }}
          className="pointer-events-none m-0 list-none"
        />
        {indices.map(index => renderItem(visible[index]!, index))}
      </>
    );
  };

  return (
    <ul
      {...props}
      ref={setRoot}
      dir={dir ?? direction}
      data-slot="tree"
      data-virtual={virtual || undefined}
      role="tree"
      aria-label={ariaLabel}
      aria-multiselectable={multiple || undefined}
      style={virtual ? { height, ...style } : style}
      className={cn(
        'm-0 min-w-0 list-none p-0 text-foreground',
        virtual && 'relative overflow-auto',
        className, //
      )}
      onScroll={event => {
        if (virtual) {
          setScrollTop(event.currentTarget.scrollTop);
        }

        props.onScroll?.(event);
      }}
      onBlur={event => {
        hasFocus.current =
          !!event.relatedTarget &&
          event.currentTarget.contains(event.relatedTarget);
        props.onBlur?.(event);
      }}
    >
      {virtual ? renderWindow() : renderNodes(nodes)}
      {!nodes.length && (
        <li
          role="none"
          className={cn(
            'p-3 text-sm text-muted-foreground',
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
