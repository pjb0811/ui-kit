'use client';

import { useEffect } from 'react';

import { X } from 'lucide-react';

import { drawer } from '@repo/ui/core';
import { cn, renderConditional } from '@repo/ui/utils';

import Button from '../atoms/button';

const {
  DrawerContent,
  Drawer: DrawerCore,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} = drawer;

// `body.style.pointerEvents` is global state (per document), so several
// mask-less overlays opening at once would otherwise race: each instance
// would capture whatever the previous one had already written and the
// last cleanup would restore a stale value. Reference counting makes only
// the first instance capture the original value and only the last one
// restore it. Keyed by document (not a single module-level counter) so
// drawers portaled into different documents — e.g. live-editor's iframe
// Renderer — don't share state with the host document.
type MaskLessState = { count: number; originalPointerEvents: string | null };
const maskLessStates = new WeakMap<Document, MaskLessState>();

const getMaskLessState = (doc: Document): MaskLessState => {
  let state = maskLessStates.get(doc);

  if (!state) {
    state = { count: 0, originalPointerEvents: null };
    maskLessStates.set(doc, state);
  }

  return state;
};

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

// Rounds the edge facing into the viewport — the opposite edge from
// whichever side the drawer is anchored to.
const ROUNDED_CLASSES: Record<'top' | 'bottom' | 'left' | 'right', string> = {
  top: 'rounded-b-[30px]!',
  bottom: 'rounded-t-[30px]!',
  left: 'rounded-r-[30px]!',
  right: 'rounded-l-[30px]!',
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

    const targetDocument = container?.ownerDocument ?? document;
    const targetWindow = targetDocument.defaultView ?? window;
    const body = targetDocument.body;
    const state = getMaskLessState(targetDocument);

    if (state.count === 0) {
      state.originalPointerEvents = body.style.pointerEvents;
    }
    state.count += 1;

    const raf = targetWindow.requestAnimationFrame(() => {
      body.style.pointerEvents = 'auto';
    });

    return () => {
      targetWindow.cancelAnimationFrame(raf);
      state.count -= 1;

      if (state.count === 0) {
        body.style.pointerEvents = state.originalPointerEvents ?? '';
        state.originalPointerEvents = null;
      }
    };
  }, [open, mask, container]);

  return (
    <DrawerCore
      open={open}
      direction={direction}
      handleOnly={!draggable}
      container={container}
      onOpenChange={open => {
        if (!open) {
          onClose();
        }
      }}
      {...props}
    >
      <DrawerContent
        className={cn(
          'border-none outline-none',
          rounded ? ROUNDED_CLASSES[direction] : 'rounded-none!',
          classNames?.content,
          className,
          //
        )}
        handlebar={handlebar}
        mask={mask}
        onPointerDownOutside={event => {
          if (!maskClosable) {
            event.preventDefault();
          }
        }}
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
            {closable && (
              <Button
                type="text"
                shape="circle"
                size="small"
                aria-label="닫기"
                icon={closeIcon || <X />}
                onClick={onClose}
                className={cn(classNames?.close)}
              />
            )}
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
