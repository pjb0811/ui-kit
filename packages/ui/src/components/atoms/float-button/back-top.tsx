'use client';

import { MouseEvent } from 'react';

import { useWindowScroll } from '@uidotdev/usehooks';
import { ArrowUp } from 'lucide-react';

import { cn } from '@repo/ui/utils';

import { type Props as ButtonProps } from '../button';
import FloatButton from './float-button';

export interface Props extends ButtonProps {
  visibilityHeight?: number;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}

const BackTop = ({
  visibilityHeight = 450,
  className,
  onClick,
  ...props
}: Props) => {
  const [{ y }, scrollTo] = useWindowScroll();

  return (
    <FloatButton
      aria-label="맨 위로"
      icon={<ArrowUp />}
      className={cn(
        className,
        (!y || visibilityHeight > y) && 'hidden',
        //
      )}
      onClick={e => {
        scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        onClick?.(e);
      }}
      {...props}
    />
  );
};

export default BackTop;
