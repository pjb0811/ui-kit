/**
 * The shared preset colour palette. `Button` and `Tag` both express these via
 * the `--btn-*` / `--tag-*` custom-property systems in `globals.css` (keyed off
 * `data-color`), so the same word means the same hue on either component
 * (#320).
 *
 * The names track **Tailwind's own palette names** (#342). They always did
 * track Tailwind's *values* — every preset was a Tailwind hue, just spelled
 * with antd's vocabulary — so four of them said one thing and rendered
 * another: `magenta` rendered Tailwind's `fuchsia`, `geekblue` rendered
 * `indigo`, `gold` rendered `amber`. Aligning the spelling makes the name and
 * the value agree, and lets `globals.css` resolve each entry straight from the
 * matching `--color-*` theme variable instead of a hand-copied hex.
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
 * Pre-8.0 spellings, still accepted and still rendering exactly what they
 * rendered before — they are aliases, not a behaviour change:
 *
 * | deprecated | renders           | canonical spelling            |
 * | ---------- | ----------------- | ----------------------------- |
 * | `magenta`  | `--color-fuchsia-500` | `fuchsia`                 |
 * | `geekblue` | `--color-indigo-500`  | `indigo`                  |
 * | `gold`     | `--color-amber-500`   | `amber`                   |
 * | `volcano`  | `--color-orange-600`  | *(none — see below)*      |
 *
 * `volcano` is the odd one out and has no canonical successor. Every other
 * preset is a distinct hue at Tailwind's `500` step, but `volcano` is
 * `orange-600` — the same hue as `orange`, one step darker. That makes it a
 * lightness variant masquerading as a hue, so it doesn't belong in a list
 * whose axis is "one entry per hue". It keeps rendering `orange-600` until the
 * next major; callers who want that exact shade can set `--btn-bg`/`--tag-bg`
 * directly.
 *
 * All four are removed in the next major.
 */
export const DEPRECATED_PRESET_COLORS = [
  'magenta',
  'geekblue',
  'gold',
  'volcano',
] as const;

export type DeprecatedPresetColor = (typeof DEPRECATED_PRESET_COLORS)[number];

/**
 * Runtime membership test — true when `color` is one of the shared presets,
 * including the deprecated spellings (they still resolve to a preset hue).
 */
export const isPresetColor = (
  color: string,
): color is PresetColor | DeprecatedPresetColor =>
  (PRESET_COLORS as readonly string[]).includes(color) ||
  (DEPRECATED_PRESET_COLORS as readonly string[]).includes(color);
