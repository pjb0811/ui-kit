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

import { dialog } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

import Button from '../atoms/button';

const {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} = dialog;

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

type ContainerState = {
  stack: StaticProps[];
  update: (() => void) | null;
};

const containerStates = new Map<HTMLElement, ContainerState>();
const modalRootElements = new WeakMap<HTMLElement, HTMLElement>();

const getContainerState = (container: HTMLElement): ContainerState => {
  let state = containerStates.get(container);

  if (!state) {
    state = { stack: [], update: null };
    containerStates.set(container, state);
  }

  return state;
};

// No `role`/`aria-modal` here — this element is only a mount point for the
// imperative stack, not the dialog itself. Radix already renders its own
// `role="dialog"`/`aria-modal="true"` on the actual `DialogContent` via
// portal once a modal is open. Setting it here as well would (a) leave
// `aria-modal="true"` on the page permanently, even with zero modals open,
// hiding the rest of the document from screen readers, and (b) duplicate
// Radix's own dialog role once one is open.
const createModalRoot = (container?: HTMLElement) => {
  if (!isBrowser) {
    return null;
  }

  const targetContainer = container || document.body;
  let rootEl = modalRootElements.get(targetContainer);

  if (!rootEl) {
    rootEl = document.createElement('div');
    rootEl.style.zIndex = '10000';
    rootEl.style.position = 'absolute';
    targetContainer.appendChild(rootEl);
    modalRootElements.set(targetContainer, rootEl);
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
        <div className={cn('break-all', classNames?.body)}>{children}</div>
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
  type,
  title,
  content,
  okText = 'OK',
  cancelText = 'Cancel',
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
    createModalRoot(container)!,
  );
};

const ModalStackRenderer = ({ container }: { container: HTMLElement }) => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const state = getContainerState(container);
    state.update = () => forceUpdate({});
    return () => {
      state.update = null;
    };
  }, [container]);

  const { stack } = getContainerState(container);

  return (
    <>
      {stack.map(({ id, ...props }) => (
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
    root.render(<ModalStackRenderer container={targetContainer} />);
  }

  const state = getContainerState(targetContainer);
  const id = props.id || uuid();
  state.stack.push({ ...props, id });
  state.update?.();

  return id;
};

Modal.destroy = (id?: string) => {
  if (!id) {
    containerStates.forEach(state => {
      state.stack = [];
      state.update?.();
    });
    modalRoots.forEach((root, container) => {
      root.unmount();
      modalRootElements.get(container)?.remove();
      modalRootElements.delete(container);
    });
    modalRoots.clear();
    containerStates.clear();
    return;
  }

  containerStates.forEach((state, container) => {
    if (!state.stack.some(modal => modal.id === id)) {
      return;
    }

    state.stack = state.stack.filter(modal => modal.id !== id);
    state.update?.();

    if (!state.stack.length) {
      modalRoots.get(container)?.unmount();
      modalRoots.delete(container);
      containerStates.delete(container);
      modalRootElements.get(container)?.remove();
      modalRootElements.delete(container);
    }
  });
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
