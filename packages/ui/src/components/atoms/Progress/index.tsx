import { cn } from '@repo/ui/utils';

import { Progress as Core } from '../../../core/progress';

interface Props extends React.HTMLAttributes<HTMLElement> {
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
  const percent = isNaN(value) ? 0 : value;

  return (
    <Core
      value={value}
      className={cn(
        isHorizontal ? 'h-4 w-full' : 'h-full w-4 flex-col justify-end',
        className,
        classNames?.background,
        //
      )}
      barClassName={classNames?.bar}
      barStyle={{
        transform: 'none',
        [dimension]: `${percent}%`,
        //
      }}
    />
  );
};

export default Progress;
