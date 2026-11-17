---
'@repo/ui': minor
---

Make English the default language and let `Config`'s `locale` set every built-in string.

- **Default text is now English.** The labels that used to default to Korean without a `Config` (close, clear, back to top, loading, expand, collapse, back, retry, load failed, preview) are English. To keep Korean, wrap the app in `<Config locale={koKR}>`.
- **New exports.** `enUS` (the default) and `koKR` locale objects. `koKR` includes the date-fns `ko` locale for DatePicker's formatted date.
- **More keys.** `Locale` gains shared keys (`search`, `searchPlaceholder`, `noData`, `noResults`) and per-component groups for Anchor, AutoComplete, Breadcrumb, Cascader, DatePicker, InputNumber, Mentions, Pagination, Popconfirm, RichTextEditor, Select, Steps, Tabs, TimePicker, Tour, Transfer, Tree, TreeSelect and Upload. Text that was hardcoded with no prop (DatePicker's time footer, InputNumber's step buttons, the RichTextEditor toolbar, Upload's hint and remove buttons, Pagination's page-size options) can now be changed through the locale.
- **Group merging.** A nested `Config` merges each locale group key by key, so overriding one key keeps the others.
- Component props (`nextLabel`, `labels`, `placeholder`, `emptyText`, ...) still take precedence over the locale.
