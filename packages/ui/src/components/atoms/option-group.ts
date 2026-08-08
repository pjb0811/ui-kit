export type OptionValue = string | number | boolean;

export interface Option {
  label: string;
  value: OptionValue;
  disabled?: boolean;
}

export type Options = string[] | number[] | boolean[] | Option[];

export interface OptionGroupClassNames {
  wrapper?: string;
  item?: string;
}

export const normalizeOptions = (options: Options): Option[] =>
  options.map(item =>
    typeof item === 'object'
      ? item
      : {
          label: `${item}`,
          value: item,
        },
  );

// Radio.Group/Checkbox.Group both key selection off `value` (Radix's
// RadioGroup matches items by it, and Checkbox.Group tests membership via
// `value.includes(...)`), so two options sharing a value aren't just a
// React list-key collision — they become indistinguishable to the
// component's own selection logic, e.g. both rendering aria-checked=true
// together. A duplicate is virtually always a caller mistake (two radios
// for the "same" value can't be meaningfully different choices), so warn
// instead of silently accepting it.
export const warnOnDuplicateOptionValues = (
  options: Option[],
  componentName: string,
) => {
  const nodeEnv = (globalThis as { process?: { env?: { NODE_ENV?: string } } })
    .process?.env?.NODE_ENV;

  if (nodeEnv === 'production') {
    return;
  }

  const seen = new Set<OptionValue>();
  const duplicates = new Set<OptionValue>();

  for (const option of options) {
    if (seen.has(option.value)) {
      duplicates.add(option.value);
    }
    seen.add(option.value);
  }

  if (duplicates.size > 0) {
    console.warn(
      `${componentName}: duplicate option value(s) [${[...duplicates].map(v => JSON.stringify(v)).join(', ')}] — options sharing a value render as if selecting one selects all of them, since selection is matched by value.`,
    );
  }
};
