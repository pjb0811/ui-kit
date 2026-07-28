'use client';

import { useState } from 'react';

import { useFileToDataUrl } from '@jbpark/use-hooks';

import { cn } from '@repo/ui/utils';

import Input from './input';

interface Props {
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  accept?: string;
  className?: string;
  classNames?: {
    preview?: string;
    input?: string;
    upload?: string;
  };
  onChange?: (value: string) => void;
}

const AssetPicker = ({
  defaultValue,
  value: _value,
  placeholder,
  accept = 'image/*',
  className,
  classNames,
  onChange: _onChange = () => {},
}: Props) => {
  const readAsDataUrl = useFileToDataUrl();
  const [uncontrolledValue, setUncontrolledValue] = useState<
    string | undefined
  >(defaultValue);

  const controlled = _value !== undefined;
  const value = controlled ? _value : uncontrolledValue;

  const onChange = (next: string) => {
    if (!controlled) {
      setUncontrolledValue(next);
    }
    _onChange(next);
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        className,
        //
      )}
    >
      {value && (
        <img
          src={value}
          alt=""
          className={cn(
            'h-20 w-20 rounded border object-cover',
            classNames?.preview,
            //
          )}
        />
      )}
      <Input
        key={value}
        defaultValue={value}
        placeholder={placeholder}
        className={classNames?.input}
        onBlur={e => {
          const next = e.target.value.trim();

          if (next && next !== value) {
            onChange(next);
          }
        }}
      />
      <Input
        type="file"
        accept={accept}
        className={classNames?.upload}
        onChange={async e => {
          const file = e.target.files?.[0];

          if (!file) {
            return;
          }

          const dataUrl = await readAsDataUrl(file);
          onChange(dataUrl);
        }}
      />
    </div>
  );
};

export default AssetPicker;
export type { Props };
