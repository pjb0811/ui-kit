import { MouseEvent } from 'react';

import { useWindowScroll } from '@uidotdev/usehooks';
// import Icon from '../../Icon';
import { ArrowUp } from 'lucide-react';

import { cn } from '@repo/ui/utils';

import FloatButton from '..';
import { type Props as ButtonProps } from '../../Button';

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
      size="icon"
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
