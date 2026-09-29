'use client';

import { Children, type ReactElement, type ReactNode } from 'react';

import { tooltip } from '../../core';

const { Tooltip: Core, TooltipContent, TooltipTrigger } = tooltip;

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

type Side = NonNullable<React.ComponentProps<typeof TooltipContent>['side']>;
type Align = NonNullable<React.ComponentProps<typeof TooltipContent>['align']>;

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

export interface Props extends Omit<
  React.ComponentProps<typeof Core>,
  'children' | 'handle' | 'triggerId' | 'defaultTriggerId'
> {
  children: ReactElement;
  /** Supplementary visual hint; keep essential information visible elsewhere. */
  content: ReactNode;
  /** Popup class; the child retains its own className. */
  className?: string;
  placement?: Placement;
  /** Distance between the trigger and popup in pixels. */
  offset?: number;
  /** Hover delay in milliseconds. Keyboard focus opens without this delay. */
  delay?: number;
  closeDelay?: number;
}

const Tooltip = ({
  children,
  content,
  className,
  placement = 'top',
  offset = 8,
  delay,
  closeDelay,
  ...props
}: Props) => {
  const trigger = Children.only(children);
  const { side, align } = placementMap[placement];

  return (
    <Core {...props}>
      <TooltipTrigger render={trigger} delay={delay} closeDelay={closeDelay} />
      <TooltipContent
        side={side}
        align={align}
        sideOffset={offset}
        className={className}
      >
        {content}
      </TooltipContent>
    </Core>
  );
};

export default Tooltip;
