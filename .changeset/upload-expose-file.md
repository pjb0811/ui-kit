---
'@repo/ui': minor
---

Expose the original `File` on Upload entries. `UploadFile` gains an optional `file` field, set on every entry created by picking or dropping a file, so `onChange` handlers can upload it (for example with `FormData`) without turning the data URL back into a `Blob`. Entries passed in through `value` or `defaultValue` can leave it out.
