'use client';

import { Children, type ReactElement, type ReactNode } from 'react';

import { tooltip } from '../../core';

const { Tooltip: Core, TooltipContent, TooltipTrigger } = tooltip;

export interface Props extends Omit<
  React.ComponentProps<typeof Core>,
  'children' | 'handle' | 'triggerId' | 'defaultTriggerId'
> {
  children: ReactElement;
  /** Supplementary visual hint; keep essential information visible elsewhere. */
  content: ReactNode;
  /** Popup class; the child retains its own className. */
  className?: string;
  side?: React.ComponentProps<typeof TooltipContent>['side'];
  align?: React.ComponentProps<typeof TooltipContent>['align'];
  sideOffset?: number;
  /** Hover delay in milliseconds. Keyboard focus opens without this delay. */
  delay?: number;
  closeDelay?: number;
}

const Tooltip = ({
  children,
  content,
  className,
  side,
  align,
  sideOffset,
  delay,
  closeDelay,
  ...props
}: Props) => {
  const trigger = Children.only(children);

  return (
    <Core {...props}>
      <TooltipTrigger render={trigger} delay={delay} closeDelay={closeDelay} />
      <TooltipContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={className}
      >
        {content}
      </TooltipContent>
    </Core>
  );
};

export default Tooltip;
