---
'@repo/ui': minor
---

Add `Image`, a content image with a placeholder while it loads, a fallback when it fails, and an optional preview that opens the image in a dialog fitted to the viewport. Native image props such as `srcSet`, `sizes` and `loading` reach the `<img>`. The preview can use a larger source, a title and an accessible label, and can be controlled with `open` and `onOpenChange`. A decorative image (`alt=""`) gets a preview control only with an explicit label. Config's `locale` gains a `preview` string for the default control name.
