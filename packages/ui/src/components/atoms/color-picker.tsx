'use client';

import { HexColorPicker } from 'react-colorful';

import { useControllableState } from '@jbpark/use-hooks';

import { cn } from '@repo/ui/utils';

import Popover from './popover';

export interface Props extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'onChange' | 'defaultValue' | 'value' | 'onClick' | 'onKeyDown' | 'open'
> {
  defaultValue?: string;
  value?: string;
  showText?: boolean;
  disabled?: boolean;
  onChange?: (color: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ColorPicker = ({
  defaultValue,
  value: _value,
  showText,
  disabled,
  className,
  onChange: _onChange = () => {},
  open: _open,
  defaultOpen,
  onOpenChange,
  ...props
}: Props) => {
  const [value, setValue] = useControllableState<string>({
    value: _value,
    defaultValue: defaultValue ?? '#fff',
    onChange: _onChange,
  });
  const [open, setOpen] = useControllableState<boolean>({
    value: _open,
    defaultValue: defaultOpen ?? false,
    onChange: onOpenChange,
  });

  const onChange = (color: string) => {
    if (disabled) {
      return;
    }
    setValue(color);
  };

  return (
    <Popover
      placement="bottomLeft"
      open={open}
      onOpenChange={setOpen}
      content={<HexColorPicker color={value} onChange={onChange} />}
    >
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        className={cn(
          'inline-flex items-center',
          'rounded border p-0.5',
          disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
        {...props}
        onClick={e => {
          if (disabled) {
            e.preventDefault();
          }
        }}
        onKeyDown={e => {
          if (disabled) {
            return;
          }
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.currentTarget.click();
          }
        }}
      >
        <div
          className={cn(
            'size-6 rounded border',
            'shadow-sm',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
          style={{ backgroundColor: value }}
        />
        {showText && (
          <span className="px-1 font-mono text-sm font-medium">
            {value.toUpperCase()}
          </span>
        )}
      </div>
    </Popover>
  );
};

export default ColorPicker;
