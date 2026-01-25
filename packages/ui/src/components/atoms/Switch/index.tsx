import { Switch as Core } from '@repo/ui/core/switch';
import { cn } from '@repo/ui/utils';

export interface Props extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'onChange'
> {
  classNames?: {
    track?: string;
    handle?: string;
  };
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

const Switch = ({ onChange, className, classNames, ...props }: Props) => {
  return (
    <Core
      className={cn(className, classNames?.track)}
      handleClassName={cn(classNames?.handle)}
      onCheckedChange={checked => {
        onChange?.(checked);
      }}
      {...props}
    />
  );
};

export default Switch;
