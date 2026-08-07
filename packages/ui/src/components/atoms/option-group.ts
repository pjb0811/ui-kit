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
