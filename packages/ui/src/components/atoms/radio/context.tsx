'use client';

import { createContext } from 'react';

/**
 * Internal only — not exported from the package entry points.
 *
 * `true` when a `Radio` is rendered inside a `RadioGroup` that already owns a
 * single shared `RadioGroupPrimitive.Root`. In that case each `Radio` renders
 * only its `RadioGroupItem` so that Radix can manage roving focus (arrow-key
 * navigation) across every option of the group.
 *
 * `false` (default) means the `Radio` is standalone and has to wrap itself in
 * its own `Root` to stay functional.
 */
export const RadioGroupContext = createContext(false);
