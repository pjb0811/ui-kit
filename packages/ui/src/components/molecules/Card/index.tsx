import { cn, renderConditional } from '@repo/ui/utils';

interface Props extends Omit<React.ComponentPropsWithRef<'div'>, 'title'> {
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
      {renderConditional(title, v => (
        <div
          className={cn(
            'mb-4 font-bold',
            classNames?.title,
            //
          )}
        >
          {v}
        </div>
      ))}
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
