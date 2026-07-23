import { cn } from '@repo/ui/utils';

export interface Props extends React.ComponentPropsWithoutRef<
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

type ElementType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

// Scale up at wider breakpoints instead of a single fixed size — the desktop
// size stays the same as before, but narrow/mobile viewports now get a
// smaller starting size instead of always rendering at the full desktop size.
const styles: Record<string, string> = {
  h1: 'text-4xl sm:text-5xl lg:text-6xl',
  h2: 'text-3xl sm:text-4xl lg:text-5xl',
  h3: 'text-2xl sm:text-3xl lg:text-4xl',
  h4: 'text-xl sm:text-2xl lg:text-3xl',
  h5: 'text-lg sm:text-xl lg:text-2xl',
  h6: 'text-base sm:text-lg lg:text-xl',
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
