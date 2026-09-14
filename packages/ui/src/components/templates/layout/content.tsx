'use client';

import { useRender } from '@base-ui/react/use-render';

import { cn } from '@repo/ui/utils';

import { SiderRegistryContext } from './sider-context';

export interface Props extends Omit<
  useRender.ComponentProps<'main'>,
  'className'
> {
  className?: string;
}

const Content = ({ children, className, render, ...props }: Props) => {
  // Only one <main> landmark should exist per page — a Layout nested
  // inside a page that already has its own <main> (or a Content nested
  // inside another Content) needs a way to opt out of rendering a second
  // one. Base UI's render contract merges these props/classes onto the
  // caller's own element instead.
  return useRender({
    defaultTagName: 'main',
    render,
    props: {
      ...props,
      className: cn(
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
      ),
      children: (
        <SiderRegistryContext.Provider value={null}>
          {children}
        </SiderRegistryContext.Provider>
      ),
    },
  });
};

export default Content;
