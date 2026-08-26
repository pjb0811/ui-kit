#!/usr/bin/env node
// Non-Tailwind-host reset tripwire (Phase 3 regression net, ui-kit#294).
//
// This package intentionally ships NO global Tailwind preflight in its
// dist/style.css, so in a host that doesn't run Tailwind itself (e.g.
// Docusaurus) the library's own elements would fall back to the host's UA
// defaults — bare <button>s with a 2px outset border, native `appearance`,
// the UA button font, etc. ui-kit#253 and #256 fixed that by shipping a
// self-scoped normalize in `@layer base`, limited to the `[data-slot]`
// subtree, that restores just the needed bits. That reset lives only in the
// emitted CSS (no type/lint signal), so a refactor can silently drop it and
// republish the exact #253/#256 regression — which already reached npm once.
//
// This asserts the reset survives every build. It's a heuristic substring
// tripwire (same spirit as check-dynamic-tailwind-classes.mjs), not a CSS
// parser. Run after `build`.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CSS_PATH = path.join(__dirname, '..', 'dist', 'style.css');

if (!fs.existsSync(CSS_PATH)) {
  console.error('✘ dist/style.css not found — run `pnpm --filter @repo/ui build` first.');
  process.exit(1);
}

// Collapse whitespace so assertions don't depend on the minifier's formatting.
const css = fs.readFileSync(CSS_PATH, 'utf8').replace(/\s+/g, ' ');

// Each guarantee is (label, must-all-be-present substrings). The reset must be
// scoped to `[data-slot]` — a global reset here would defeat the "no preflight
// leaks into the host" contract, so every check pins the selector too.
const requirements = [
  {
    label: 'box-sizing / border reset scoped to [data-slot]',
    all: [':where([data-slot], [data-slot] *)', 'box-sizing: border-box', 'border-style: solid', 'border-width: 0'],
  },
  {
    label: 'form-control reset (appearance + font/color inheritance) scoped to [data-slot]',
    all: ['[data-slot] input', 'appearance: none', 'color: inherit', 'font: inherit'],
  },
];

const failures = [];
for (const { label, all } of requirements) {
  const missing = all.filter(s => !css.includes(s));
  if (missing.length) {
    failures.push(`${label}\n      missing: ${missing.map(m => JSON.stringify(m)).join(', ')}`);
  }
}

if (failures.length) {
  console.error(
    '✘ dist/style.css is missing the self-scoped preflight reset that\n' +
      '  non-Tailwind hosts depend on (regression of ui-kit#253/#256):\n',
  );
  for (const f of failures) console.error('  - ' + f + '\n');
  console.error(
    "  The reset lives in src/globals.css under `@layer base`. Don't drop it\n" +
      '  when refactoring global styles.',
  );
  process.exit(1);
}

console.log('✓ dist/style.css retains the [data-slot]-scoped preflight reset (#253/#256).');
