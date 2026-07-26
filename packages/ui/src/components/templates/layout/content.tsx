import { cn } from '@repo/ui/utils';

export interface Props extends React.ComponentPropsWithoutRef<'main'> {}

const Content = ({ children, className, ...props }: Props) => {
  return (
    <main
      className={cn(
        'min-w-0 shrink grow basis-auto',
        // basis-auto (not basis-0) sizes Content from its actual content
        // height first, so flex-grow only adds extra space when content is
        // shorter than the viewport — when content is taller, Content
        // keeps its natural (larger) height instead of clipping to
        // available space and pushes Footer below it. min-h-0 is
        // intentionally omitted here: with basis-auto, the default
        // min-height:auto (content-based) is what makes that possible; on
        // the Sider row's cross axis it's harmless since min-height there
        // governs stretch, not main-axis growth.
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
};

export default Content;
