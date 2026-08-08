---
'@repo/ui': patch
---

**Migration note for 3.4.0:** `Button`'s `htmlType` now defaults to `'button'` instead of the browser's native default of `'submit'`. This was shipped in 3.4.0 without a migration note — if your `<Button>` was relying on the old implicit-submit behavior inside a `<form>` (i.e. you never passed `type`/`onClick` and expected clicking it to submit the form), add `htmlType="submit"` explicitly to restore that behavior.
