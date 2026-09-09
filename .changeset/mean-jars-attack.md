---
'@repo/ui': minor
---

Align the shared preset colour palette with Tailwind's own colour names, and
define it in one place instead of two (ui-kit#342).

**The palette is now a single source of truth.** `Button` and `Tag` each
carried their own copy of the same thirteen hex literals — 26 declarations that
nothing kept in sync, which is why `lib/colors.ts` had a "keep this list in
sync" comment. Both now resolve from one shared `--preset-color` block, so a
colour word renders the same hue on either component by construction.

**Preset names now match Tailwind's.** The values were always Tailwind's — the
presets were the v3 hex ramp, spelled with antd's vocabulary — so four names
said one thing and rendered another:

| before     | rendered           | now       |
| ---------- | ------------------ | --------- |
| `magenta`  | Tailwind `fuchsia` | `fuchsia` |
| `geekblue` | Tailwind `indigo`  | `indigo`  |
| `gold`     | Tailwind `amber`   | `amber`   |

The other nine (`blue`, `purple`, `cyan`, `green`, `pink`, `red`, `orange`,
`yellow`, `lime`) already matched and are unchanged.

**The old spellings still work.** `magenta`, `geekblue`, `gold` and `volcano`
are deprecated aliases that render exactly what they always did, and will be
removed in the next major. `volcano` has no successor: every other preset is a
distinct hue at Tailwind's `500` step, but `volcano` is `orange-600` — the same
hue as `orange`, one step darker — so it is a lightness variant rather than a
hue. It keeps rendering `orange-600` until removal.

**Colours shift very slightly.** Each preset now references the matching
`--color-*` Tailwind theme variable rather than a hand-copied literal, which
picks up Tailwind v4's oklch/P3 recalibration of its palette (the old literals
were the v3 sRGB hex values). The difference is small — ΔE 0.017–0.036 in
oklab, at or just above the just-noticeable threshold — and nine of the
thirteen now sit slightly outside sRGB, so they render a touch more saturated
on P3 displays. `Tag`'s `success`/`warning` and their dark-mode variants were
already exact Tailwind values inlined by hand; they now reference the same
variables and are byte-identical.

Referencing theme variables does not couple the published stylesheet to the
consuming app's palette: Tailwind keeps a referenced theme variable in the
build output, so `dist/style.css` ships its own copy of each colour it uses.
