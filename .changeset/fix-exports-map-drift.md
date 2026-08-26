---
'@repo/ui': patch
---

Fix the `exports` map drift between `package.json` and `package.publish.json`. The published manifest exposed a `./enums` subpath that resolved to `./dist/enums.mjs` — a file that is never built (there is no `enums` entry in `tsdown.config.ts` and no `enums` source), so importing `@jbpark/ui-kit/enums` always failed. Meanwhile `./providers` — which _is_ built (`dist/providers.mjs`) and is exported in the dev manifest — was missing from the published manifest, leaving it unreachable for published consumers. Drop the dead `./enums` subpath and add the missing `./providers` subpath so the published surface matches what is actually built.
