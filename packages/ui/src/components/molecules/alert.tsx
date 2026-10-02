'use client';

import { useState } from 'react';

import { Check, Info, OctagonAlert, OctagonX, X } from 'lucide-react';

import { DEFAULT_LOCALE, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import Button from '../atoms/button';

type Status = 'info' | 'success' | 'warning' | 'error';

export interface Props extends Omit<
  React.ComponentPropsWithRef<'div'>,
  'title'
> {
  status?: Status;
  variant?: 'outlined' | 'filled';
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Pass `null` to hide the status icon. */
  icon?: React.ReactNode;
  action?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  classNames?: {
    icon?: string;
    title?: string;
    description?: string;
    action?: string;
    close?: string;
  };
}

const STATUS_ICONS: Record<Status, React.ReactNode> = {
  info: <Info />,
  success: <Check />,
  warning: <OctagonAlert />,
  error: <OctagonX />,
};

const Alert = ({
  status = 'info',
  variant = 'outlined',
  title,
  description,
  icon,
  action,
  closable = false,
  onClose,
  className,
  classNames,
  role = 'status',
  ...props
}: Props) => {
  const { locale } = useConfig();
  const [visible, setVisible] = useState(true);
  const renderedIcon = icon === undefined ? STATUS_ICONS[status] : icon;

  if (!visible) {
    return null;
  }

  return (
    <div
      {...props}
      data-slot="alert"
      data-status={status}
      data-variant={variant}
      role={role}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg border p-4',
        className,
        //
      )}
    >
      {renderedIcon && (
        <span
          aria-hidden="true"
          className={cn(
            'mt-0.5 shrink-0 [&_svg]:size-5',
            classNames?.icon,
            //
          )}
        >
          {renderedIcon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            'text-sm font-semibold',
            classNames?.title,
            //
          )}
        >
          {title}
        </div>
        {description && (
          <div
            className={cn(
              'text-muted-foreground mt-1 text-sm',
              classNames?.description,
              //
            )}
          >
            {description}
          </div>
        )}
        {action && (
          <div
            className={cn(
              'mt-3',
              classNames?.action,
              //
            )}
          >
            {action}
          </div>
        )}
      </div>
      {closable && (
        <Button
          variant="text"
          shape="circle"
          size="small"
          aria-label={locale.close ?? DEFAULT_LOCALE.close}
          icon={<X />}
          className={classNames?.close}
          onClick={() => {
            onClose?.();
            setVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default Alert;
