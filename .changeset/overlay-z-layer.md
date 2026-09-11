---
'@repo/ui': minor
---

Every floating/overlay primitive moves from `z-50` to `z-1000`, declared once as
`OVERLAY_LAYER` in `src/lib/z-layers.ts`.

`z-50` is shadcn's default, and it assumes you own the whole app and keep its
chrome below 50. A published package doesn't get that assumption. Infima
(Docusaurus) puts its navbar at `--ifm-z-index-fixed: 200` and its own overlay at
400, so on this repo's own docs site a right-anchored `Drawer` had its top 60px —
the entire header, meaning the title _and_ the close button — painted under the
navbar, and the mask couldn't dim that strip. It still hit-tested fine, because
vaul/Radix mark outside content `pointer-events: none` while a modal is open, so
the close button was clickable but invisible. `Modal` escaped only by accident:
it's vertically centred, so it lands below the navbar's 60px.

Measured on the docs Drawer demo (1280×900):

|                                 | Before                   | After                  |
| ------------------------------- | ------------------------ | ---------------------- |
| Overlay / content `z-index`     | `50`                     | `1000`                 |
| Topmost element over the navbar | the navbar's own link    | `[data-slot=drawer-…]` |
| Drawer header (y 0–78) visible  | no — navbar painted over | yes                    |
| Navbar strip dimmed by the mask | no (`rgb(255,255,255)`)  | yes                    |

Affected: `Modal`/`Dialog` (mask + content), `Drawer` (mask + content),
`Popover`, `Select`'s popup, `Dropdown`'s menu, `FloatButton`, and
`Layout.Header` when `position` is `sticky` or `fixed`.

**They all moved together, to the same value, on purpose.** Nothing in that list
ranks against anything else in it by z-index; relative order falls out of DOM
order, which is what puts a `Select` popup above the `Drawer` it was opened from
(Radix appends each portal to `body` as it opens) and a `Drawer` above
`Layout.Header`. Giving one of them a different value would silently invert those
pairs. Verified after the change: `Select` popup `1000`, `Popover` `1000`,
`Dropdown` menu `1000`, all above the navbar's `200`.

`Modal.confirm` and the imperative `Toast`/`Modal` stack roots are unchanged at
`10000`, so an imperative confirm opened from inside a declarative `Modal` still
lands on top — verified at `z=10000`. `Layout.Sider` stays at `z-10`: it only has
to stay under this layer, and raising it in step would undo the fix that stopped
it covering a sticky `Header`.

Graded `minor` rather than `patch` because 1000 is a contract, not an
implementation detail: the library now claims the band every major UI library
reserves for modals (antd 1000, Bootstrap 1055, MUI 1300). A host that
deliberately parks its own chrome between 50 and 1000 to sit above these
components will see that inverted. Retune per call site with `className` /
`classNames.mask` — both land after `OVERLAY_LAYER` in `cn()`, so
`tailwind-merge` lets them win.
