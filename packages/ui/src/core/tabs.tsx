'use client';

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';

import { cn } from '@repo/ui/utils';

type RootProps = Omit<
  React.ComponentProps<typeof TabsPrimitive.Root>,
  'className'
> & {
  className?: string;
};
type ListProps = Omit<
  React.ComponentProps<typeof TabsPrimitive.List>,
  'className'
> & {
  className?: string;
};
type TabProps = Omit<
  React.ComponentProps<typeof TabsPrimitive.Tab>,
  'className'
> & {
  className?: string;
};
type PanelProps = Omit<
  React.ComponentProps<typeof TabsPrimitive.Panel>,
  'className'
> & {
  className?: string;
};

function Tabs({ className, ...props }: RootProps) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn(
        'flex flex-col data-[orientation=vertical]:flex-row',
        className,
        //
      )}
      {...props}
    />
  );
}

function TabsList({ className, ...props }: ListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        `border-border flex shrink-0 border-b
        data-[orientation=vertical]:flex-col
        data-[orientation=vertical]:border-r
        data-[orientation=vertical]:border-b-0`,
        className,
        //
      )}
      {...props}
    />
  );
}

function TabsTab({ className, ...props }: TabProps) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-tab"
      className={cn(
        `text-muted-foreground hover:text-foreground focus-visible:ring-ring/50
        data-active:border-primary data-active:text-foreground relative -mb-px
        inline-flex items-center justify-center gap-2 border-b-2
        border-transparent px-4 py-2 text-sm font-medium whitespace-nowrap
        transition-colors outline-none focus-visible:rounded-sm
        focus-visible:ring-[3px] data-disabled:pointer-events-none
        data-disabled:opacity-50 data-[orientation=vertical]:-mr-px
        data-[orientation=vertical]:mb-0
        data-[orientation=vertical]:justify-start
        data-[orientation=vertical]:border-r-2
        data-[orientation=vertical]:border-b-0
        data-[orientation=vertical]:text-left`,
        className,
        //
      )}
      {...props}
    />
  );
}

function TabsPanel({ className, ...props }: PanelProps) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-panel"
      className={cn(
        `focus-visible:ring-ring/50 min-w-0 flex-1 p-4 outline-none
        focus-visible:ring-[3px]`,
        className,
        //
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTab, TabsPanel };
