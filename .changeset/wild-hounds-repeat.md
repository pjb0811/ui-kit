---
'web': patch
---

Add `check-orphaned-docs`, which fails when a docs page and `sidebars.ts`
disagree in either direction — a page with no sidebar entry (orphan), or a
sidebar entry with no page (dangling).

The sidebar is fully manual and Docusaurus does not warn about documents no
sidebar references, so an orphaned page still builds and is served while
appearing in no navigation. That is how the CodeEditor page stayed reachable
only by URL from ui-kit#347 until ui-kit#352 caught it by hand. Verified the
check against that commit: it reports `components/atoms/code-editor` and exits
non-zero.

Wired into CI as its own step and runnable locally with
`pnpm --filter web check-orphaned-docs`.
