import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@repo/ui/utils';

/**
 * Vendored from shadcn's `new-york-v4` badge registry entry.
 *
 * Two deliberate local adaptations, both of which must survive the next sync:
 * - upstream imports `Slot` from the unified `radix-ui` package; this repo
 *   installs the individual `@radix-ui/*` packages (13 of them) and has no
 *   `radix-ui` dependency, so the import stays on `@radix-ui/react-slot`.
 * - `cn` resolves through `@repo/ui/utils` rather than upstream's `cn` alias.
 *
 * Everything else is upstream verbatim, including the `rounded-full` /
 * `border-transparent` base and the `ghost` / `link` variants.
 */
const badgeVariants = cva(
  `inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden
  rounded-full border border-transparent px-2 py-0.5 text-xs font-medium
  whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring
  focus-visible:ring-[3px] focus-visible:ring-ring/50
  aria-invalid:border-destructive aria-invalid:ring-destructive/20
  dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none
  [&>svg]:size-3`,
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90',
        outline:
          'border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        ghost: '[a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 [a&]:hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type Props = React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  };

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: Props) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants, type Props };
