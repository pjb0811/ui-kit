---
'@repo/ui': patch
---

Wrap Modal body text between words. The body used `word-break: break-all`, which split ordinary words wherever a line filled up (for example "ope" / "n" at a phone width). It now uses `overflow-wrap: anywhere`, which breaks inside a word only when that word is wider than the body on its own, such as a long URL.
