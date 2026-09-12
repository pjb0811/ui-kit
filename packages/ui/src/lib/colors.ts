/**
 * The shared preset colour palette. `Button` and `Tag` both express these via
 * the `--btn-*` / `--tag-*` custom-property systems in `globals.css` (keyed off
 * `data-color`), so the same word means the same hue on either component
 * (#320).
 *
 * The names track **Tailwind's own palette names** (#342): every preset is a
 * Tailwind hue spelled the way Tailwind spells it, so the name and the value
 * agree and `globals.css` can resolve each entry straight from the matching
 * `--color-*` theme variable instead of a hand-copied hex. The pre-8.0 antd
 * spellings were removed in 9.0.0.
 *
 * Keep this list in sync with the `[data-color='…']` rules there.
 */
export const PRESET_COLORS = [
  'blue',
  'purple',
  'cyan',
  'green',
  'fuchsia',
  'pink',
  'red',
  'orange',
  'yellow',
  'indigo',
  'lime',
  'amber',
] as const;

export type PresetColor = (typeof PRESET_COLORS)[number];

/**
 * Runtime membership test — true when `color` is one of the shared presets.
 */
export const isPresetColor = (color: string): color is PresetColor =>
  (PRESET_COLORS as readonly string[]).includes(color);
