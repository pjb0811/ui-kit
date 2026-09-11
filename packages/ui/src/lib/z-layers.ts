/**
 * The single stacking layer every floating/overlay primitive in this library
 * shares — dialog and drawer (mask + content), popover, select, dropdown,
 * float button, and `Layout.Header`.
 *
 * **They are all deliberately equal.** Nothing here ranks against anything else
 * here by z-index; relative order falls out of DOM order, which is what puts a
 * Select popup above the Drawer it was opened from (Radix appends each portal to
 * `body` as it opens) and a Drawer above `Layout.Header`. Give one of them a
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
 * under the navbar. It still hit-tested fine, because vaul/Radix mark outside
 * content `pointer-events: none` while a modal is open, so the close button was
 * clickable but invisible. 1000 clears Infima's whole scale and sits in the band
 * every major library reserves for modals (antd 1000, Bootstrap 1055, MUI 1300).
 *
 * Retune per call site with `className` / `classNames.mask` — both land after
 * this in `cn()`, so `tailwind-merge` lets them win.
 */
export const OVERLAY_LAYER = 'z-1000';
