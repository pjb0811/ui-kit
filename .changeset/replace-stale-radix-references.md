---
'@repo/ui': patch
---

Replace the stale Radix references left over from the Base UI migration

The package has carried no Radix code since the migration finished — zero
`@radix-ui/*` entries in `pnpm-lock.yaml`, zero imports in `src` — but the
published metadata and the docs still advertised it. `package.json` described
the library as "built with TypeScript, Tailwind CSS, and Radix UI" and listed
`radix-ui` as an npm keyword; both now say Base UI.

The same sweep corrects the `core/` READMEs, which credited Radix for
`accordion`, `dialog`, `progress` and `switch`, and still described `drawer` as
"Vaul based" — `vaul` was dropped along with the last transitive
`@radix-ui/react-dialog`. The root READMEs' UI-library list had the same two
stale entries.

Two code comments described current behaviour as Radix's rather than Base UI's:
the rich-text-editor colour-picker note about outside-interaction dismissal, and
`option-group`'s explanation of how `Radio.Group` matches items by `value`.
Comments that deliberately contrast the two libraries — the `Radix → Base UI`
shape-change notes in `core/accordion`, `core/dialog` and `core/radio-group`,
`core/select`'s note that `dir` is retained from the old API, and `core/badge`'s
reason for using `useRender` instead of Radix Slot — are accurate and left
alone, as is the release history in `CHANGELOG.md` and the pending changesets.
