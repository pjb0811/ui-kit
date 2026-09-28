/**
 * The single stacking layer every floating/overlay primitive in this library
 * shares — dialog and drawer (mask + content), popover, select, dropdown,
 * float button, and `Layout.Header`.
 *
 * **They are all deliberately equal.** Nothing here ranks against anything else
 * here by z-index; relative order falls out of DOM order, which is what puts a
 * Select popup above the Drawer it was opened from (Base UI appends each portal
 * to `body` as it opens) and a Drawer above `Layout.Header`. Give one of them a
 * different value and those pairs silently invert. `Modal.confirm` and the
 * imperative `Toast`/`Modal` stack roots sit above this on purpose (`z-10000` /
 * `zIndex = '10000'`), so an imperative confirm opened from inside a declarative
 * Modal still lands on top.
 *
 * **Why 1000 and not shadcn's default of 50.** 50 assumes you own the whole app
 * and keep its chrome below that. This package is published, so it doesn't get
 * that assumption: Infima (Docusaurus) puts its navbar at `--ifm-z-index-fixed: 200`
 * and its own overlay at 400, so on this repo's own docs site a right-anchored
 * Drawer had its top 60px — the entire header, title and close button — painted
 * under the navbar. 1000 clears Infima's whole scale and sits in the band every
 * major library reserves for modals (antd 1000, Bootstrap 1055, MUI 1300).
 *
 * **Why `[data-ui-root]` isolation doesn't replace this (#411).** `globals.css`
 * gives a root marked `data-ui-root` `isolation: isolate`, so Base UI portals,
 * appended to `body` beside that root, paint above everything inside it at any
 * z-index. Measured in Chromium with this constant neutralised: a right Drawer
 * clears a `z-index: 200` navbar when the navbar lives *inside* the marked
 * root, but not when the root isn't marked, or when the host's chrome sits
 * outside it. The attribute is opt-in, and a published library can't assume
 * either, so the portalled sites keep the explicit layer. Nested portals are
 * unaffected either way: a Select opened from a Drawer, or a Popover opened
 * from a Modal, lands on top with or without this value, by DOM order alone.
 *
 * **The in-flow sites (dropdown, float button, `Layout.Header`) can't benefit
 * from isolation at all**, and at 1000 they paint over a host overlay that
 * sits lower — a portalled `z-50` shadcn/Radix dialog, say. A separate, lower
 * chrome layer was considered and rejected: whatever value it took would
 * still be above some host's overlay and below some host's page content, so
 * it only moves the collision. `data-ui-root` is the host-side fix. Marking
 * the app root isolates it at `z-index: auto`, so a host overlay portalled to
 * `body` covers the whole app, this chrome included (verified with a `z-50`
 * overlay against a sticky `Layout.Header` and a `FloatButton`).
 *
 * Retune per call site with `className` / `classNames.mask` — both land after
 * this in `cn()`, so `tailwind-merge` lets them win.
 */
export const OVERLAY_LAYER = 'z-1000';
