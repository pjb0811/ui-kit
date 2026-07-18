import { progress } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

const { Progress: Core } = progress;

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  value: number;
  direction?: 'horizontal' | 'vertical';
  classNames?: {
    background?: string;
    bar?: string;
  };
}

const Progress = ({
  value,
  className,
  direction = 'horizontal',
  classNames,
  //
}: Props) => {
  const isHorizontal = direction === 'horizontal';
  const dimension = isHorizontal ? 'width' : 'height';
  const normalizedValue = Number.isFinite(value)
    ? Math.min(100, Math.max(0, value))
    : 0;

  return (
    <Core
      value={normalizedValue}
      className={cn(
        isHorizontal ? 'h-4 w-full' : 'flex h-full w-4 flex-col justify-end',
        className,
        classNames?.background,
        //
      )}
      barClassName={cn('flex-none', classNames?.bar)}
      barStyle={{
        transform: 'none',
        [dimension]: `${normalizedValue}%`,
        //
      }}
    />
  );
};

export default Progress;
