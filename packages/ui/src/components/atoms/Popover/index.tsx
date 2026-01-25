import {
  Popover as CorePopover,
  PopoverContent,
  PopoverTrigger,
} from '../../../core/popover';
import Typography from '../Typography';

interface Props {
  title?: React.ReactNode;
  content: React.ReactNode;
  children: React.ReactNode;
}

const Popover = ({ title, content, children }: Props) => {
  return (
    <CorePopover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start">
        {title && typeof title === 'string' ? (
          <Typography.Title level={5}>{title}</Typography.Title>
        ) : (
          title
        )}
        {content}
      </PopoverContent>
    </CorePopover>
  );
};

export default Popover;
