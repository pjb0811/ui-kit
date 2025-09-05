import NextLink, { LinkProps } from 'next/link';

import { TEXT_LEVELS } from '@repo/ui/enums';
import { cn } from '@repo/ui/utils';

import { TypographyProps } from '..';

interface Props extends LinkProps, React.HTMLAttributes<HTMLAnchorElement> {
  level?: TypographyProps['level'];
}

const Link = ({ children, className, level, ...props }: Props) => {
  return (
    <NextLink
      className={cn(
        'underline-offset-1 hover:underline',
        level ? TEXT_LEVELS[level] : '',
        className,
        //
      )}
      {...props}
    >
      {children}
    </NextLink>
  );
};

export default Link;
