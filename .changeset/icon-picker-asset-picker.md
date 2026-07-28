---
'@repo/ui': minor
---

Add `IconPicker` and `AssetPicker` atom components. `IconPicker` wraps `Select` with a curated `lucide-react` icon set (overridable via the `icons` prop) and shows the selected icon. `AssetPicker` combines a URL input with a file upload control (using `@jbpark/use-hooks`'s `useFileToDataUrl`) to produce an image URL or data URL, with a live preview.
