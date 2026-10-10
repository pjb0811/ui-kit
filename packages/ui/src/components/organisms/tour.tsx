'use client';

import {
  type ComponentPropsWithRef,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useControllableState } from '@jbpark/use-hooks';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { popover } from '../../core';
import { OVERLAY_LAYER } from '../../lib/z-layers';
import Button from '../atoms/button';

export interface Step {
  key: string;
  title: ReactNode;
  description?: ReactNode;
  /** Resolved after hydration. Missing/hidden targets use a centered popup. */
  target?: () => HTMLElement | null;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export interface Props extends Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'onChange'
> {
  steps: readonly Step[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  current?: number;
  defaultCurrent?: number;
  onChange?: (current: number) => void;
  onClose?: () => void;
  onFinish?: () => void;
  scrollIntoView?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
  closeLabel?: string;
  formatProgress?: (current: number, total: number) => string;
  classNames?: {
    popup?: string;
    mask?: string;
    highlight?: string;
    actions?: string;
  };
}

const defaultFormatProgress = (current: number, total: number) =>
  `Step ${current} of ${total}`;

const Tour = ({
  steps,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  current: currentProp,
  defaultCurrent = 0,
  onChange,
  onClose,
  onFinish,
  scrollIntoView = true,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  finishLabel = 'Finish',
  closeLabel = 'Close tour',
  formatProgress = defaultFormatProgress,
  className,
  classNames,
  ...props
}: Props) => {
  const { getContainer, direction } = useConfig();
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [current, setCurrent] = useControllableState({
    value: currentProp,
    defaultValue: defaultCurrent,
    onChange,
  });
  const index = Number.isFinite(current)
    ? Math.max(0, Math.min(steps.length - 1, Math.floor(current)))
    : 0;
  const step = steps[index];
  const [measurement, setMeasurement] = useState<{
    step: Step;
    target: HTMLElement | null;
    rect: { top: number; left: number; width: number; height: number } | null;
  } | null>(null);
  const target =
    open && measurement && measurement.step === step
      ? measurement.target
      : null;
  const rect =
    open && measurement && measurement.step === step ? measurement.rect : null;
  const fallback = useMemo(
    () => ({
      getBoundingClientRect: () =>
        new DOMRect(window.innerWidth / 2, window.innerHeight / 2, 0, 0),
    }),
    [],
  );

  useEffect(() => {
    if (!open || !step) return;

    let previous: HTMLElement | null = null;
    const update = () => {
      const element = step.target?.() ?? null;
      const isVisible =
        !!element?.isConnected &&
        element.getClientRects().length > 0 &&
        getComputedStyle(element).visibility !== 'hidden';
      const resolved = isVisible ? element : null;

      if (resolved !== previous) {
        if (previous) resizeObserver.unobserve(previous);

        if (resolved) {
          resizeObserver.observe(resolved);

          if (scrollIntoView) {
            resolved.scrollIntoView({
              block: 'center',
              inline: 'nearest',
              behavior: 'instant',
            });
          }
        }
      }

      previous = resolved;
      const bounds = resolved?.getBoundingClientRect();
      const next = bounds
        ? {
            top: bounds.top,
            left: bounds.left,
            width: bounds.width,
            height: bounds.height,
          }
        : null;

      setMeasurement(existing =>
        existing?.step === step &&
        existing.target === resolved &&
        existing.rect?.top === next?.top &&
        existing.rect?.left === next?.left &&
        existing.rect?.width === next?.width &&
        existing.rect?.height === next?.height
          ? existing
          : { step, target: resolved, rect: next },
      );
    };

    const frame = requestAnimationFrame(update);
    const observer = new MutationObserver(update);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['hidden', 'style', 'class'],
    });
    const resizeObserver = new ResizeObserver(update);

    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, step, scrollIntoView]);

  const close = () => {
    onClose?.();
    setOpen(false);
  };

  return (
    <div
      {...props}
      data-slot="tour"
      className={cn(
        'contents',
        className, //
      )}
    >
      <popover.Popover
        open={open && !!step}
        modal
        onOpenChange={(next, details) => {
          if (details.reason === 'outside-press') {
            details.cancel();

            return;
          }

          if (!next) close();
        }}
      >
        <popover.PopoverPortal container={getContainer()}>
          <popover.PopoverBackdrop
            data-slot="tour-mask"
            className={cn(
              'fixed inset-0 bg-black/40',
              OVERLAY_LAYER,
              classNames?.mask, //
            )}
          />
          {open && rect && (
            <div
              data-slot="tour-highlight"
              aria-hidden="true"
              style={{
                position: 'fixed',
                top: rect.top - 4,
                left: rect.left - 4,
                width: rect.width + 8,
                height: rect.height + 8,
              }}
              className={cn(
                'border-primary pointer-events-none rounded-md border-2',
                OVERLAY_LAYER,
                classNames?.highlight, //
              )}
            />
          )}
        </popover.PopoverPortal>
        <popover.PopoverContent
          data-slot="tour-popup"
          dir={props.dir ?? direction}
          anchor={target ?? fallback}
          side={step?.placement ?? 'bottom'}
          sideOffset={12}
          positionerStyle={
            target
              ? undefined
              : {
                  position: 'fixed',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }
          }
          className={cn(
            `max-h-[calc(100dvh-2rem)] w-80 max-w-[calc(100vw-2rem)]
            overflow-y-auto`,
            classNames?.popup, //
          )}
        >
          <popover.PopoverTitle>{step?.title}</popover.PopoverTitle>
          {step?.description != null && (
            <popover.PopoverDescription className="mt-2 text-sm">
              {step.description}
            </popover.PopoverDescription>
          )}
          <p
            data-slot="tour-progress"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="text-muted-foreground mt-3 text-xs"
          >
            {formatProgress(index + 1, steps.length)}
          </p>
          <div
            className={cn(
              'mt-4 flex flex-wrap gap-2',
              classNames?.actions, //
            )}
          >
            <popover.PopoverClose
              render={<Button variant="text" size="small" />}
            >
              {closeLabel}
            </popover.PopoverClose>
            <Button
              variant="outlined"
              size="small"
              disabled={index === 0}
              focusableWhenDisabled
              className="aria-disabled:pointer-events-none
                aria-disabled:opacity-50"
              onClick={() => setCurrent(index - 1)}
            >
              {previousLabel}
            </Button>
            <Button
              size="small"
              onClick={() => {
                if (index < steps.length - 1) {
                  setCurrent(index + 1);
                } else {
                  onFinish?.();
                  setOpen(false);
                }
              }}
            >
              {index === steps.length - 1 ? finishLabel : nextLabel}
            </Button>
          </div>
          {target && <popover.PopoverArrow />}
        </popover.PopoverContent>
      </popover.Popover>
    </div>
  );
};

export default Tour;
