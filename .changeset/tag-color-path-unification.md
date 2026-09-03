---
'@repo/ui': major
---

**Breaking:** `Tag`'s `variant="default"` is removed, and every `Tag` colour now
resolves through the same `data-color` + `--tag-*` system. Completes #320, which
6.2.0 shipped only halfway.

### `variant="default"` → `variant="filled"`

6.2.0 renamed the value but kept `'default'` as a deprecated alias. That left the
exact asymmetry the issue was filed about — `variant="default"` was valid on
`Tag` but not on `Button`. The alias is now gone.

```diff
- <Tag variant="default">…</Tag>
+ <Tag variant="filled">…</Tag>
```

`filled` is also the default, so `variant="default"` can usually just be dropped.
This is the only source change consumers need to make.

### One colour path instead of two

Before, only the 13 preset colours emitted `data-color` and read `--tag-*`; the
semantic states (`default`/`primary`/`success`/`warning`/`danger`) carried fixed
Tailwind classes instead. So `[data-color]` selectors and `--tag-*` overrides
worked on some colours and silently did nothing on others.

Now every colour goes through the same three custom properties:

| Property     | Role                                          |
| ------------ | --------------------------------------------- |
| `--tag-bg`   | the hue; the border when `variant="outlined"` |
| `--tag-fg`   | text colour (defaults to `--tag-bg`)          |
| `--tag-tint` | the fill behind `variant="filled"`            |

```css
/* now works for every colour, not just the presets */
[data-slot='badge'][data-color='success'] {
  --tag-bg: oklch(70% 0.2 160);
}
```

`Tag` also emits `data-variant` so stylesheets can target a variant without
re-deriving it from class names.

**Rendered output is unchanged.** All 36 colour × variant combinations were
screenshot-compared before and after in both light and dark mode; the images are
byte-identical (MD5 match). The semantic states keep the exact Tailwind ramp
values they had — `success` still reads green-500/600 with green-400 in dark
mode, `warning` yellow-500/600 with yellow-400.

### What deliberately did not change

`success` and `warning` stay on `Tag` even though `Button`'s `color` has no such
values. A `Tag` marks state, and antd's `Tag` carries status colours its `Button`
does not — dropping them would have made the component worse, not more aligned.
`variant` likewise stays `filled | outlined` rather than adopting `Button`'s full
`solid`/`dashed`/`text`/`link` set, which #320 never asked for.
