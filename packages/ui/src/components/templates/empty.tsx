import { Inbox } from 'lucide-react';

import { cn } from '@repo/ui/utils';

export interface Props extends Omit<React.ComponentProps<'div'>, 'title'> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

// The counterpart List's `empty` prop was asking for — List/Upload/Swiper
// each render arbitrary content for their empty state today with nothing
// in the library actually meant to go there. Pairs with Skeleton the same
// way Skeleton pairs with real content: one placeholder for "nothing
// loaded yet", one for "loaded, and there's nothing".
const Empty = ({
  icon,
  title,
  description = 'No data',
  action,
  className,
  ...props
}: Props) => {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-12 text-center',
        className,
        //
      )}
      {...props}
    >
      <div className="text-muted-foreground [&_svg]:size-12">
        {icon ?? <Inbox />}
      </div>
      {title && <p className="text-sm font-medium">{title}</p>}
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
};

export default Empty;
