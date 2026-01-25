'use client';

import { useEffect } from 'react';

import { X } from 'lucide-react';

import {
  DrawerContent,
  Drawer as DrawerCore,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@repo/ui/core/drawer';
import { cn } from '@repo/ui/utils';

interface Props {
  open: boolean;
  children?: React.ReactNode;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  closable?: boolean;
  closeIcon?: React.ReactNode;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  maskClosable?: boolean;
  handlebar?: boolean;
  draggable?: boolean;
  rounded?: boolean;
  mask?: boolean;
  className?: string;
  style?: React.CSSProperties;
  classNames?: {
    mask?: string;
    content?: string;
    handlebar?: string;
    header?: string;
    title?: string;
    close?: string;
    body?: string;
    footer?: string;
  };
  container?: HTMLElement;
  onClose: () => void;
}

const Drawer = ({
  open,
  title,
  footer,
  closable = true,
  closeIcon,
  direction = 'bottom',
  maskClosable = true,
  handlebar = true,
  draggable = false,
  rounded = false,
  mask = true,
  className,
  classNames,
  style,
  children,
  container,
  onClose,
  ...props
}: Props) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    if (!mask) {
      const originalPointerEvents = document.body.style.pointerEvents;

      const raf = window.requestAnimationFrame(() => {
        document.body.style.pointerEvents = 'auto';
      });

      return () => {
        window.cancelAnimationFrame(raf);
        document.body.style.pointerEvents = originalPointerEvents;
      };
    }
  }, [open, mask]);

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <DrawerCore
      open={open}
      direction={direction}
      handleOnly={!draggable}
      container={container}
      onOpenChange={(open: boolean) => {
        if (!open && maskClosable) {
          onClose();
        }
      }}
      {...props}
    >
      <DrawerContent
        className={cn(
          'border-none outline-none',
          rounded ? 'rounded-t-[30px]!' : 'rounded-none!',
          classNames?.content,
          className,
          //
        )}
        handlebar={handlebar}
        mask={mask}
        classNames={{
          mask: cn(
            classNames?.mask || '',
            //
          ),
          handlebar: cn(
            classNames?.handlebar || '',
            //
          ),
        }}
        style={style}
      >
        <DrawerHeader
          className={cn(
            classNames?.header,
            !title && 'p-0',
            //
          )}
        >
          <DrawerTitle
            className={cn(
              'flex justify-between',
              classNames?.title,
              //
            )}
          >
            <span>{title}</span>
            {closable && (
              <span
                className={cn(
                  'absolute top-3 right-5 cursor-pointer',
                  classNames?.close,
                  //
                )}
                onClick={onClose}
              >
                {closeIcon || <X />}
              </span>
            )}
          </DrawerTitle>
          <DrawerDescription className="hidden" />
        </DrawerHeader>
        <div
          className={cn(
            'overflow-auto p-5',
            classNames?.body,
            //
          )}
        >
          {children}
        </div>
        {footer && (
          <DrawerFooter className={cn(classNames?.footer)}>
            {footer}
          </DrawerFooter>
        )}
      </DrawerContent>
    </DrawerCore>
  );
};

export default Drawer;
