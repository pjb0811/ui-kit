---
'@repo/ui': patch
---

Deprecate `Button`'s `type` prop in favour of `variant` (ui-kit#278 follow-up).

The two props address the same axis and largely duplicate each other: 3 of the 5
`type` values (`dashed`, `text`, `link`) are spelled identically to their
`variant` counterparts, so `<Button type="text">` and `<Button variant="text">`
already render the same thing. `type` only contributes the aliases
`primary` → `solid` and `default` → `outlined`, while `variant` additionally
offers `filled`, which `type` cannot express.

`type` is now marked `@deprecated` with an in-editor migration table. **Nothing
changes at runtime** — passing both still lets `variant` win, and every
`type`/`variant` combination resolves to exactly the same variant as before.
The default moved off the deprecated prop (`type = 'default'` on the parameter)
onto the resolution itself (`?? 'outlined'`), so a Button with neither prop no
longer routes through the deprecated path.

| `type`    | use instead                                        |
| --------- | -------------------------------------------------- |
| `primary` | `solid`                                            |
| `default` | `outlined` (now the default, so it can be omitted) |
| `dashed`  | `dashed`                                           |
| `text`    | `text`                                             |
| `link`    | `link`                                             |

`type` will be removed in the next major.
