---
'@repo/ui': minor
---

Add deep-import subpaths for the 30 components that did not have one, so every component can be imported without the root entry: `Checkbox`, `ColorPicker`, `DatePicker`, `FloatButton`, `Input`, `Popover`, `Progress`, `Radio`, `RichTextEditor`, `Select`, `Skeleton`, `Slider`, `Spin`, `Switch`, `Tooltip`, `Collapse`, `Dropdown`, `Marquees`, `Splitter`, `Tabs`, `Upload`, `Drawer`, `List`, `Modal`, `Swiper`, `Toast`, `Container`, `Empty`, `Result` and `PageHeader` (for example `import Modal from '@jbpark/ui-kit/Modal'`). Each subpath has only a default export, like the existing ones.
