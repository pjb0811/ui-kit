---
'@repo/ui': major
---

Remove the deprecated `type` aliases and the pre-8.0 preset colour spellings

The aliases added non-breaking by #318 (semantic-state axis) and #342 (Tailwind
palette names) are removed now that 9.0.0 is the first major since they shipped.

**Breaking — semantic state.** `Modal` and `Toast` no longer accept `type`; use
`status` (`'info' | 'success' | 'error' | 'warning'`). `Modal.confirm()` is
unchanged — the two-button confirm is now an internal `mode` axis rather than
`type='confirm'`, so the imperative call keeps working.

- `<Modal type="info" />` / `Modal.info({ type: 'info' })` → `status="info"`
- `<Toast type="error" />` → `status="error"`

**Breaking — preset colour spellings** on `Button` and `Tag`:

| removed    | use instead |
| ---------- | ----------- |
| `magenta`  | `fuchsia`   |
| `geekblue` | `indigo`    |
| `gold`     | `amber`     |
| `volcano`  | _(none)_    |

`volcano` has no successor — it rendered `orange-600`, the same hue as `orange`
one lightness step darker, not a distinct hue. Callers who want that exact
shade set the custom property directly, e.g. `style={{ '--btn-bg':
'var(--color-orange-600)' }}` (`--tag-bg` on `Tag`).

These spellings were never exported values (`lib/colors.ts` is internal), so the
change is to prop types and stylesheet rules only — the public API surface
snapshot is unchanged.
