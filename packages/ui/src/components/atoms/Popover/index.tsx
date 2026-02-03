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

const topBorder = 'before:border-t-[9px] before:border-t-border';
const bottomBorder = 'before:border-b-[9px] before:border-b-border';
const leftBorder = 'before:border-l-[9px] before:border-l-border';
const rightBorder = 'before:border-r-[9px] before:border-r-border';
const topFill = 'after:border-t-8 after:border-t-popover';
const bottomFill = 'after:border-b-8 after:border-b-popover';
const leftFill = 'after:border-l-8 after:border-l-popover';
const rightFill = 'after:border-r-8 after:border-r-popover';

const arrowStyles: Record<Placement, string> = {
  top: [
    'absolute left-1/2 -translate-x-1/2 top-full',
    beforeBase,
    'before:top-0 before:left-1/2 before:-translate-x-1/2',
    vBorderShape,
    topBorder,
    afterBase,
    'after:-top-px after:left-1/2 after:-translate-x-1/2',
    vFillShape,
    topFill,
  ].join(' '),
  topLeft: [
    'absolute left-4 top-full',
    beforeBase,
    'before:top-0 before:left-0',
    vBorderShape,
    topBorder,
    afterBase,
    'after:-top-px after:left-px',
    vFillShape,
    topFill,
  ].join(' '),
  topRight: [
    'absolute right-4 top-full',
    beforeBase,
    'before:top-0 before:right-0',
    vBorderShape,
    topBorder,
    afterBase,
    'after:-top-px after:right-px',
    vFillShape,
    topFill,
  ].join(' '),
  bottom: [
    'absolute left-1/2 -translate-x-1/2 bottom-full',
    beforeBase,
    'before:bottom-0 before:left-1/2 before:-translate-x-1/2',
    vBorderShape,
    bottomBorder,
    afterBase,
    'after:-bottom-px after:left-1/2 after:-translate-x-1/2',
    vFillShape,
    bottomFill,
  ].join(' '),
  bottomLeft: [
    'absolute left-4 bottom-full',
    beforeBase,
    'before:bottom-0 before:left-0',
    vBorderShape,
    bottomBorder,
    afterBase,
    'after:-bottom-px after:left-px',
    vFillShape,
    bottomFill,
  ].join(' '),
  bottomRight: [
    'absolute right-4 bottom-full',
    beforeBase,
    'before:bottom-0 before:right-0',
    vBorderShape,
    bottomBorder,
    afterBase,
    'after:-bottom-px after:right-px',
    vFillShape,
    bottomFill,
  ].join(' '),
  left: [
    'absolute top-1/2 -translate-y-1/2 left-full',
    beforeBase,
    'before:left-0 before:top-1/2 before:-translate-y-1/2',
    hBorderShape,
    leftBorder,
    afterBase,
    'after:-left-px after:top-1/2 after:-translate-y-1/2',
    hFillShape,
    leftFill,
  ].join(' '),
  leftTop: [
    'absolute top-4 left-full',
    beforeBase,
    'before:left-0 before:top-0',
    hBorderShape,
    leftBorder,
    afterBase,
    'after:-left-px after:top-px',
    hFillShape,
    leftFill,
  ].join(' '),
  leftBottom: [
    'absolute bottom-4 left-full',
    beforeBase,
    'before:left-0 before:bottom-0',
    hBorderShape,
    leftBorder,
    afterBase,
    'after:-left-px after:bottom-px',
    hFillShape,
    leftFill,
  ].join(' '),
  right: [
    'absolute top-1/2 -translate-y-1/2 right-full',
    beforeBase,
    'before:right-0 before:top-1/2 before:-translate-y-1/2',
    hBorderShape,
    rightBorder,
    afterBase,
    'after:-right-px after:top-1/2 after:-translate-y-1/2',
    hFillShape,
    rightFill,
  ].join(' '),
  rightTop: [
    'absolute top-4 right-full',
    beforeBase,
    'before:right-0 before:top-0',
    hBorderShape,
    rightBorder,
    afterBase,
    'after:-right-px after:top-px',
    hFillShape,
    rightFill,
  ].join(' '),
  rightBottom: [
    'absolute bottom-4 right-full',
    beforeBase,
    'before:right-0 before:bottom-0',
    hBorderShape,
    rightBorder,
    afterBase,
    'after:-right-px after:bottom-px',
    hFillShape,
    rightFill,
  ].join(' '),
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
        <div className={cn(arrowStyles[placement])} />
      </PopoverContent>
    </CorePopover>
  );
};

export default Popover;
