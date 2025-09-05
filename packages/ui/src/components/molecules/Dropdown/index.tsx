'use client';

import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@repo/ui/utils';

import Menu, { MenuProps } from '../Menu';

type ChangeEventHandler = (open: boolean) => void;

interface Props extends React.HTMLAttributes<HTMLElement> {
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
  open: _open = false,
  onOpenChange = () => {},
  ...props
}: Props) => {
  const [open, setOpen] = useState(false);

  const isClickTrigger = trigger === 'click';

  useEffect(() => {
    setOpen(_open);
  }, [_open]);

  return (
    <div
      {...props}
      className={cn('relative z-0', 'inline-block cursor-pointer')}
      onMouseEnter={() => {
        if (isClickTrigger) {
          return;
        }
        setOpen(true);
      }}
      onMouseLeave={() => {
        if (isClickTrigger) {
          return;
        }
        setOpen(false);
      }}
    >
      <div
        onClick={() => {
          if (!isClickTrigger) {
            return;
          }
          setOpen(!open);
          onOpenChange(!open);
        }}
        onBlur={() => {
          setOpen(false);
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
