'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Root, createRoot } from 'react-dom/client';

import {
  Check,
  CircleQuestionMark,
  Info,
  OctagonAlert,
  OctagonX,
} from 'lucide-react';
import { v4 as uuid } from 'uuid';

import { cn } from '@repo/ui/utils';

import { Button } from '../../../components/atoms';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../core/dialog';

interface Props {
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

const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';

let modalRoot: Root | null = null;
let modalStack: StaticProps[] = [];
let updateStack: (() => void) | null = null;

const createModalRoot = (container?: HTMLElement) => {
  if (!isBrowser) {
    return null;
  }

  const targetContainer = container || document.body;
  let rootEl = targetContainer.querySelector(
    '#modal-root',
  ) as HTMLElement | null;

  if (!rootEl) {
    rootEl = document.createElement('div');
    rootEl.setAttribute('id', 'modal-root');
    rootEl.setAttribute('role', 'dialog');
    rootEl.setAttribute('aria-modal', 'true');
    rootEl.style.zIndex = '10000';
    rootEl.style.position = 'absolute';
    targetContainer.appendChild(rootEl);
  }

  return rootEl;
};

const Modal = ({
  open = false,
  maskClosable = false,
  closable = false,
  closeIcon,
  className,
  classNames,
  style,
  title,
  footer,
  container,
  children,
  okText = '확인',
  cancelText = '취소',
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
        if (!open && maskClosable) {
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
        showCloseButton={!!closable}
        closeIcon={closeIcon}
        container={container}
        onCancel={onCancel}
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
        <div className={cn('break-all', classNames?.body)}>{children}</div>
        {footer !== null && (
          <DialogFooter
            className={cn('flex-row justify-end gap-x-2', classNames?.footer)}
          >
            {footer || (
              <>
                <Button onClick={onOk}>{okText}</Button>
                <Button variant="outline" onClick={onCancel}>
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
  type,
  title,
  content,
  okText = '확인',
  cancelText = '취소',
  id,
  container,
  icon,
  onOk,
  onCancel,
  ...props
}: StaticProps) => {
  const [open, setOpen] = useState(true);

  const closeModal = (callback?: () => void) => {
    callback?.();
    setOpen(false);
    setTimeout(() => {
      Modal.destroy(id);
    }, 200);
  };

  const footer =
    type === 'confirm' ? (
      <div className="grid w-full grid-cols-5 gap-x-2">
        <Button
          size="lg"
          variant="outline"
          className="col-span-2"
          onClick={() => closeModal(onCancel)}
        >
          {cancelText}
        </Button>
        <Button
          size="lg"
          className="col-span-3"
          onClick={() => closeModal(onOk)}
        >
          {okText}
        </Button>
      </div>
    ) : (
      <Button
        className={cn(
          'grow',
          //
        )}
        size="lg"
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
        'z-[10000]',
        'box-content w-100',
        'rounded-3xl p-4',
        'gap-y-0',
      )}
      classNames={{
        mask: 'z-[10000] bg-black/[.6]',
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
      onCancel={() => closeModal(onOk)}
      {...props}
    >
      {content}
    </Modal>,
    createModalRoot(container)!,
  );
};

const ModalStackRenderer = () => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    updateStack = () => forceUpdate({});
    return () => {
      updateStack = null;
    };
  }, []);

  return (
    <>
      {modalStack.map(({ id, ...props }) => (
        <StaticModal key={id} id={id} {...props} />
      ))}
    </>
  );
};

const modalRoots = new Map<HTMLElement, Root>();

const renderModal = (props: StaticProps) => {
  if (!isBrowser) {
    return;
  }

  const targetContainer = props.container || document.body;
  const rootElement = createModalRoot(targetContainer)!;

  if (!modalRoots.has(targetContainer)) {
    const root = createRoot(rootElement);
    modalRoots.set(targetContainer, root);
    root.render(<ModalStackRenderer />);
  }

  const id = props.id || uuid();
  modalStack.push({ ...props, id });
  updateStack?.();

  return id;
};

Modal.destroy = (id?: string) => {
  modalStack = id ? modalStack.filter(modal => modal.id !== id) : [];

  updateStack?.();

  if (!modalStack.length && modalRoot) {
    modalRoot.unmount();
    modalRoot = null;
  }
};

Modal.destroyAll = () => {
  Modal.destroy();
};

Modal.info = (props: StaticProps) => renderModal({ type: 'info', ...props });
Modal.success = (props: StaticProps) =>
  renderModal({ type: 'success', ...props });
Modal.error = (props: StaticProps) => renderModal({ type: 'error', ...props });
Modal.warning = (props: StaticProps) =>
  renderModal({ type: 'warning', ...props });
Modal.confirm = (props: StaticProps) =>
  renderModal({ type: 'confirm', ...props });

export default Modal;
