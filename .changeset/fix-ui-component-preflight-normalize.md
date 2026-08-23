---
'@repo/ui': patch
---

Normalize the library's own components in hosts without Tailwind preflight (e.g. Docusaurus). Since the package intentionally ships no global preflight, bare interactive/form elements kept the host's UA defaults — a `<button>` rendered with a 2px `outset` border, native `appearance`, and the UA button font (Arial) instead of the page font. A self-scoped normalize in `@layer base`, limited to the `[data-slot]` subtree, restores just the needed preflight bits (box-sizing, border width/style, appearance, font/color inheritance) without touching the host's own elements.
