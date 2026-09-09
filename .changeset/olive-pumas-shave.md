---
'@repo/ui': major
---

Make every `Config` theme token actually do something (ui-kit#343).

19 of `ThemeToken`'s 40 keys were inert — they type-checked, autocompleted, and
silently did nothing. Verified by setting each one to a sentinel value against
the built stylesheet and reading back the computed styles. The 21 survivors all
demonstrably reach a component.

**Removed: `btnBackground`, `btnBackgroundHover`, `btnBackgroundActive`,
`btnBorder`, `btnForeground`.** `globals.css` declares `--btn-*` on the button
element itself, keyed off `data-color`. An element's own declaration always
beats an inherited one, so a value set on `Config`'s wrapper could never win —
for any colour, including `default`. Re-theme buttons with
`colorPrimary`/`colorDestructive` for the semantic colours, or by overriding
`--preset-color` in CSS for the preset hues:

```css
[data-slot='button'][data-color='blue'] {
  --preset-color: oklch(55% 0.2 250);
}
```

**Removed: `sidebar`, `sidebarForeground`, `sidebarPrimary`,
`sidebarPrimaryForeground`, `sidebarAccent`, `sidebarAccentForeground`,
`sidebarBorder`, `sidebarRing`, `chart1`–`chart5`.** No component in the library
reads them, and the matching utilities (`bg-sidebar`, `bg-chart-1`) are never
generated into the published stylesheet, so nothing consumed them either. The
underlying `--sidebar-*` / `--chart-*` custom properties are still declared and
remain overridable in plain CSS — only the inert token API is gone. They should
return alongside an actual Sidebar/Chart component.

**Fixed: `fontSans` and `fontMono`.** These were inert for a different reason,
so they were repaired rather than dropped. They previously wrote
`--font-sans`/`--font-mono`, but those are `@theme inline` entries — Tailwind
substitutes their _value_ into each utility (`.font-mono { font-family:
var(--font-geist-mono) }`) instead of referencing them, so the override never
applied. They now write `--ui-font-sans`/`--ui-font-mono`, which `globals.css`
reads ahead of the app's own font variable.

Dropping `inline` would have been the other fix, but it breaks the standard
Next.js setup: `next/font` scopes its variable to `<body>` via a className, and
a non-inline `@theme` resolves that variable at `:root`, where it does not
exist. Apps that set no font token are unaffected — the app's own font variable
is still the fallback.

**Migration.** Code using a removed token had no effect, so deleting those keys
changes nothing at runtime; it only clears the type error. Nothing else needs to
move.
