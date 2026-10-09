'use client';

import {
  type ComponentPropsWithRef,
  type ReactNode,
  useId,
  useState,
} from 'react';

import { DirectionProvider } from '@base-ui/react/direction-provider';
import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { Star } from 'lucide-react';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import Button from './button';

export interface Props extends Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'value' | 'defaultValue' | 'onChange'
> {
  /** Positive whole-step count. Defaults to five. */
  count?: number;
  /** Zero means no rating. Values are rounded down and clamped to 0–count. */
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** Activating the selected score clears it to zero. Defaults to true. */
  allowClear?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  icon?: ReactNode;
  getItemLabel?: (score: number, count: number) => string;
  getValueText?: (value: number, count: number) => string;
  classNames?: { item?: string; filledItem?: string; icon?: string };
}

const Rate = ({
  count = 5,
  value,
  defaultValue = 0,
  onChange,
  allowClear = true,
  disabled = false,
  readOnly = false,
  name,
  icon,
  getItemLabel = (score, total) => `${score} of ${total} stars`,
  getValueText = (score, total) =>
    score === 0 ? 'No rating' : `${score} of ${total} stars`,
  className,
  classNames,
  dir,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...props
}: Props) => {
  const total = Number.isFinite(count) ? Math.max(1, Math.floor(count)) : 5;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const rawValue = value ?? internalValue;
  const score = Number.isFinite(rawValue)
    ? Math.min(total, Math.max(0, Math.floor(rawValue)))
    : 0;
  const { direction } = useConfig();
  const resolvedDirection = dir === 'ltr' || dir === 'rtl' ? dir : direction;
  const statusId = useId();

  const changeValue = (next: number) => {
    if (disabled || readOnly || next === score) {
      return;
    }

    if (value === undefined) {
      setInternalValue(next);
    }

    onChange?.(next);
  };

  return (
    <DirectionProvider direction={resolvedDirection}>
      <RadioGroup
        {...props}
        data-slot="rate"
        dir={dir ?? resolvedDirection}
        aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : 'Rating')}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={[ariaDescribedBy, statusId].filter(Boolean).join(' ')}
        disabled={disabled}
        readOnly={readOnly}
        name={name}
        value={score === 0 ? '' : String(score)}
        onValueChange={next => changeValue(Number(next))}
        className={cn(
          'inline-flex w-fit max-w-full flex-wrap items-center gap-1',
          className, //
        )}
      >
        {Array.from({ length: total }, (_, index) => {
          const itemScore = index + 1;
          const isFilled = itemScore <= score;

          return (
            <Radio.Root
              key={itemScore}
              value={String(itemScore)}
              nativeButton
              data-slot="rate-item"
              data-filled={isFilled ? '' : undefined}
              aria-label={getItemLabel(itemScore, total)}
              onClick={event => {
                if (
                  allowClear &&
                  itemScore === score &&
                  !disabled &&
                  !readOnly
                ) {
                  event.preventDefault();
                  changeValue(0);
                }
              }}
              render={
                <Button
                  variant="text"
                  size="small"
                  disabled={disabled}
                  className={cn(
                    'text-muted-foreground size-8 shrink-0 p-1',
                    readOnly && 'cursor-default',
                    isFilled && 'text-primary',
                    classNames?.item,
                    isFilled && classNames?.filledItem, //
                  )}
                />
              }
            >
              <span
                data-slot="rate-icon"
                aria-hidden="true"
                className={cn(
                  'flex size-5 items-center justify-center [&>svg]:size-full',
                  isFilled && '[&>svg]:fill-current',
                  classNames?.icon, //
                )}
              >
                {icon ?? <Star />}
              </span>
            </Radio.Root>
          );
        })}
        <span
          id={statusId}
          data-slot="rate-status"
          className="sr-only"
          aria-live="polite"
        >
          {getValueText(score, total)}
        </span>
      </RadioGroup>
    </DirectionProvider>
  );
};

export default Rate;
