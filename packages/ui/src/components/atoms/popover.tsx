'use client';

import { Children, type ReactElement } from 'react';

import { useControllableState } from '@jbpark/use-hooks';

import { cn, renderConditional } from '@repo/ui/utils';

import { popover } from '../../core';
import Typography from './typography';

const {
  Popover: CorePopover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
  PopoverTitle,
} = popover;

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
  /** Set to false when a custom trigger component renders a non-button element. */
  nativeButton?: boolean;
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

const Popover = ({
  title,
  nativeButton,
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

  const trigger = Children.only(children) as ReactElement;

  return (
    <CorePopover open={open} onOpenChange={setOpen}>
      {/* Deliberately no `data-slot` here: Base UI merges the trigger's own
          props over the rendered element's, so a `data-slot` set here replaces
          the child's. A `Button` trigger would lose `data-slot="button"` and
          with it every `--btn-*` token rule in globals.css. */}
      <PopoverTrigger
        render={trigger}
        nativeButton={
          nativeButton ??
          (typeof trigger.type !== 'string' || trigger.type === 'button')
        }
      />
      <PopoverContent
        {...props}
        align={align}
        side={side}
        sideOffset={16}
        className={cn('relative w-auto', className)}
      >
        {renderConditional(title, v => (
          <PopoverTitle render={<Typography.Title level={6} />}>
            {v}
          </PopoverTitle>
        ))}
        {content}
        <PopoverArrow />
      </PopoverContent>
    </CorePopover>
  );
};

export default Popover;
