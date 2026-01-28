import { popover } from '@repo/ui/core';
import { cn, renderConditional } from '@repo/ui/utils';

import Typography from '../Typography';

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

interface Props extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'title' | 'content'
> {
  title?: React.ReactNode;
  placement?: Placement;
  content: React.ReactNode;
}

const placementMap = {
  top: {
    side: 'top',
    align: 'center',
  },
  left: {
    side: 'left',
    align: 'center',
  },
  right: {
    side: 'right',
    align: 'center',
  },
  bottom: {
    side: 'bottom',
    align: 'center',
  },
  topLeft: {
    side: 'top',
    align: 'start',
  },
  topRight: {
    side: 'top',
    align: 'end',
  },
  bottomLeft: {
    side: 'bottom',
    align: 'start',
  },
  bottomRight: {
    side: 'bottom',
    align: 'end',
  },
  leftTop: {
    side: 'left',
    align: 'start',
  },
  leftBottom: {
    side: 'left',
    align: 'end',
  },
  rightTop: {
    side: 'right',
    align: 'start',
  },
  rightBottom: {
    side: 'right',
    align: 'end',
  },
} as const;

const arrowBase = 'absolute h-0 w-0 drop-shadow-md';

const arrowShape = {
  vertical: 'border-l-8 border-r-8 border-l-transparent border-r-transparent',
  horizontal: 'border-t-8 border-b-8 border-t-transparent border-b-transparent',
} as const;

const arrowAlign = {
  center: { x: 'left-1/2 -translate-x-1/2', y: 'top-1/2 -translate-y-1/2' },
  start: { x: 'left-4', y: 'top-4' },
  end: { x: 'right-4', y: 'bottom-4' },
} as const;

const arrowStyles: Record<Placement, string> = {
  top: cn(
    arrowShape.vertical,
    arrowAlign.center.x,
    'top-full border-t-8 border-t-white',
  ),
  topLeft: cn(
    arrowShape.vertical,
    arrowAlign.start.x,
    'top-full border-t-8 border-t-white',
  ),
  topRight: cn(
    arrowShape.vertical,
    arrowAlign.end.x,
    'top-full border-t-8 border-t-white',
  ),
  bottom: cn(
    arrowShape.vertical,
    arrowAlign.center.x,
    'bottom-full border-b-8 border-b-white',
  ),
  bottomLeft: cn(
    arrowShape.vertical,
    arrowAlign.start.x,
    'bottom-full border-b-8 border-b-white',
  ),
  bottomRight: cn(
    arrowShape.vertical,
    arrowAlign.end.x,
    'bottom-full border-b-8 border-b-white',
  ),
  left: cn(
    arrowShape.horizontal,
    arrowAlign.center.y,
    'left-full border-l-8 border-l-white',
  ),
  leftTop: cn(
    arrowShape.horizontal,
    arrowAlign.start.y,
    'left-full border-l-8 border-l-white',
  ),
  leftBottom: cn(
    arrowShape.horizontal,
    arrowAlign.end.y,
    'left-full border-l-8 border-l-white',
  ),
  right: cn(
    arrowShape.horizontal,
    arrowAlign.center.y,
    'right-full border-r-8 border-r-white',
  ),
  rightTop: cn(
    arrowShape.horizontal,
    arrowAlign.start.y,
    'right-full border-r-8 border-r-white',
  ),
  rightBottom: cn(
    arrowShape.horizontal,
    arrowAlign.end.y,
    'right-full border-r-8 border-r-white',
  ),
};

const Popover = ({
  title,
  placement = 'top',
  className,
  content,
  children,
}: Props) => {
  return (
    <CorePopover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={placementMap[placement].align}
        side={placementMap[placement].side}
        sideOffset={16}
        className={cn('relative w-auto', className)}
      >
        {renderConditional(title, v => (
          <Typography.Title level={6}>{v}</Typography.Title>
        ))}
        {content}
        <div className={cn(arrowBase, arrowStyles[placement])} />
      </PopoverContent>
    </CorePopover>
  );
};

export default Popover;
