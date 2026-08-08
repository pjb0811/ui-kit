import { useControllableState } from '@jbpark/use-hooks';

import { popover } from '@repo/ui/core';
import { cn, renderConditional } from '@repo/ui/utils';

import Typography from './typography';

const { Popover: CorePopover, PopoverContent, PopoverTrigger } = popover;

type Placement =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom';

export interface Props extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'title' | 'content'
> {
  title?: React.ReactNode;
  placement?: Placement;
  content: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type Side = 'top' | 'bottom' | 'left' | 'right';
type Align = 'start' | 'center' | 'end';

const placementMap: Record<Placement, { side: Side; align: Align }> = {
  top: { side: 'top', align: 'center' },
  left: { side: 'left', align: 'center' },
  right: { side: 'right', align: 'center' },
  bottom: { side: 'bottom', align: 'center' },
  topLeft: { side: 'top', align: 'start' },
  topRight: { side: 'top', align: 'end' },
  bottomLeft: { side: 'bottom', align: 'start' },
  bottomRight: { side: 'bottom', align: 'end' },
  leftTop: { side: 'left', align: 'start' },
  leftBottom: { side: 'left', align: 'end' },
  rightTop: { side: 'right', align: 'start' },
  rightBottom: { side: 'right', align: 'end' },
};

const beforeBase = 'before:content-[""] before:absolute before:h-0 before:w-0';
const afterBase = 'after:content-[""] after:absolute after:h-0 after:w-0';

const vBorderShape =
  'before:border-l-[9px] before:border-r-[9px] before:border-l-transparent before:border-r-transparent';
const hBorderShape =
  'before:border-t-[9px] before:border-b-[9px] before:border-t-transparent before:border-b-transparent';
const vFillShape =
  'after:border-l-8 after:border-r-8 after:border-l-transparent after:border-r-transparent';
const hFillShape =
  'after:border-t-8 after:border-b-8 after:border-t-transparent after:border-b-transparent';

// Top/bottom placements draw a vertical-edge triangle (border-l/border-r) —
// the arrow points up/down, so its left/right edges form the point. Left/
// right placements draw the horizontal-edge equivalent.
const borderShapeBySide: Record<Side, string> = {
  top: vBorderShape,
  bottom: vBorderShape,
  left: hBorderShape,
  right: hBorderShape,
};
const fillShapeBySide: Record<Side, string> = {
  top: vFillShape,
  bottom: vFillShape,
  left: hFillShape,
  right: hFillShape,
};
const borderColorBySide: Record<Side, string> = {
  top: 'before:border-t-[9px] before:border-t-border',
  bottom: 'before:border-b-[9px] before:border-b-border',
  left: 'before:border-l-[9px] before:border-l-border',
  right: 'before:border-r-[9px] before:border-r-border',
};
const fillColorBySide: Record<Side, string> = {
  top: 'after:border-t-8 after:border-t-popover',
  bottom: 'after:border-b-8 after:border-b-popover',
  left: 'after:border-l-8 after:border-l-popover',
  right: 'after:border-r-8 after:border-r-popover',
};

// Tailwind v4 only extracts class candidates that appear as *literal*
// strings in source — none of these ever do if built via
// `` `${side}-full` `` style interpolation, so they'd silently never make
// it into the generated CSS. This table exists purely so every class the
// arrow can need appears literally somewhere in this file.
const POSITION_CLASSES: Record<
  Side,
  Record<Align, { wrapper: string; before: string; after: string }>
> = {
  top: {
    start: {
      wrapper: 'top-full left-4',
      before: 'before:top-0 before:left-0',
      after: 'after:-top-px after:left-px',
    },
    center: {
      wrapper: 'top-full left-1/2 -translate-x-1/2',
      before: 'before:top-0 before:left-1/2 before:-translate-x-1/2',
      after: 'after:-top-px after:left-1/2 after:-translate-x-1/2',
    },
    end: {
      wrapper: 'top-full right-4',
      before: 'before:top-0 before:right-0',
      after: 'after:-top-px after:right-px',
    },
  },
  bottom: {
    start: {
      wrapper: 'bottom-full left-4',
      before: 'before:bottom-0 before:left-0',
      after: 'after:-bottom-px after:left-px',
    },
    center: {
      wrapper: 'bottom-full left-1/2 -translate-x-1/2',
      before: 'before:bottom-0 before:left-1/2 before:-translate-x-1/2',
      after: 'after:-bottom-px after:left-1/2 after:-translate-x-1/2',
    },
    end: {
      wrapper: 'bottom-full right-4',
      before: 'before:bottom-0 before:right-0',
      after: 'after:-bottom-px after:right-px',
    },
  },
  left: {
    start: {
      wrapper: 'left-full top-4',
      before: 'before:left-0 before:top-0',
      after: 'after:-left-px after:top-px',
    },
    center: {
      wrapper: 'left-full top-1/2 -translate-y-1/2',
      before: 'before:left-0 before:top-1/2 before:-translate-y-1/2',
      after: 'after:-left-px after:top-1/2 after:-translate-y-1/2',
    },
    end: {
      wrapper: 'left-full bottom-4',
      before: 'before:left-0 before:bottom-0',
      after: 'after:-left-px after:bottom-px',
    },
  },
  right: {
    start: {
      wrapper: 'right-full top-4',
      before: 'before:right-0 before:top-0',
      after: 'after:-right-px after:top-px',
    },
    center: {
      wrapper: 'right-full top-1/2 -translate-y-1/2',
      before: 'before:right-0 before:top-1/2 before:-translate-y-1/2',
      after: 'after:-right-px after:top-1/2 after:-translate-y-1/2',
    },
    end: {
      wrapper: 'right-full bottom-4',
      before: 'before:right-0 before:bottom-0',
      after: 'after:-right-px after:bottom-px',
    },
  },
};

const getArrowClassName = (side: Side, align: Align) => {
  const { wrapper, before, after } = POSITION_CLASSES[side][align];

  return cn(
    'absolute',
    wrapper,
    beforeBase,
    before,
    borderShapeBySide[side],
    borderColorBySide[side],
    afterBase,
    after,
    fillShapeBySide[side],
    fillColorBySide[side],
  );
};

const Popover = ({
  title,
  placement = 'top',
  className,
  content,
  children,
  open: _open,
  defaultOpen,
  onOpenChange,
  ...props
}: Props) => {
  const [open, setOpen] = useControllableState<boolean>({
    value: _open,
    defaultValue: defaultOpen ?? false,
    onChange: onOpenChange,
  });

  const { side, align } = placementMap[placement];

  return (
    <CorePopover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        {...props}
        align={align}
        side={side}
        sideOffset={16}
        className={cn('relative w-auto', className)}
      >
        {renderConditional(title, v => (
          <Typography.Title level={6}>{v}</Typography.Title>
        ))}
        {content}
        <div className={getArrowClassName(side, align)} />
      </PopoverContent>
    </CorePopover>
  );
};

export default Popover;
