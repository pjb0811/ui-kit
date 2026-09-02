/**
 * The shared preset colour palette. `Button` and `Tag` both express these via
 * the `--btn-*` / `--tag-*` custom-property systems in `globals.css` (keyed off
 * `data-color`), so the same word means the same hue on either component
 * (#320). Keep this list in sync with the `[data-color='…']` rules there.
 */
export const PRESET_COLORS = [
  'blue',
  'purple',
  'cyan',
  'green',
  'magenta',
  'pink',
  'red',
  'orange',
  'yellow',
  'volcano',
  'geekblue',
  'lime',
  'gold',
] as const;

export type PresetColor = (typeof PRESET_COLORS)[number];

/** Runtime membership test — true when `color` is one of the shared presets. */
export const isPresetColor = (color: string): color is PresetColor =>
  (PRESET_COLORS as readonly string[]).includes(color);
