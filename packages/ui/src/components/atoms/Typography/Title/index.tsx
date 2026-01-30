import { cn } from '@repo/ui/utils';

export interface Props extends React.ComponentPropsWithoutRef<
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

type ElementType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const styles: Record<string, string> = {
  h1: 'text-6xl',
  h2: 'text-5xl',
  h3: 'text-4xl',
  h4: 'text-3xl',
  h5: 'text-2xl',
  h6: 'text-xl',
};

const Title = ({ children, level = 1, className, ...props }: Props) => {
  const Element: ElementType = level < 1 || level > 6 ? 'h1' : `h${level}`;

  return (
    <Element
      className={cn('leading-snug font-bold', styles[Element], className)}
      {...props}
    >
      {children}
    </Element>
  );
};

export default Title;
