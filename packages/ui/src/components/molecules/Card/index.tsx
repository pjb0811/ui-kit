import { cn } from '@repo/ui/utils';

interface Props extends Omit<React.HTMLProps<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  variant?: 'outlined' | 'borderless';
  classNames?: {
    title?: string;
    body?: string;
  };
}

const Card = ({
  title,
  children,
  className,
  classNames,
  variant = 'outlined',
  ...props
}: Props) => {
  return (
    <div
      className={cn(
        'w-full',
        'rounded-lg p-4',
        'bg-white shadow-sm transition-all',
        variant === 'outlined' && 'border border-gray-200',
        className,
        //
      )}
      {...props}
    >
      {title && (
        <div
          className={cn(
            'mb-4 font-bold',
            classNames?.title,
            //
          )}
        >
          {title}
        </div>
      )}
      <div
        className={cn(
          classNames?.body,
          //
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Card;
