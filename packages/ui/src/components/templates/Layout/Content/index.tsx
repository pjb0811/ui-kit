import { cn } from '@repo/ui/utils';

export interface Props extends React.ComponentPropsWithoutRef<'main'> {}

const Content = ({ children, className, ...props }: Props) => {
  return (
    <main
      className={cn('min-h-0 min-w-0 shrink grow basis-0', className)}
      {...props}
    >
      {children}
    </main>
  );
};

export default Content;
