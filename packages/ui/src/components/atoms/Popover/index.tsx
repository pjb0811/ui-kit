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

const arrowBase = 'absolute pointer-events-none z-10';
const beforeBase = 'before:content-[""] before:absolute before:h-0 before:w-0';
const afterBase = 'after:content-[""] after:absolute after:h-0 after:w-0';

const borderShape = {
  vertical:
    'before:border-l-[9px] before:border-r-[9px] before:border-l-transparent before:border-r-transparent',
  horizontal:
    'before:border-t-[9px] before:border-b-[9px] before:border-t-transparent before:border-b-transparent',
} as const;

const fillShape = {
  vertical:
    'after:border-l-8 after:border-r-8 after:border-l-transparent after:border-r-transparent',
  horizontal:
    'after:border-t-8 after:border-b-8 after:border-t-transparent after:border-b-transparent',
} as const;

const createArrowStyle = (
  side: 'top' | 'bottom' | 'left' | 'right',
  align: 'center' | 'start' | 'end',
) => {
  const isVertical = side === 'top' || side === 'bottom';

  const alignPos = {
    center: isVertical
      ? 'left-1/2 -translate-x-1/2'
      : 'top-1/2 -translate-y-1/2',
    start: isVertical ? 'left-4' : 'top-4',
    end: isVertical ? 'right-4' : 'bottom-4',
  }[align];

  const beforePos = {
    top: {
      center: 'before:top-0 before:left-1/2 before:-translate-x-1/2',
      start: 'before:top-0 before:left-0',
      end: 'before:top-0 before:right-0',
    },
    bottom: {
      center: 'before:bottom-0 before:left-1/2 before:-translate-x-1/2',
      start: 'before:bottom-0 before:left-0',
      end: 'before:bottom-0 before:right-0',
    },
    left: {
      center: 'before:left-0 before:top-1/2 before:-translate-y-1/2',
      start: 'before:left-0 before:top-0',
      end: 'before:left-0 before:bottom-0',
    },
    right: {
      center: 'before:right-0 before:top-1/2 before:-translate-y-1/2',
      start: 'before:right-0 before:top-0',
      end: 'before:right-0 before:bottom-0',
    },
  }[side][align];

  const afterPos = {
    top: {
      center: 'after:-top-px after:left-1/2 after:-translate-x-1/2',
      start: 'after:-top-px after:left-px',
      end: 'after:-top-px after:right-px',
    },
    bottom: {
      center: 'after:-bottom-px after:left-1/2 after:-translate-x-1/2',
      start: 'after:-bottom-px after:left-px',
      end: 'after:-bottom-px after:right-px',
    },
    left: {
      center: 'after:-left-px after:top-1/2 after:-translate-y-1/2',
      start: 'after:-left-px after:top-px',
      end: 'after:-left-px after:bottom-px',
    },
    right: {
      center: 'after:-right-px after:top-1/2 after:-translate-y-1/2',
      start: 'after:-right-px after:top-px',
      end: 'after:-right-px after:bottom-px',
    },
  }[side][align];

  const borderDir = {
    top: 'before:border-t-[9px] before:border-t-border',
    bottom: 'before:border-b-[9px] before:border-b-border',
    left: 'before:border-l-[9px] before:border-l-border',
    right: 'before:border-r-[9px] before:border-r-border',
  }[side];

  const fillDir = {
    top: 'after:border-t-8 after:border-t-popover',
    bottom: 'after:border-b-8 after:border-b-popover',
    left: 'after:border-l-8 after:border-l-popover',
    right: 'after:border-r-8 after:border-r-popover',
  }[side];

  return cn(
    alignPos,
    `${side}-full`,
    beforeBase,
    beforePos,
    isVertical ? borderShape.vertical : borderShape.horizontal,
    borderDir,
    afterBase,
    afterPos,
    isVertical ? fillShape.vertical : fillShape.horizontal,
    fillDir,
  );
};

const arrowStyles: Record<Placement, string> = {
  top: createArrowStyle('top', 'center'),
  topLeft: createArrowStyle('top', 'start'),
  topRight: createArrowStyle('top', 'end'),
  bottom: createArrowStyle('bottom', 'center'),
  bottomLeft: createArrowStyle('bottom', 'start'),
  bottomRight: createArrowStyle('bottom', 'end'),
  left: createArrowStyle('left', 'center'),
  leftTop: createArrowStyle('left', 'start'),
  leftBottom: createArrowStyle('left', 'end'),
  right: createArrowStyle('right', 'center'),
  rightTop: createArrowStyle('right', 'start'),
  rightBottom: createArrowStyle('right', 'end'),
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
        className={cn('relative w-auto overflow-visible', className)}
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
