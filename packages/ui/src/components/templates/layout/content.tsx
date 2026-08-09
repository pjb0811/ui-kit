import { Slot } from '@radix-ui/react-slot';

import { cn } from '@repo/ui/utils';

export interface Props extends React.ComponentProps<'main'> {
  asChild?: boolean;
}

const Content = ({ children, className, asChild = false, ...props }: Props) => {
  // Only one <main> landmark should exist per page — a Layout nested
  // inside a page that already has its own <main> (or a Content nested
  // inside another Content) needs a way to opt out of rendering a second
  // one. asChild + Slot (same pattern as core/button.tsx and
  // core/badge.tsx) merges these props/classes onto the caller's own
  // element instead.
  const Comp = asChild ? Slot : 'main';

  return (
    <Comp
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
    </Comp>
  );
};

export default Content;
