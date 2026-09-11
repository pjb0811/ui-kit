import { cn } from '@repo/ui/utils';

/**
 * Shared a11y/state chassis for interactive single-element atoms.
 *
 * Extracted from `core/button` and `core/badge`'s cva base strings during the
 * #278 step ③ absorb (see #294 Phase 4). When an atom stops wrapping its core
 * primitive it must carry this chassis itself — the focus ring, the
 * `aria-invalid` treatment and the flex centering are load-bearing and have no
 * type- or lint-level signal, so dropping them regresses silently (the #177
 * class of bug the regression net in #300/#301 guards).
 *
 * `Button` is the only consumer now: `Tag` went back to wrapping `core/badge`,
 * so it inherits the chassis from that primitive's cva base instead. Kept
 * shared rather than inlined into `Button` because the same reasoning applies
 * to the next atom that absorbs its primitive.
 *
 * Common set only. The `disabled:*` and icon-sizing treatments live on the
 * Button extension in `atoms/button`, NOT here — folding them into one shared
 * constant would push `disabled:*` onto non-disableable atoms, which is
 * semantically wrong (#301's per-component chassis finding).
 */
export const INTERACTIVE_CHASSIS = cn(
  'inline-flex items-center justify-center shrink-0',
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
);
