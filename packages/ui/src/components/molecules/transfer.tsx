'use client';

import {
  type ComponentPropsWithRef,
  type ReactNode,
  useId,
  useState,
} from 'react';

import { cn } from '@repo/ui/utils';

import Button from '../atoms/button';
import Checkbox from '../atoms/checkbox';
import Input from '../atoms/input';

export interface Item {
  key: string;
  label: string;
  description?: ReactNode;
  disabled?: boolean;
}

export interface Props extends Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'onChange'
> {
  /** Stable, unique keys; both panels follow this array's order. */
  items: readonly Item[];
  targetKeys: readonly string[];
  onChange?: (targetKeys: string[]) => void;
  disabled?: boolean;
  searchable?: boolean;
  titles?: readonly [string, string];
  moveLabels?: readonly [string, string];
  selectAllLabel?: string;
  searchLabel?: string;
  emptyText?: ReactNode;
  /** Visible / total / visible selected counts, also used by the live region. */
  formatCount?: (visible: number, total: number, selected: number) => string;
  classNames?: {
    panel?: string;
    header?: string;
    search?: string;
    list?: string;
    item?: string;
    actions?: string;
    empty?: string;
  };
}

const defaultFormatCount = (visible: number, total: number, selected: number) =>
  `${visible} of ${total} items, ${selected} selected`;

const Transfer = ({
  items,
  targetKeys,
  onChange,
  disabled = false,
  searchable = false,
  titles = ['Available', 'Chosen'],
  moveLabels = ['Move to chosen', 'Move to available'],
  selectAllLabel = 'Select all visible items',
  searchLabel = 'Search',
  emptyText = 'No items',
  formatCount = defaultFormatCount,
  className,
  classNames,
  ...props
}: Props) => {
  const id = useId();
  const [queries, setQueries] = useState(['', '']);
  const [selections, setSelections] = useState<Set<string>[]>([
    new Set(),
    new Set(),
  ]);
  const targets = new Set(targetKeys);
  const panels = [false, true].map((isTarget, index) => {
    const all = items.filter(item => targets.has(item.key) === isTarget);
    const query = searchable
      ? (queries[index] ?? '').trim().toLocaleLowerCase()
      : '';
    const visible = all.filter(item =>
      item.label.toLocaleLowerCase().includes(query),
    );
    const enabled = visible.filter(item => !item.disabled);
    const selected = enabled.filter(item => selections[index]?.has(item.key));

    return { all, visible, enabled, selected };
  });

  const select = (index: number, keys: string[], checked: boolean) => {
    setSelections(current =>
      current.map((selection, panel) => {
        if (panel !== index) return selection;

        const next = new Set(selection);

        for (const key of keys) {
          if (checked) next.add(key);
          else next.delete(key);
        }

        return next;
      }),
    );
  };

  const move = (index: number) => {
    const selected = panels[index]?.selected ?? [];

    if (disabled || !selected.length) return;

    const moved = new Set(selected.map(item => item.key));
    const next = new Set(targetKeys);

    for (const key of moved) {
      if (index === 0) next.add(key);
      else next.delete(key);
    }

    onChange?.([...next]);
    setSelections(current =>
      current.map(
        selection => new Set([...selection].filter(key => !moved.has(key))),
      ),
    );
  };

  return (
    <div
      {...props}
      data-slot="transfer"
      className={cn(
        `text-foreground grid min-w-0 grid-cols-1 items-center gap-3
        sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]`,
        className, //
      )}
    >
      {panels.map((panel, index) => (
        <section
          key={index}
          data-slot="transfer-panel"
          aria-labelledby={`${id}-title-${index}`}
          className={cn(
            'border-border bg-background min-w-0 rounded-md border',
            index === 1 && 'sm:col-start-3 sm:row-start-1',
            classNames?.panel, //
          )}
        >
          <div
            className={cn(
              'border-border border-b p-3',
              classNames?.header, //
            )}
          >
            <h3 id={`${id}-title-${index}`} className="m-0 text-sm font-medium">
              {titles[index]}
            </h3>
            <p
              id={`${id}-count-${index}`}
              className="text-muted-foreground m-0 mt-1 text-xs"
            >
              {formatCount(
                panel.visible.length,
                panel.all.length,
                panel.selected.length,
              )}
            </p>
            <Checkbox
              className="mt-3 text-sm"
              checked={
                panel.enabled.length > 0 &&
                panel.selected.length === panel.enabled.length
              }
              disabled={disabled || !panel.enabled.length}
              onChange={checked =>
                select(
                  index,
                  panel.enabled.map(item => item.key),
                  checked,
                )
              }
            >
              {selectAllLabel}
            </Checkbox>
          </div>
          {searchable && (
            <div className="p-3 pb-0">
              <Input
                type="search"
                aria-label={`${searchLabel} ${titles[index]}`}
                aria-controls={`${id}-list-${index}`}
                value={queries[index] ?? ''}
                disabled={disabled}
                onChange={event => {
                  const value = event.target.value;

                  setQueries(current =>
                    current.map((query, panelIndex) =>
                      panelIndex === index ? value : query,
                    ),
                  );
                }}
                className={classNames?.search}
              />
            </div>
          )}
          <ul
            id={`${id}-list-${index}`}
            data-slot="transfer-list"
            aria-labelledby={`${id}-title-${index}`}
            aria-describedby={`${id}-count-${index}`}
            role="list"
            className={cn(
              'm-0 h-64 list-none overflow-y-auto p-3',
              classNames?.list, //
            )}
          >
            {panel.visible.map(item => (
              <li
                key={item.key}
                data-slot="transfer-item"
                data-key={item.key}
                className={cn(
                  'min-w-0 py-2 text-sm [overflow-wrap:anywhere]',
                  classNames?.item, //
                )}
              >
                <Checkbox
                  checked={
                    !item.disabled &&
                    (selections[index]?.has(item.key) ?? false)
                  }
                  disabled={disabled || item.disabled}
                  onChange={checked => select(index, [item.key], checked)}
                >
                  {item.label}
                </Checkbox>
                {item.description != null && (
                  <div className="text-muted-foreground ms-6 mt-1 text-xs">
                    {item.description}
                  </div>
                )}
              </li>
            ))}
            {!panel.visible.length && (
              <li
                className={cn(
                  'text-muted-foreground py-6 text-center text-sm',
                  classNames?.empty, //
                )}
              >
                {emptyText}
              </li>
            )}
          </ul>
        </section>
      ))}
      <div
        data-slot="transfer-actions"
        className={cn(
          `row-start-2 flex flex-wrap justify-center gap-2 sm:col-start-2
          sm:row-start-1 sm:flex-col`,
          classNames?.actions, //
        )}
      >
        {panels.map((panel, index) => (
          <Button
            key={index}
            variant="outlined"
            size="small"
            disabled={disabled || !panel.selected.length}
            onClick={() => move(index)}
          >
            {moveLabels[index]}
          </Button>
        ))}
      </div>
      <span
        data-slot="transfer-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {panels
          .map(
            (panel, index) =>
              `${titles[index]}: ${formatCount(panel.visible.length, panel.all.length, panel.selected.length)}`,
          )
          .join('. ')}
      </span>
    </div>
  );
};

export default Transfer;
