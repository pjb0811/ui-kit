---
'@repo/ui': patch
---

Extract `Marquees`' and `Item`'s duplicated pause-on-hover state/handlers into a shared `usePauseOnHover` hook, and add `onFocus`/`onBlur` alongside `onMouseEnter`/`onMouseLeave` so keyboard-focused users can also pause the marquee — previously only mouse hover could pause it, leaving keyboard users with no way to stop a marquee containing links or buttons.
