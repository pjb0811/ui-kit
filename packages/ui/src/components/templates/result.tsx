import {
  Check,
  FileQuestion,
  Info,
  OctagonAlert,
  OctagonX,
  ServerCrash,
  ShieldAlert,
} from 'lucide-react';

import { cn } from '@repo/ui/utils';

type Status = 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';

// Reuses Modal's exact STATIC_ICONS set (Check/OctagonX/Info/OctagonAlert,
// same colors) for the 4 statuses they share, so a Result page matches the
// tone of a Modal.success()/error()/etc a user may have just seen.
const STATUS_ICONS: Record<Status, React.ReactNode> = {
  success: <Check className="text-green-400" />,
  error: <OctagonX className="text-red-400" />,
  info: <Info className="text-blue-400" />,
  warning: <OctagonAlert className="text-yellow-400" />,
  '404': <FileQuestion className="text-muted-foreground" />,
  '403': <ShieldAlert className="text-muted-foreground" />,
  '500': <ServerCrash className="text-muted-foreground" />,
};

export interface Props extends Omit<React.ComponentProps<'div'>, 'title'> {
  status?: Status;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  extra?: React.ReactNode;
}

// Full-page success/failure/404/403 state screen — Empty's larger,
// more prominent sibling (Empty says "nothing here yet" inline within a
// list/table; Result says "here's what happened" for an entire page/view).
const Result = ({
  status = 'info',
  icon,
  title,
  subTitle,
  extra,
  className,
  children,
  ...props
}: Props) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-16 text-center',
        className,
        //
      )}
      {...props}
    >
      <div className="mb-2 [&_svg]:size-16">{icon ?? STATUS_ICONS[status]}</div>
      {title && <p className="text-xl font-medium">{title}</p>}
      {subTitle && <p className="text-muted-foreground text-sm">{subTitle}</p>}
      {extra && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {extra}
        </div>
      )}
      {children && <div className="mt-4 w-full">{children}</div>}
    </div>
  );
};

export default Result;
