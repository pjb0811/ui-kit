'use client';

import { type ComponentPropsWithRef, useId, useState } from 'react';

import { DirectionProvider } from '@base-ui/react/direction-provider';
import { ChevronDown, X } from 'lucide-react';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import Button from './button';
import Popover from './popover';
import Select from './select';

export interface Option {
  /** Unique among siblings. Values can repeat under different parents. */
  value: string;
  label: string;
  disabled?: boolean;
  /** Missing or empty children make this option a selectable leaf. */
  children?: readonly Option[];
}

export interface Props extends Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'value' | 'defaultValue' | 'onChange'
> {
  options: readonly Option[];
  value?: readonly string[];
  defaultValue?: readonly string[];
  onChange?: (path: string[]) => void;
  disabled?: boolean;
  allowClear?: boolean;
  placeholder?: string;
  backLabel?: string;
  clearLabel?: string;
  emptyText?: string;
  getLevelLabel?: (level: number) => string;
  classNames?: {
    trigger?: string;
    popup?: string;
    breadcrumb?: string;
    select?: string;
    clear?: string;
  };
}

const resolvePath = (options: readonly Option[], path: readonly string[]) => {
  const result: Option[] = [];
  let siblings = options;

  for (const value of path) {
    const option = siblings.find(
      item => item.value === value && !item.disabled,
    );

    if (!option) {
      break;
    }

    result.push(option);
    siblings = option.children ?? [];
  }

  return result;
};

const Cascader = ({
  options,
  value,
  defaultValue = [],
  onChange,
  disabled = false,
  allowClear = true,
  placeholder = 'Choose a path',
  backLabel = 'Back',
  clearLabel = 'Clear selection',
  emptyText = 'No options',
  getLevelLabel = level => `Level ${level}`,
  className,
  classNames,
  dir,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...props
}: Props) => {
  const [internalValue, setInternalValue] =
    useState<readonly string[]>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [browsePath, setBrowsePath] = useState<string[]>([]);
  const selectedPath = value ?? internalValue;
  const selectedNodes = resolvePath(options, selectedPath);
  const lastSelected = selectedNodes.at(-1);
  const hasSelection =
    selectedPath.length > 0 &&
    selectedNodes.length === selectedPath.length &&
    !lastSelected?.children?.length;
  const selectedText = hasSelection
    ? selectedNodes.map(node => node.label).join(' / ')
    : placeholder;
  const resolvedBrowse = resolvePath(options, browsePath);
  const activeNodes =
    resolvedBrowse.length === browsePath.length &&
    (browsePath.length === 0 || resolvedBrowse.at(-1)?.children?.length)
      ? resolvedBrowse
      : [];
  const activePath = activeNodes.map(node => node.value);
  const currentOptions = activeNodes.at(-1)?.children ?? options;
  const level = activePath.length + 1;
  const { direction } = useConfig();
  const resolvedDirection = dir === 'ltr' || dir === 'rtl' ? dir : direction;
  const statusId = useId();

  const commit = (path: string[]) => {
    if (disabled) {
      return;
    }

    if (value === undefined) {
      setInternalValue(path);
    }

    if (
      path.length !== selectedPath.length ||
      path.some((part, index) => part !== selectedPath[index])
    ) {
      onChange?.(path);
    }

    setIsOpen(false);
  };

  const changeOpen = (open: boolean) => {
    if (open && disabled) {
      return;
    }

    if (open) {
      setBrowsePath(hasSelection ? [...selectedPath.slice(0, -1)] : []);
    }

    setIsOpen(open);
  };

  return (
    <DirectionProvider direction={resolvedDirection}>
      <div
        {...props}
        data-slot="cascader"
        dir={dir ?? resolvedDirection}
        className={cn(
          'flex w-full min-w-0 items-center gap-1',
          className, //
        )}
      >
        <Popover
          open={isOpen && !disabled}
          onOpenChange={changeOpen}
          placement="bottomLeft"
          title={ariaLabel ?? placeholder}
          dir={resolvedDirection}
          className={cn(
            'w-72 max-w-[calc(100vw-2rem)] p-3',
            classNames?.popup, //
          )}
          content={
            <div data-slot="cascader-panel" className="min-w-0 space-y-3">
              <div
                data-slot="cascader-breadcrumb"
                aria-live="polite"
                className={cn(
                  'text-muted-foreground text-sm [overflow-wrap:anywhere]',
                  classNames?.breadcrumb, //
                )}
              >
                {activeNodes.length
                  ? activeNodes.map(node => node.label).join(' / ')
                  : getLevelLabel(1)}
              </div>
              {activePath.length > 0 && (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setBrowsePath(activePath.slice(0, -1))}
                >
                  {backLabel}
                </Button>
              )}
              {currentOptions.length ? (
                <Select
                  value={null}
                  dir={resolvedDirection}
                  aria-label={getLevelLabel(level)}
                  placeholder={getLevelLabel(level)}
                  className={cn(
                    'w-full max-w-full',
                    classNames?.select, //
                  )}
                  options={currentOptions.map(option => ({
                    label: option.label,
                    value: option.value,
                    disabled: option.disabled,
                  }))}
                  onChange={next => {
                    const option = currentOptions.find(
                      item => item.value === next && !item.disabled,
                    );

                    if (!option) {
                      return;
                    }

                    const path = [...activePath, option.value];

                    if (option.children?.length) {
                      setBrowsePath(path);
                    } else {
                      commit(path);
                    }
                  }}
                />
              ) : (
                <p className="text-muted-foreground m-0 text-sm">{emptyText}</p>
              )}
            </div>
          }
        >
          <Button
            disabled={disabled}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={[ariaDescribedBy, statusId]
              .filter(Boolean)
              .join(' ')}
            className={cn(
              'min-w-0 flex-1 justify-between',
              classNames?.trigger, //
            )}
          >
            <span className="truncate">{selectedText}</span>
            <ChevronDown aria-hidden="true" className="size-4 shrink-0" />
          </Button>
        </Popover>
        {allowClear && selectedPath.length > 0 && (
          <Button
            variant="text"
            size="small"
            disabled={disabled}
            aria-label={clearLabel}
            icon={<X />}
            onClick={() => commit([])}
            className={cn(
              'shrink-0',
              classNames?.clear, //
            )}
          />
        )}
        <span
          id={statusId}
          data-slot="cascader-status"
          className="sr-only"
          aria-live="polite"
        >
          {selectedText}
        </span>
      </div>
    </DirectionProvider>
  );
};

export default Cascader;
