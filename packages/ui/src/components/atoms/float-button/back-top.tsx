'use client';

import { type MouseEvent, useRef } from 'react';

import { useMergedRef, useWindowScroll } from '@jbpark/use-hooks';
import { ArrowUp } from 'lucide-react';

import { cn } from '@repo/ui/utils';

import { type Props as ButtonProps } from '../button';
import FloatButton from './float-button';

export interface Props extends ButtonProps {
  visibilityHeight?: number;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}

const BackTop = ({
  ref,
  visibilityHeight = 450,
  className,
  onClick,
  ...props
}: Props) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Track/scroll whichever window actually renders this button — not
  // necessarily the host `window`, since this can be portaled into an
  // iframe (e.g. live-editor's Renderer).
  const { y } = useWindowScroll(buttonRef);

  const mergedRef = useMergedRef(buttonRef, ref);

  return (
    <FloatButton
      ref={mergedRef}
      aria-label="맨 위로"
      icon={<ArrowUp />}
      className={cn(
        className,
        (!y || visibilityHeight > y) && 'hidden',
        //
      )}
      onClick={e => {
        const view = buttonRef.current?.ownerDocument.defaultView ?? window;
        view.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        onClick?.(e);
      }}
      {...props}
    />
  );
};

export default BackTop;
