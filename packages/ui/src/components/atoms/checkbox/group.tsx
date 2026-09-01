'use client';

import { useControllableState } from '@jbpark/use-hooks';

import { cn } from '@repo/ui/utils';

import {
  type Option,
  type OptionGroupClassNames,
  type OptionValue,
  type Options,
  normalizeOptions,
  warnOnDuplicateOptionValues,
} from '../option-group';
import Checkbox from './checkbox';

export type { OptionValue };

export interface Props extends Omit<
  React.ComponentPropsWithoutRef<'ul'>,
  'onChange' | 'defaultValue' | 'value'
> {
  options?: Options;
  orientation?: 'vertical' | 'horizontal';
  placement?: 'left' | 'right';
  classNames?: OptionGroupClassNames;
  defaultValue?: OptionValue[];
  value?: OptionValue[];
  /** Native form field name, shared across every option's checkbox. */
  name?: string;
  disabled?: boolean;
  onChange?: (values: OptionValue[]) => void;
}

const Group = ({
  orientation = 'vertical',
  placement = 'left',
  className,
  classNames = {},
  options: _options = [],
  name,
  disabled,
  defaultValue,
  value: _value,
  onChange: _onChange = () => {},
  ...props
}: Props) => {
  const [value, setValue] = useControllableState<OptionValue[]>({
    value: _value,
    defaultValue: defaultValue ?? [],
    onChange: _onChange,
  });

  const options: Option[] = normalizeOptions(_options);
  warnOnDuplicateOptionValues(options, 'Checkbox.Group');

  const onChange = (checked: boolean, optionValue: OptionValue) => {
    const nextValue = checked
      ? [...value, optionValue]
      : value.filter(v => v !== optionValue);

    setValue(nextValue);
  };

  return (
    <ul
      {...props}
      className={cn(
        // Spacing comes from `gap`, not `space-y`'s child margins, so the
        // per-item `m-0` reset below can neutralise host list styles without
        // also wiping out the group's own spacing.
        'm-0 flex list-none gap-2 p-0',
        orientation === 'vertical' && 'flex-col',
        className,
      )}
    >
      {options.map((item: Option, index) => {
        const checked = value.includes(item.value);

        return (
          <li
            key={`${index}-${String(item.value)}`}
            // `m-0` completes the list reset the `ul` above starts (#253) —
            // see Radio.Group for the host rule this guards against.
            className={cn('m-0 flex', classNames?.wrapper)}
          >
            <Checkbox
              placement={placement}
              className={cn(classNames?.item)}
              name={name}
              value={item.value}
              checked={checked}
              disabled={disabled || item.disabled}
              onChange={checked => onChange(checked, item.value)}
            >
              {item.label}
            </Checkbox>
          </li>
        );
      })}
    </ul>
  );
};

export default Group;
