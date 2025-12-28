import { TEXT_LEVELS } from '@repo/ui/enums';
import { cn } from '@repo/ui/utils';

import { TypographyProps } from '..';

export interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  level?: TypographyProps['level'];
}

const Link = ({ children, className, level, ...props }: Props) => {
  return (
    <a
      className={cn(
        'underline-offset-1 hover:underline',
        level ? TEXT_LEVELS[level] : '',
        className,
        //
      )}
      {...props}
    >
      {children}
    </a>
  );
};

export default Link;
