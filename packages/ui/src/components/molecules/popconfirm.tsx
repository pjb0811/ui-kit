'use client';

import * as React from 'react';

import { useControllableState } from '@jbpark/use-hooks';

import { cn } from '@repo/ui/utils';

import Button, { type Props as ButtonProps } from '../atoms/button';
import Popover, { type Props as PopoverProps } from '../atoms/popover';
import Typography from '../atoms/typography';

type ActionProps = Omit<
  ButtonProps,
  'children' | 'onClick' | 'loading' | 'disabled'
>;

export interface Props extends Omit<
  PopoverProps,
  'content' | 'title' | 'children'
> {
  children: React.ReactElement;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** A fulfilled promise closes the popup; a thrown error keeps it open. */
  onConfirm?: () => void | Promise<void>;
  /** Only the Cancel button invokes this callback. */
  onCancel?: () => void;
  onConfirmError?: (error: unknown) => void;
  errorMessage?: React.ReactNode;
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;
  disabled?: boolean;
  confirmButtonProps?: ActionProps;
  cancelButtonProps?: ActionProps;
  classNames?: {
    title?: string;
    description?: string;
    actions?: string;
    confirm?: string;
    cancel?: string;
    error?: string;
  };
}

const Popconfirm = ({
  children,
  title,
  description,
  onConfirm,
  onCancel,
  onConfirmError,
  errorMessage = 'Unable to complete the action. Please try again.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  disabled = false,
  confirmButtonProps,
  cancelButtonProps,
  className,
  classNames,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  ...props
}: Props) => {
  const [open, setOpen] = useControllableState<boolean>({
    value: controlledOpen,
    defaultValue: defaultOpen ?? false,
    onChange: onOpenChange,
  });
  const [pending, setPending] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const busy = React.useRef(false);
  const mounted = React.useRef(false);
  const generation = React.useRef(0);
  const descriptionId = React.useId();
  const titleId = React.useId();

  React.useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
      generation.current += 1;
    };
  }, []);

  React.useEffect(() => {
    if (!open || disabled) {
      generation.current += 1;
    }
  }, [open, disabled]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (busy.current || (disabled && nextOpen)) {
      return;
    }

    setFailed(false);
    setOpen(nextOpen);
  };

  const handleConfirm = async () => {
    if (busy.current || disabled) {
      return;
    }

    busy.current = true;
    setPending(true);
    setFailed(false);
    const request = generation.current;

    try {
      await onConfirm?.();

      if (mounted.current && request === generation.current) {
        setOpen(false);
      }
    } catch (error) {
      if (mounted.current && request === generation.current) {
        setFailed(true);
        onConfirmError?.(error);
      }
    } finally {
      busy.current = false;

      if (mounted.current) {
        setPending(false);
      }
    }
  };

  return (
    <Popover
      {...props}
      open={open && !disabled}
      onOpenChange={handleOpenChange}
      className={cn(
        'max-w-[calc(100vw-2rem)]',
        className, //
      )}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      content={
        <div data-slot="popconfirm" aria-busy={pending} className="space-y-3">
          <Typography.Title
            level={6}
            id={titleId}
            className={classNames?.title}
          >
            {title}
          </Typography.Title>
          {description && (
            <div
              id={descriptionId}
              className={cn(
                'text-muted-foreground text-sm',
                classNames?.description, //
              )}
            >
              {description}
            </div>
          )}
          {failed && (
            <div
              role="alert"
              className={cn(
                'text-destructive text-sm',
                classNames?.error, //
              )}
            >
              {errorMessage}
            </div>
          )}
          <div
            className={cn(
              'flex justify-end gap-2',
              classNames?.actions, //
            )}
          >
            <Button
              size="small"
              {...cancelButtonProps}
              htmlType="button"
              disabled={pending}
              className={cn(
                cancelButtonProps?.className,
                classNames?.cancel, //
              )}
              onClick={() => {
                if (busy.current) {
                  return;
                }

                setFailed(false);
                setOpen(false);
                onCancel?.();
              }}
            >
              {cancelText}
            </Button>
            <Button
              size="small"
              type="primary"
              {...confirmButtonProps}
              htmlType="button"
              loading={pending}
              className={cn(
                confirmButtonProps?.className,
                classNames?.confirm, //
              )}
              onClick={() => void handleConfirm()}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      }
    >
      {children}
    </Popover>
  );
};

export default Popconfirm;
