'use client';

import { useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@repo/ui/utils';

import Menu, { MenuProps } from '../Menu';

type ChangeEventHandler = (open: boolean) => void;

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  open?: boolean;
  trigger?: string;
  menu?: MenuProps;
  placement?: string;
  onOpenChange?: ChangeEventHandler;
}

const Dropdown = ({
  children,
  menu,
  trigger = 'hover',
  open: _open,
  onOpenChange: _onOpenChange = () => {},
  ...props
}: Props) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(false);

  const controlled = _open !== undefined;
  const open = controlled ? _open : uncontrolledOpen;

  const isClickTrigger = trigger === 'click';

  const onOpenChange = (nextOpen: boolean) => {
    if (!controlled) {
      setUncontrolledOpen(nextOpen);
    }
    _onOpenChange(nextOpen);
  };

  return (
    <div
      {...props}
      className={cn('relative z-0', 'inline-block cursor-pointer')}
      onMouseEnter={() => {
        if (isClickTrigger) {
          return;
        }
        onOpenChange(true);
      }}
      onMouseLeave={() => {
        if (isClickTrigger) {
          return;
        }
        onOpenChange(false);
      }}
    >
      <div
        onClick={() => {
          if (!isClickTrigger) {
            return;
          }
          onOpenChange(!open);
        }}
        onBlur={() => {
          onOpenChange(false);
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
