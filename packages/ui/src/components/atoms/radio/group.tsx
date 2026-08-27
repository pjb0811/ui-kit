'use client';

import { useId } from 'react';

import { useControllableState } from '@jbpark/use-hooks';

import { cn } from '@repo/ui/utils';

import { radio } from '../../../core';
import Button from '../button';
import {
  type Option,
  type OptionGroupClassNames,
  type OptionValue,
  type Options,
  normalizeOptions,
  warnOnDuplicateOptionValues,
} from '../option-group';
import { RadioGroupContext } from './context';
import Radio from './radio';

const { RadioGroup: Core, RadioGroupItem: Item } = radio;

export type { OptionValue };

export interface Props extends Omit<
  React.ComponentPropsWithoutRef<'ul'>,
  'onChange' | 'defaultValue' | 'value'
> {
  options?: Options;
  orientation?: 'vertical' | 'horizontal';
  placement?: 'left' | 'right';
  classNames?: OptionGroupClassNames;
  defaultValue?: OptionValue;
  value?: OptionValue;
  /** Native form field name — participates in `FormData` when set. */
  name?: string;
  optionType?: 'default' | 'button';
  buttonStyle?: 'solid' | 'outlined';
  size?: 'small' | 'middle' | 'large';
  disabled?: boolean;
  onChange?: (value: OptionValue) => void;
}

const RadioGroup = ({
  orientation = 'horizontal',
  placement = 'left',
  className,
  classNames = {},
  options: _options = [],
  name,
  optionType = 'default',
  buttonStyle = 'solid',
  size,
  disabled,
  defaultValue,
  value: _value,
  onChange: _onChange = () => {},
  ...props
}: Props) => {
  const [value, setValue] = useControllableState<OptionValue>({
    value: _value,
    defaultValue,
    onChange: _onChange,
  });

  const options: Option[] = normalizeOptions(_options);
  warnOnDuplicateOptionValues(options, 'Radio.Group');

  const isButton = optionType === 'button';

  const onChange = (checked: boolean, optionValue: OptionValue) => {
    if (!checked) {
      return;
    }
    setValue(optionValue);
  };

  // A single Radix radiogroup root owns every option so that arrow keys move
  // focus across the whole group. `id` stays index-derived (for DOM
  // id/label pairing), but Radix itself now addresses/submits items by
  // their real (stringified) `value` — see radio.tsx.
  const baseId = useId();
  const getOptionId = (index: number) => `${baseId}-${index}`;
  const checkedItemValue = value === undefined ? '' : String(value);

  const onValueChange = (itemValue: string) => {
    const item = options.find(option => String(option.value) === itemValue);

    if (!item) {
      return;
    }

    onChange(true, item.value);
  };

  const list = (
    <ul
      {...props}
      className={cn(
        'm-0 flex list-none gap-4 p-0',
        className,
        orientation === 'vertical' && 'flex-col',
        isButton && 'gap-0',
      )}
    >
      {options.map((item: Option, index) => {
        const checked = value === item.value;

        return (
          <li
            key={`${index}-${String(item.value)}`}
            className={cn('flex', classNames?.wrapper)}
          >
            {isButton ? (
              // `asChild` gives the Button real radio semantics (role,
              // aria-checked, roving tabindex, arrow-key nav, click/keyboard
              // selection via the shared Core's onValueChange below) instead
              // of a plain list of buttons with none of that.
              <Item
                asChild
                value={String(item.value)}
                disabled={disabled || item.disabled}
              >
                <Button
                  variant={checked ? buttonStyle : 'outlined'}
                  size={size}
                  disabled={disabled || item.disabled}
                  className={cn(
                    // The `solid` variant (the checked item, by default)
                    // renders no border at all while `outlined` (every
                    // unchecked item) renders a 1px one — reserving the
                    // border unconditionally keeps every option's box the
                    // same size regardless of which variant it's in.
                    'rounded-none border',
                    checked &&
                      (buttonStyle === 'outlined'
                        ? 'border-primary'
                        : 'border-transparent'),
                    index === 0 &&
                      (orientation === 'vertical'
                        ? 'rounded-t-lg'
                        : 'rounded-l-lg'),
                    index === options.length - 1 &&
                      (orientation === 'vertical'
                        ? 'rounded-b-lg'
                        : 'rounded-r-lg'),
                  )}
                >
                  {item.label}
                </Button>
              </Item>
            ) : (
              <Radio
                id={getOptionId(index)}
                placement={placement}
                className={cn(classNames?.item)}
                value={item.value}
                checked={checked}
                disabled={disabled || item.disabled}
                onChange={checked => onChange(checked, item.value)}
              >
                {item.label}
              </Radio>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <RadioGroupContext.Provider value={true}>
      <Core
        className="block"
        name={name}
        value={checkedItemValue}
        onValueChange={onValueChange}
      >
        {list}
      </Core>
    </RadioGroupContext.Provider>
  );
};

export default RadioGroup;
