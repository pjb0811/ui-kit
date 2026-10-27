'use client';

import {
  type ComponentPropsWithRef,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useControllableState, useElementPosition } from '@jbpark/use-hooks';

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

interface Measurement {
  index: number;
  target: HTMLElement | null;
  rect: DOMRect | null;
}

const TARGET_MUTATION = {
  attributes: true,
  attributeFilter: ['hidden', 'style', 'class'],
};

const measureVisible = (element: HTMLElement) =>
  element.isConnected &&
  element.getClientRects().length > 0 &&
  getComputedStyle(element).visibility !== 'hidden'
    ? element.getBoundingClientRect()
    : null;

// Tracks one open step's target. Tour mounts it only while open and keys it by
// step, so no listener stays attached while closed and a new step never
// reports the previous step's element.
const StepTarget = ({
  index,
  step,
  scrollIntoView,
  onMeasure,
}: {
  index: number;
  step: Step;
  scrollIntoView: boolean;
  onMeasure: (measurement: Measurement) => void;
}) => {
  const { rect, element } = useElementPosition<HTMLElement>(
    () => step.target?.() ?? null,
    { withElement: true, measure: measureVisible, mutation: TARGET_MUTATION },
  );

  useEffect(() => {
    if (element && scrollIntoView) {
      element.scrollIntoView({
        block: 'center',
        inline: 'nearest',
        behavior: 'instant',
      });
    }
  }, [element, scrollIntoView]);

  useEffect(() => {
    onMeasure({ index, target: element, rect });
  }, [onMeasure, index, element, rect]);

  return null;
};

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
  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const target =
    open && measurement && measurement.index === index
      ? measurement.target
      : null;
  const rect =
    open && measurement && measurement.index === index
      ? measurement.rect
      : null;
  const fallback = useMemo(
    () => ({
      getBoundingClientRect: () =>
        new DOMRect(window.innerWidth / 2, window.innerHeight / 2, 0, 0),
    }),
    [],
  );

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
      {open && step && (
        <StepTarget
          key={index}
          index={index}
          step={step}
          scrollIntoView={scrollIntoView}
          onMeasure={setMeasurement}
        />
      )}
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
                'pointer-events-none rounded-md border-2 border-primary',
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
            className="mt-3 text-xs text-muted-foreground"
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
