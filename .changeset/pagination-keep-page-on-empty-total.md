---
'@repo/ui': patch
---

Keep the current page when Pagination's `total`, or Table's rows or server `total`, is briefly empty, for example while data is refetched. An uncontrolled page used to reset to 1 without calling `onChange`, and stayed there when the total came back; in Table's server mode the bar then showed page 1 while the rows were still page 5. A total that really shrinks still clamps the page as before.
