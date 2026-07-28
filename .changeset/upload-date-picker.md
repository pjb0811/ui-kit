---
'@repo/ui': minor
---

Add `Upload` (molecule) and `DatePicker` (atom) components.

- `Upload`: multi-file drag-and-drop upload with a file list (thumbnail preview + remove), using `@jbpark/use-hooks`'s `useFileToDataUrl` to convert selected files to data URLs
- `DatePicker`: a `Popover` + `Calendar` composition (shadcn's `react-day-picker`-based `Calendar` core primitive, newly added under `src/core/calendar.tsx`) for single-date selection
- Add `react-day-picker` and `date-fns` dependencies for the new `Calendar` core primitive
