'use client';

import type { ComponentPropsWithRef } from 'react';

import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';

import { cn } from '@repo/ui/utils';

export interface Props extends ComponentPropsWithRef<'div'> {
  /** Scrollable axes. Defaults to vertical; bound the root's size on each enabled axis. */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Accessible region name for the viewport. */
  label?: string;
  /** Native viewport props, including its ref and onScroll. Overrides viewport defaults. */
  viewportProps?: Omit<ComponentPropsWithRef<'div'>, 'children' | 'className'>;
  /** Internal styling slots. Scrollbar and thumb classes apply to both axes. */
  classNames?: {
    viewport?: string;
    content?: string;
    scrollbar?: string;
    thumb?: string;
    corner?: string;
  };
}

function ScrollArea({
  orientation = 'vertical',
  label,
  viewportProps,
  className,
  classNames,
  children,
  ...props
}: Props) {
  const hasVertical = orientation !== 'horizontal';
  const hasHorizontal = orientation !== 'vertical';

  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn(
        'relative isolate overflow-hidden',
        className, //
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        role={label ? 'region' : undefined}
        aria-label={label}
        tabIndex={0}
        {...viewportProps}
        style={{
          overflowX: hasHorizontal ? 'auto' : 'hidden',
          overflowY: hasVertical ? 'auto' : 'hidden',
          ...viewportProps?.style,
        }}
        className={cn(
          `focus-visible:ring-ring/50 h-full w-full rounded-[inherit]
          outline-none focus-visible:ring-2 focus-visible:ring-inset`,
          classNames?.viewport,
          //
        )}
      >
        <ScrollAreaPrimitive.Content
          data-slot="scroll-area-content"
          style={{ minWidth: hasHorizontal ? 'fit-content' : 0 }}
          className={cn(
            hasVertical && 'pe-3',
            hasHorizontal && 'pb-3',
            classNames?.content,
            //
          )}
        >
          {children}
        </ScrollAreaPrimitive.Content>
      </ScrollAreaPrimitive.Viewport>
      {(['vertical', 'horizontal'] as const).map(axis => {
        if (
          (axis === 'vertical' && !hasVertical) ||
          (axis === 'horizontal' && !hasHorizontal)
        ) {
          return null;
        }

        return (
          <ScrollAreaPrimitive.Scrollbar
            key={axis}
            data-slot="scroll-area-scrollbar"
            orientation={axis}
            className={cn(
              'flex touch-none p-0.5 select-none',
              axis === 'vertical' ? 'w-2.5' : 'h-2.5 flex-col',
              classNames?.scrollbar,
              //
            )}
          >
            <ScrollAreaPrimitive.Thumb
              data-slot="scroll-area-thumb"
              className={cn(
                `bg-border hover:bg-muted-foreground/50 relative flex-1
                rounded-full`,
                classNames?.thumb,
                //
              )}
            />
          </ScrollAreaPrimitive.Scrollbar>
        );
      })}
      {hasVertical && hasHorizontal && (
        <ScrollAreaPrimitive.Corner
          data-slot="scroll-area-corner"
          className={cn(
            'bg-background',
            classNames?.corner, //
          )}
        />
      )}
    </ScrollAreaPrimitive.Root>
  );
}

export { ScrollArea };
