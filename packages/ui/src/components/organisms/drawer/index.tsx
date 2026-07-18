'use client';

import { useEffect } from 'react';

import { X } from 'lucide-react';

import { drawer } from '@repo/ui/core';
import { cn, renderConditional } from '@repo/ui/utils';

import Button from '../../atoms/button';

const {
  DrawerContent,
  Drawer: DrawerCore,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} = drawer;

export interface Props {
  open: boolean;
  children?: React.ReactNode;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  footer?: React.ReactNode;
  closable?: boolean;
  closeIcon?: React.ReactNode;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'small' | 'medium' | 'large' | 'full' | string;
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
    extra?: string;
    body?: string;
    footer?: string;
  };
  container?: HTMLElement;
  onClose: () => void;
}

const SIZES: Record<string, string> = {
  small: '30%',
  medium: '50%',
  large: '75%',
  full: '90%',
};

const getSizeStyles = (
  direction: 'top' | 'bottom' | 'left' | 'right',
  size: string,
): React.CSSProperties => {
  const value = SIZES[size] || size;

  return direction === 'top' || direction === 'bottom'
    ? { height: value }
    : { width: value };
};

const Drawer = ({
  open,
  title,
  extra,
  footer,
  closable = true,
  closeIcon,
  direction = 'bottom',
  size = 'medium',
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
    if (!open || mask) {
      return;
    }

    const originalPointerEvents = document.body.style.pointerEvents;

    const raf = window.requestAnimationFrame(() => {
      document.body.style.pointerEvents = 'auto';
    });

    return () => {
      window.cancelAnimationFrame(raf);
      document.body.style.pointerEvents = originalPointerEvents;
    };
  }, [open, mask]);

  return (
    <DrawerCore
      open={open}
      direction={direction}
      handleOnly={!draggable}
      container={container}
      onOpenChange={open => {
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
          mask: classNames?.mask || '',
          handlebar: classNames?.handlebar || '',
        }}
        style={{
          ...getSizeStyles(direction, size),
          ...style,
        }}
      >
        <DrawerHeader
          className={cn(
            classNames?.header,
            !title && 'p-0',
            //
          )}
        >
          <div className="flex items-start gap-2">
            {renderConditional(closable ? closeIcon || <X /> : null, v => (
              <Button
                type="text"
                shape="circle"
                size="small"
                aria-label="닫기"
                icon={v}
                onClick={onClose}
                className={cn(classNames?.close)}
              />
            ))}
            <div className="flex flex-1 items-start justify-between gap-2">
              <DrawerTitle className={cn(classNames?.title)}>
                {title}
              </DrawerTitle>
              {renderConditional(extra, v => (
                <div className={cn('shrink-0', classNames?.extra)}>{v}</div>
              ))}
            </div>
          </div>
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
        {renderConditional(footer, v => (
          <DrawerFooter className={cn(classNames?.footer)}>{v}</DrawerFooter>
        ))}
      </DrawerContent>
    </DrawerCore>
  );
};

export default Drawer;
