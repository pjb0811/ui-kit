import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

import { cn } from '@repo/ui/utils';

import Popover from '../Popover';

interface Props {
  defaultValue?: string;
  value?: string;
  showText?: boolean;
  onChange?: (color: string) => void;
}

const ColorPicker = ({
  defaultValue,
  value: _value,
  showText,
  onChange: _onChange = () => {},
}: Props) => {
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(
    defaultValue || '#fff',
  );

  const controlled = _value !== undefined;
  const value = controlled ? _value : uncontrolledValue;

  const onChange = (color: string) => {
    if (!controlled) {
      setUncontrolledValue(color);
    }
    _onChange(color);
  };

  return (
    <Popover
      placement="bottomLeft"
      content={<HexColorPicker color={value} onChange={onChange} />}
    >
      <div
        className={cn(
          'inline-flex items-center',
          'rounded border p-0.5',
          //
        )}
      >
        <div
          className={cn(
            'size-6 cursor-pointer rounded border',
            'shadow-sm',
            //
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
