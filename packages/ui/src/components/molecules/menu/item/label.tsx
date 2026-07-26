import { cn } from '@repo/ui/utils';

import Typography from '../../../atoms/typography';

interface Props extends React.ComponentPropsWithoutRef<
  typeof Typography.Text
> {}

const Label = ({ children, className, ...props }: Props) => {
  if (typeof children === 'string') {
    return (
      <Typography.Text className={cn(className)} {...props}>
        {children}
      </Typography.Text>
    );
  }

  return children;
};

export default Label;
