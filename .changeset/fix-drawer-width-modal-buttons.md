---
'@repo/ui': patch
---

Keep side drawer widths usable and tell the modal's footer buttons apart

`organisms/drawer` turns a preset `size` into a viewport percentage in an
inline style, so a left/right drawer collapsed on phones: `small` is 30%,
about 112px on a 375px screen. The same seam had the opposite problem above
`sm` — `core/drawer` puts `sm:max-w-sm` on side drawers and an inline `width`
does not beat a `max-width`, so every side drawer was held at 24rem from the
`sm` breakpoint up and `size` had no effect on anything wider than a phone.
Preset widths are now floored at `20rem` and `max-width: 100%` is set inline;
a custom `size` is still used exactly as given.

`Button` defaults to the `outlined` variant, so the modal's unstyled OK button
rendered with the same classes as the explicitly outlined Cancel beside it, in
the controlled footer and in `Modal.confirm`'s alike. The confirming action is
now solid primary and the dismissing one stays outlined, including the single
acknowledge button on the other statics. `Modal.confirm` also ran cancel-then-ok
while the controlled footer ran ok-then-cancel; both now put the confirming
action first.
