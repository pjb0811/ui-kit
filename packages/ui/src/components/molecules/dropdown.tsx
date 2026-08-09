'use client';

import { useControllableState } from '@jbpark/use-hooks';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@repo/ui/utils';

import Menu, { MenuProps } from './menu';

type ChangeEventHandler = (open: boolean) => void;

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  open?: boolean;
  trigger?: string;
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

  return (
    <div
      {...props}
      className={cn(
        'relative z-0',
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
        aria-haspopup="menu"
        aria-expanded={open}
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
        onBlur={() => {
          onOpenChange(false);
        }}
        onKeyDown={e => {
          if (e.key === 'Escape') {
            onOpenChange(false);
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
