'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import {
  Check,
  CircleQuestionMark,
  Info,
  OctagonAlert,
  OctagonX,
} from 'lucide-react';

import { dialog } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

import Button from '../atoms/button';
import {
  type ImperativeStack,
  createImperativeStack,
  isBrowser,
} from './imperative-stack';

const {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} = dialog;

export interface Props {
  open?: boolean;
  maskClosable?: boolean;
  closable?:
    | boolean
    | {
        closeIcon?: React.ReactNode;
        disabled?: boolean;
      };
  closeIcon?: React.ReactNode;
  title?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  classNames?: {
    mask?: string;
    header?: string;
    body?: string;
    footer?: string;
  };
  style?: React.CSSProperties;
  okText?: string;
  cancelText?: string;
  container?: HTMLElement;
  children?: React.ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
}

interface StaticProps extends Props {
  type?: 'info' | 'success' | 'error' | 'warning' | 'confirm';
  id?: string;
  icon?: React.ReactNode;
  container?: HTMLElement;
}

const Modal = ({
  open = false,
  maskClosable = false,
  closable = false,
  closeIcon,
  className,
  classNames,
  style,
  title,
  content,
  footer,
  container,
  children,
  okText = 'OK',
  cancelText = 'Cancel',
  onOk,
  onCancel,
  ...props
}: Props) => {
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open: boolean) => {
        if (!open) {
          onCancel?.();
        }
      }}
      {...props}
    >
      <DialogContent
        className={cn(
          'rounded-lg p-4 max-sm:max-w-[80%]',
          'border-none outline-none',
          className,
        )}
        classNames={{
          ...classNames,
          mask: cn('bg-black/60', classNames?.mask),
        }}
        style={style}
        closable={closable}
        closeIcon={closeIcon}
        container={container}
        onPointerDownOutside={event => {
          if (!maskClosable) {
            event.preventDefault();
          }
        }}
      >
        {/**
         * @todo [Dialog & AlertDialog] fix: can't get id correctly in shadow dom
         * @see https://github.com/radix-ui/primitives/pull/3384
         **/}
        <DialogHeader
          className={cn(
            classNames?.header,
            !title && 'hidden',
            //
          )}
        >
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <div className={cn('break-all', classNames?.body)}>
          {children ?? content}
        </div>
        {footer !== null && (
          <DialogFooter
            className={cn('flex-row justify-end gap-x-2', classNames?.footer)}
          >
            {footer || (
              <>
                <Button onClick={onOk}>{okText}</Button>
                <Button variant="outlined" onClick={onCancel}>
                  {cancelText}
                </Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

const STATIC_ICONS = {
  info: <Info className="text-blue-400" />,
  success: <Check className="text-green-400" />,
  error: <OctagonX className="text-red-400" />,
  warning: <OctagonAlert className="text-yellow-400" />,
  confirm: <CircleQuestionMark />,
};

const StaticModal = ({
  id,
  type,
  title,
  content,
  okText = 'OK',
  cancelText = 'Cancel',
  container,
  icon,
  onOk,
  onCancel,
  ...props
}: StaticProps & { id: string }): React.ReactPortal | null => {
  const [open, setOpen] = useState(true);

  const closeModal = (callback?: () => void) => {
    callback?.();
    setOpen(false);
    setTimeout(() => {
      modalStack.destroy(id);
    }, 200);
  };

  const footer =
    type === 'confirm' ? (
      <div className="grid w-full grid-cols-5 gap-x-2">
        <Button
          variant="outlined"
          className="col-span-2"
          onClick={() => closeModal(onCancel)}
        >
          {cancelText}
        </Button>
        <Button className="col-span-3" onClick={() => closeModal(onOk)}>
          {okText}
        </Button>
      </div>
    ) : (
      <Button
        className={cn(
          'grow',
          //
        )}
        onClick={() => closeModal(onOk)}
      >
        {okText}
      </Button>
    );

  if (!isBrowser) {
    return null;
  }

  return createPortal(
    <Modal
      open={open}
      footer={footer}
      className={cn(
        'z-10000',
        'box-content w-100',
        'rounded-3xl p-4',
        'gap-y-0',
      )}
      classNames={{
        mask: 'z-10000 bg-black/[.6]',
        body: cn(
          'text-black-70 whitespace-pre-wrap text-center',
          content && 'mt-3',
        ),
        footer: 'mt-9',
      }}
      title={
        <p
          className={cn(
            'text-center text-lg leading-normal whitespace-pre-wrap',
            'flex items-center justify-center gap-x-2',
            //
          )}
        >
          {icon || (type && STATIC_ICONS[type])}
          {title}
        </p>
      }
      container={container}
      onCancel={() => closeModal(onCancel)}
      {...props}
    >
      {content}
    </Modal>,
    modalStack.getRootElement(container)!,
  );
};

// No `role`/`aria-modal` here — this element is only a mount point for the
// imperative stack, not the dialog itself. Radix already renders its own
// `role="dialog"`/`aria-modal="true"` on the actual `DialogContent` via
// portal once a modal is open. Setting it here as well would (a) leave
// `aria-modal="true"` on the page permanently, even with zero modals open,
// hiding the rest of the document from screen readers, and (b) duplicate
// Radix's own dialog role once one is open.
const modalStack: ImperativeStack<StaticProps> =
  createImperativeStack<StaticProps>({
    createRootElement: () => {
      const el = document.createElement('div');
      el.style.zIndex = '10000';
      el.style.position = 'absolute';
      return el;
    },
    StackItem: StaticModal,
  });

Modal.destroy = modalStack.destroy;

Modal.destroyAll = () => {
  modalStack.destroy();
};

Modal.info = (props: StaticProps) =>
  modalStack.render({ type: 'info', ...props });
Modal.success = (props: StaticProps) =>
  modalStack.render({ type: 'success', ...props });
Modal.error = (props: StaticProps) =>
  modalStack.render({ type: 'error', ...props });
Modal.warning = (props: StaticProps) =>
  modalStack.render({ type: 'warning', ...props });
Modal.confirm = (props: StaticProps) =>
  modalStack.render({ type: 'confirm', ...props });

export default Modal;
