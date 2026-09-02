---
'@repo/ui': patch
---

Add the `'use client'` directive to `Space`. `Space` reads `componentSize` via
`useConfig` (a React context hook), so it must be a client component like every
other `Config` consumer (`Button`, `Switch`, `Modal`, `Tag`, …). Without the
directive, importing `<Space>` into a React Server Component tree could throw at
runtime. Non-behavioural fix — output is unchanged in existing client trees.
