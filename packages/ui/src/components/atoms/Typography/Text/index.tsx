import { cn } from '@repo/ui/utils';

export interface Props extends React.ComponentPropsWithoutRef<'span'> {
  underline?: boolean;
  strong?: boolean;
}

const Text = ({ children, underline, strong, className, ...props }: Props) => {
  return (
    <span
      className={cn(
        'text-nowrap',
        underline && 'underline',
        strong && 'font-bold',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Text;
