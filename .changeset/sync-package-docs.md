---
'@repo/ui': patch
---

Sync the package docs with the current dependency and export surface

`README.md` and `README.ko.md` ship inside the published tarball and render on
the npm package page, so their drift was user-facing. The worst case: the
"Import Utilities and Enums" section told consumers to write
`import { TEXT_LEVELS } from '@jbpark/ui-kit/enums'`, but that subpath exists in
neither `package.json` nor `package.publish.json` — it was removed once as dead
weight and again when the published manifest was realigned — so following the
documented snippet always failed to resolve. The section now documents
`renderConditional()` and the `providers` subpath instead, and the exports list
gains the `Button`, `Tag`, `Card`, `Space`, `CodeEditor` and `Layout` entries it
had never picked up.

The dependency tables were equally stale. `Vaul` was still listed as the drawer
implementation although the drawer was rebuilt on Base UI and the dependency
dropped; `react-use`, `@uidotdev/usehooks`, `uuid` and `tw-animate-css` were all
listed but no longer installed, while `@jbpark/use-hooks`, `date-fns`,
`react-colorful`, TipTap, `react-day-picker` and `react-resizable-panels` — all
installed — were absent. Remaining versions are corrected against the installed
tree, and the React peer range narrows from `^18.0.0 || ^19.0.0` to the `^19.0.0`
the published package actually declares.

Finally the `src` tree diagram drew a `lib/enums/` directory that does not exist
while omitting `lib/colors.ts`, `lib/z-layers.ts` and `providers/`.
