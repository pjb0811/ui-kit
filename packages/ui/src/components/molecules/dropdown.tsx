'use client';

import { useId, useRef } from 'react';

import { useControllableState } from '@jbpark/use-hooks';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@repo/ui/utils';

import Menu, { MenuProps } from './menu';

type ChangeEventHandler = (open: boolean) => void;

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  open?: boolean;
  trigger?: 'hover' | 'click';
  menu?: MenuProps;
  onOpenChange?: ChangeEventHandler;
}

const Dropdown = ({
  children,
  menu,
  trigger = 'hover',
  open: _open,
  onOpenChange: _onOpenChange = () => {},
  className,
  onMouseEnter,
  onMouseLeave,
  ...props
}: Props) => {
  const [open, onOpenChange] = useControllableState<boolean>({
    value: _open,
    defaultValue: false,
    onChange: _onOpenChange,
  });

  const isClickTrigger = trigger === 'click';
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      {...props}
      ref={containerRef}
      className={cn(
        'relative',
        'inline-block cursor-pointer',
        className,
        //
      )}
      onMouseEnter={event => {
        onMouseEnter?.(event);
        if (isClickTrigger) {
          return;
        }
        onOpenChange(true);
      }}
      onMouseLeave={event => {
        onMouseLeave?.(event);
        if (isClickTrigger) {
          return;
        }
        onOpenChange(false);
      }}
    >
      <div
        role={isClickTrigger ? 'button' : undefined}
        tabIndex={isClickTrigger ? 0 : undefined}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => {
          if (!isClickTrigger) {
            return;
          }
          onOpenChange(!open);
        }}
        onFocus={() => {
          if (isClickTrigger) {
            return;
          }
          onOpenChange(true);
        }}
        onBlur={e => {
          // Without this check, moving focus from the trigger into the
          // menu itself (e.g. via Tab) closed the dropdown before the
          // user could ever reach it — the mouse path avoided the same
          // bug only by way of onMouseDown's preventDefault below, which
          // does nothing for keyboard focus. Mirrors the containment
          // check menu/item/item.tsx already uses for the same reason.
          if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            onOpenChange(false);
          }
        }}
        onKeyDown={e => {
          if (e.key === 'Escape') {
            onOpenChange(false);
            return;
          }
          if (isClickTrigger && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onOpenChange(!open);
          }
        }}
      >
        {children}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className={cn(
              'absolute top-full pt-2',
              //
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1 }}
          >
            <Menu
              {...menu}
              id={menuId}
              onMouseDown={e => {
                e.preventDefault();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
