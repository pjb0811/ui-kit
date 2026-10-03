'use client';

import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { UserRound } from 'lucide-react';

import { type ComponentSize, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

const sizes: Record<ComponentSize, string> = {
  small: 'size-8 text-xs',
  middle: 'size-10 text-sm',
  large: 'size-12 text-base',
};

export interface Props extends Omit<
  React.ComponentPropsWithoutRef<'span'>,
  'children'
> {
  src?: string;
  /** A person's name or image description. Use an empty string for a decorative avatar. */
  alt: string;
  /** Initials, an icon, or other content shown until the image loads or if it fails. */
  fallback?: React.ReactNode;
  size?: ComponentSize;
  loading?: 'eager' | 'lazy';
  classNames?: {
    image?: string;
    fallback?: string;
  };
}

const Avatar = ({
  src,
  alt,
  fallback,
  size,
  loading,
  className,
  classNames,
  ...props
}: Props) => {
  const { componentSize } = useConfig();
  const resolvedSize = size ?? componentSize ?? 'middle';

  return (
    <BaseAvatar.Root
      data-slot="avatar"
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={cn(
        `bg-muted text-muted-foreground relative inline-flex shrink-0
        overflow-hidden rounded-full`,
        sizes[resolvedSize],
        className,
        //
      )}
      {...props}
    >
      <BaseAvatar.Fallback
        className={cn(
          'absolute inset-0 flex items-center justify-center font-medium',
          classNames?.fallback,
          //
        )}
      >
        {fallback ?? <UserRound aria-hidden="true" className="size-1/2" />}
      </BaseAvatar.Fallback>
      {src && (
        <BaseAvatar.Image
          src={src}
          alt=""
          loading={loading}
          keepMounted
          className={cn(
            `absolute inset-0 size-full object-cover data-error:invisible
            data-loading:invisible`,
            classNames?.image,
            //
          )}
        />
      )}
    </BaseAvatar.Root>
  );
};

export default Avatar;
