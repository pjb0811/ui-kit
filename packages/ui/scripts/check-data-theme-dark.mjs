#!/usr/bin/env node
// Docusaurus dark-mode compatibility tripwire (ui-kit#393).
//
// ui-kit's dark styles key off two markers: its own `.dark` class and
// `[data-theme='dark']`, the attribute Docusaurus sets on <html>. The docs
// sites in this repo (apps/web) and the sibling ones rely entirely on the
// attribute — `.dark` can't be used there at all, because Docusaurus owns
// <html class> through react-helmet-async and rewrites it on every route
// change, so an imperative `classList.toggle('dark')` never survives
// navigation. That's why #393 removed apps/web's DemoTheme wrapper.
//
// The cost of that removal is a silent coupling: drop `[data-theme='dark']`
// from either the dark variant or the token block and every Docusaurus host
// un-themes itself, with no type or lint signal — the build still succeeds and
// only the rendered colours change. This asserts both markers survive the
// build, as a substring tripwire over the emitted CSS (same spirit as
// check-preflight-reset.mjs). Run after `build`.

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

// Quote style is up to the minifier, so accept either form of the attribute
// selector. Each requirement passes when ANY of its variants is present.
const dataTheme = ["[data-theme='dark']", '[data-theme="dark"]', '[data-theme=dark]'];

const requirements = [
  {
    label: "dark variant matches Docusaurus' attribute",
    why: "`@custom-variant dark` in src/globals.css must keep `[data-theme='dark'] *` alongside `.dark *`.",
    any: dataTheme.map(sel => `${sel} *`),
  },
  {
    label: 'dark token block is keyed off the attribute too',
    why: "The `.dark, [data-theme='dark']` token block in src/globals.css must keep the attribute selector.",
    any: dataTheme,
  },
];

const failures = [];
for (const { label, why, any } of requirements) {
  if (!any.some(s => css.includes(s))) {
    failures.push(`${label}\n      ${why}\n      none of: ${any.map(m => JSON.stringify(m)).join(', ')}`);
  }
}

if (failures.length) {
  console.error(
    "✘ dist/style.css no longer recognises Docusaurus' `data-theme='dark'`,\n" +
      '  which every docs site in this repo depends on for dark mode (#393):\n',
  );
  for (const f of failures) console.error('  - ' + f + '\n');
  console.error(
    '  If dropping Docusaurus compatibility is intentional, the docs sites need\n' +
      '  their own dark marker first — see apps/web/AGENTS.md.',
  );
  process.exit(1);
}

console.log("✓ dist/style.css still keys dark mode off [data-theme='dark'] (#393).");
