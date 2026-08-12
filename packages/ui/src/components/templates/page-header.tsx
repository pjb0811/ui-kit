'use client';

import { ArrowLeft } from 'lucide-react';

import { DEFAULT_LOCALE, useConfig } from '@repo/ui/providers';
import { cn, renderConditional } from '@repo/ui/utils';

import Button from '../atoms/button';

export interface Props extends Omit<React.ComponentProps<'div'>, 'title'> {
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  extra?: React.ReactNode;
  backIcon?: React.ReactNode;
  onBack?: () => void;
  classNames?: {
    back?: string;
    title?: string;
    subTitle?: string;
    extra?: string;
  };
}

// Title + back button + extra action area — same shape as Drawer's header
// (title/extra/closable), which this borrows the layout from wholesale;
// PageHeader just swaps Drawer's close button for a back button.
const PageHeader = ({
  title,
  subTitle,
  extra,
  backIcon,
  onBack,
  className,
  classNames,
  children,
  ...props
}: Props) => {
  const { locale } = useConfig();

  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      <div className="flex items-start gap-2">
        {onBack && (
          <Button
            type="text"
            shape="circle"
            size="small"
            aria-label={locale.back ?? DEFAULT_LOCALE.back}
            icon={backIcon || <ArrowLeft />}
            onClick={onBack}
            className={cn(classNames?.back)}
          />
        )}
        <div className="flex flex-1 items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            {title && (
              <p className={cn('text-lg font-medium', classNames?.title)}>
                {title}
              </p>
            )}
            {subTitle && (
              <p
                className={cn(
                  'text-muted-foreground text-sm',
                  classNames?.subTitle,
                )}
              >
                {subTitle}
              </p>
            )}
          </div>
          {renderConditional(extra, v => (
            <div className={cn('shrink-0', classNames?.extra)}>{v}</div>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
};

export default PageHeader;
