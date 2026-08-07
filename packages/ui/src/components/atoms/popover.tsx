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

// `side` picks which edge of the content the arrow sits against; `align`
// slides it along that edge. The offset axis (x for top/bottom, y for
// left/right) is perpendicular to `side` — `align: 'center'` centers the
// arrow with a translate, while `start`/`end` pin it 16px from that edge.
const offsetAxisBySide: Record<Side, 'x' | 'y'> = {
  top: 'x',
  bottom: 'x',
  left: 'y',
  right: 'y',
};
const startEdgeByAxis = { x: 'left', y: 'top' } as const;
const endEdgeByAxis = { x: 'right', y: 'bottom' } as const;

const getArrowClassName = (side: Side, align: Align) => {
  const axis = offsetAxisBySide[side];
  const alignEdge =
    align === 'start'
      ? startEdgeByAxis[axis]
      : align === 'end'
        ? endEdgeByAxis[axis]
        : null;

  const positionAlign = alignEdge
    ? `${alignEdge}-4`
    : `${startEdgeByAxis[axis]}-1/2 -translate-${axis}-1/2`;
  const beforeAlign = alignEdge
    ? `before:${alignEdge}-0`
    : `before:${startEdgeByAxis[axis]}-1/2 before:-translate-${axis}-1/2`;
  const afterAlign = alignEdge
    ? `after:${alignEdge}-px`
    : `after:${startEdgeByAxis[axis]}-1/2 after:-translate-${axis}-1/2`;

  return cn(
    `absolute ${positionAlign} ${side}-full`,
    beforeBase,
    `before:${side}-0`,
    beforeAlign,
    borderShapeBySide[side],
    borderColorBySide[side],
    afterBase,
    `after:-${side}-px`,
    afterAlign,
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
