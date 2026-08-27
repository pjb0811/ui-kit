import { cn } from '@repo/ui/utils';

/**
 * Shared a11y/state chassis for interactive single-element atoms (Button, Tag).
 *
 * Extracted from `core/button` and `core/badge`'s cva base strings during the
 * #278 step ③ absorb (see #294 Phase 4). When an atom stops wrapping its core
 * primitive it must carry this chassis itself — the focus ring, the
 * `aria-invalid` treatment and the flex centering are load-bearing and have no
 * type- or lint-level signal, so dropping them regresses silently (the #177
 * class of bug the regression net in #300/#301 guards).
 *
 * Common set only. A Tag is not disableable, does not size icons and (as a
 * non-focusable `span`) carries no `outline-none`, so those live on the Button
 * extension in `atoms/button`, NOT here — folding them into one shared constant
 * would push `disabled:*` onto Tag, which is semantically wrong (#301's
 * per-component chassis finding).
 */
export const INTERACTIVE_CHASSIS = cn(
  'inline-flex items-center justify-center shrink-0',
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
);
