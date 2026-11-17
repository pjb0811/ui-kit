---
'@repo/ui': minor
---

Make Marquees respect reduced motion and expose its content once. With `prefers-reduced-motion: reduce`, rows no longer animate; they stay at the start and can be scrolled sideways. The copies the loop renders to stay seamless are now `aria-hidden` and `inert`, so screen readers read each row once and links or buttons inside it are reached by Tab once.
