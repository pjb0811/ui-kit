---
'@repo/ui': minor
---

Stop shipping Tailwind's global preflight (and the global `body {}` rule) in `@repo/ui/style.css`.

`@import 'tailwindcss'` pulled in preflight — a document-wide reset (`*, ::before, ::after { margin: 0; box-sizing: border-box; border: 0 }` plus bare-tag resets on headings, lists, buttons, etc.). Because the library ships this compiled into `style.css`, importing the package flattened the spacing/typography of any host page (e.g. a Docusaurus/Infima docs site) — a leak, not the library's job. The `body { background/color }` rule leaked similarly, painting the host's `<body>`.

**What changed**

- `style.css` now imports only Tailwind's `theme` and `utilities` layers (no `preflight`).
- The `@layer base` now contains only the border/outline **color** defaults (`* { border-color; outline-color }`), which restore the design tokens for bare `border`/`outline` utilities. This is color-only, sits in the low-priority `base` layer, and never affects layout.

**Consumer impact / migration**

- Apps that run their own Tailwind (import `tailwindcss` themselves) are unaffected — they already provide preflight.
- Consumers that relied on `@repo/ui/style.css` alone for a CSS reset should add their own preflight (`@import 'tailwindcss'`, or `tailwindcss/preflight.css`) and set their own `body` colors. This repo's Storybook (`apps/docs`) and `apps/web` were updated accordingly.
