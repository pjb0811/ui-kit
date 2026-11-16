---
'@repo/ui': patch
---

Apply List's `classNames.title` to the rendered title. It used to reach only the loading skeleton's wrapper, so the real heading could not be styled through `classNames`. It is applied last, so it overrides the default size and weight. Also remove the undefined `text-black-90` class from the title, which had no effect.
