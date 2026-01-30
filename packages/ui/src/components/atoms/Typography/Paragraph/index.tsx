import { cn } from '@repo/ui/utils';

export interface Props extends React.ComponentPropsWithoutRef<'p'> {}

const Paragraph = ({ children, className, ...props }: Props) => {
  return (
    <p
      {...props}
      className={cn(
        className,
        //
      )}
    >
      {children}
    </p>
  );
};

export default Paragraph;
