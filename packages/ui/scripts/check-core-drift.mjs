#!/usr/bin/env node
// Drift check for the vendored shadcn primitives in `src/core/*` (ui-kit#362).
//
// `core/*` is deliberately a verbatim-ish copy of shadcn's `new-york-v4`
// registry entries — the core membership rule in CLAUDE.md (criterion c) keeps
// a primitive there precisely so upstream syncs stay diffable. That only pays
// off if drift is detectable; `core/badge.tsx` once sat three upstream changes
// behind and nothing noticed (#347).
//
// For each core file this fetches the upstream registry entry, normalises BOTH
// sides so this repo's standing conventions don't register as drift (the `cn`
// import path, the individual `@radix-ui/*` packages vs the unified `radix-ui`
// one, `Slot.Root` vs `Slot`, import aliasing, quotes, semicolons, commas,
// comments), then compares the two as token *sets* — so Tailwind class
// reordering and prettier line-wrapping, which differ by construction, don't
// count. It reports, per component:
//
//   · in sync          — identical after normalisation
//   · local additions  — we carry tokens upstream doesn't (intentional patches)
//   · upstream ahead    — upstream carries tokens we lack (the signal to look)
//
// Network-bound and upstream-mutable, so it must NOT sit in the required
// `lint-and-build` path — see `.github/workflows/core-drift.yml`. Run advisory
// by default (exit 0); pass `--enforce` to exit non-zero when any component is
// behind upstream.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CORE_DIR = path.join(__dirname, '..', 'src', 'core');
const SNAPSHOT_PATH = path.join(__dirname, 'core-drift.snapshot.json');
const REGISTRY = name =>
  `https://ui.shadcn.com/r/styles/new-york-v4/${name}.json`;

// `--enforce` exits non-zero on a *regression* from the snapshot (a component
// getting further from upstream), not on the standing, intentional divergence
// the structural primitives carry by design (#363). `--update` re-baselines.
const enforce = process.argv.includes('--enforce');
const update = process.argv.includes('--update');

// Strip `/* */` and `//` comments without touching string contents. Good
// enough for these files — none embed comment markers inside a string literal.
const stripComments = src =>
  src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/.*$/gm, '$1 ');

const normalise = src => {
  let s = stripComments(src);

  // Import sources: collapse this repo's spellings onto upstream's.
  // - the `cn` util (upstream registry emits `from "cn"`; we use @repo/ui/utils)
  // - the Radix packaging: individual `@radix-ui/*` here, unified `radix-ui`
  //   upstream
  // - cross-primitive + lib registry paths vs our relative imports
  s = s
    .replace(/@repo\/ui\/utils/g, 'cn')
    .replace(/@radix-ui\/react-[a-z-]+/g, 'radix-ui')
    .replace(/@\/registry\/new-york-v4\/ui\//g, '')
    .replace(/@\/registry\/new-york-v4\/lib\//g, '')
    .replace(/@\/lib\//g, '')
    .replace(/\.\.\/components\/atoms\//g, '')
    .replace(/\.\.\/lib\//g, '')
    .replace(/\.\//g, '');

  // Import aliasing: `* as X` and `{ Foo as X }` both bind `X`; collapse to the
  // local name so a namespace import reads the same as a named+aliased one.
  s = s.replace(/\*\s+as\s+(\w+)/g, '$1').replace(/\b\w+\s+as\s+(\w+)/g, '$1');

  // `Slot.Root` (unified radix-ui namespace) vs `Slot` (individual package).
  s = s.replace(/\bSlot\.Root\b/g, 'Slot');

  // Quote style, template backticks, statement punctuation — all noise here.
  s = s.replace(/["'`]/g, '').replace(/[;,]/g, ' ');

  // Detach structural punctuation so a class name never stays glued to the
  // `className={cn(` / `>` around it — otherwise a reordered class list (which
  // is semantically identical) reads as drift at its first/last member. Only
  // `{}()<>=` are split; the characters Tailwind tokens are built from (`-`,
  // `:`, `[`, `]`, `/`, `&`, `.`) are left alone. Splitting is applied to both
  // sides, so any real token difference still survives.
  s = s.replace(/([{}()<>=])/g, ' $1 ');

  return s;
};

// Token *set* (not sequence): class reordering and wrapping drop out, so only
// genuinely present/absent tokens remain.
const tokenSet = src =>
  new Set(
    normalise(src)
      .split(/\s+/)
      .map(t => t.trim())
      .filter(Boolean),
  );

const diff = (a, b) => [...a].filter(t => !b.has(t));

// Migrated primitives own their styling and no longer track shadcn (#375).
const BASE_UI_COMPONENTS = new Set(['separator']);

const components = fs
  .readdirSync(CORE_DIR)
  .filter(f => f.endsWith('.tsx'))
  .map(f => f.replace(/\.tsx$/, ''))
  .filter(name => !BASE_UI_COMPONENTS.has(name))
  .sort();

const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

const results = [];

for (const name of components) {
  const local = fs.readFileSync(path.join(CORE_DIR, `${name}.tsx`), 'utf8');

  let upstream;
  try {
    const res = await fetch(REGISTRY(name));
    if (!res.ok) {
      results.push({ name, status: 'no-upstream', detail: `HTTP ${res.status}` });
      continue;
    }
    const json = await res.json();
    upstream = (json.files ?? []).map(f => f.content).join('\n');
    if (!upstream) {
      results.push({ name, status: 'no-upstream', detail: 'empty registry entry' });
      continue;
    }
  } catch (e) {
    results.push({ name, status: 'error', detail: e.message });
    continue;
  }

  const localTokens = tokenSet(local);
  const upstreamTokens = tokenSet(upstream);
  const added = diff(localTokens, upstreamTokens); // we have, upstream doesn't
  const behind = diff(upstreamTokens, localTokens); // upstream has, we don't

  let status;
  if (added.length === 0 && behind.length === 0) {
    status = 'in-sync';
  } else if (behind.length === 0) {
    status = 'local-additions';
  } else {
    status = 'upstream-ahead';
  }

  results.push({ name, status, added, behind });
}

const label = {
  'in-sync': `${GREEN}in sync${RESET}`,
  'local-additions': `${YELLOW}local additions${RESET}`,
  'upstream-ahead': `${RED}upstream ahead${RESET}`,
  'no-upstream': `${DIM}no upstream entry${RESET}`,
  error: `${RED}error${RESET}`,
};

console.log(`\nCore drift vs shadcn new-york-v4 (${components.length} components)\n`);

for (const r of results) {
  console.log(`  ${r.name.padEnd(16)} ${label[r.status]}`);
  if (r.detail) {
    console.log(`    ${DIM}${r.detail}${RESET}`);
  }
  if (r.added?.length) {
    console.log(`    ${DIM}+ local: ${r.added.join(' ')}${RESET}`);
  }
  if (r.behind?.length) {
    console.log(`    ${RED}- upstream has: ${r.behind.join(' ')}${RESET}`);
  }
}

console.log(
  `\n${results.filter(r => r.status === 'in-sync').length} in sync · ` +
    `${results.filter(r => r.status === 'local-additions').length} local additions · ` +
    `${results.filter(r => r.status === 'upstream-ahead').length} upstream ahead · ` +
    `${results.filter(r => r.status === 'no-upstream').length} no entry` +
    (results.some(r => r.status === 'error')
      ? ` · ${results.filter(r => r.status === 'error').length} errored`
      : '') +
    '\n',
);

// Baseline snapshot of each component's status + the exact tokens it lags
// behind upstream on — so the standing intentional divergence (OVERLAY_LAYER,
// and the documented structural patches) is recorded once and only a *new*
// regression trips `--enforce`. Same `--update` idiom as api-surface.
const RANK = { 'in-sync': 0, 'local-additions': 1, 'upstream-ahead': 2 };
const snapshot = Object.fromEntries(
  results
    .filter(r => r.status in RANK)
    .map(r => [r.name, { status: r.status, behind: [...(r.behind ?? [])].sort() }]),
);

if (update) {
  fs.writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`✓ Wrote baseline snapshot (${Object.keys(snapshot).length} components).\n`);
  process.exit(0);
}

if (!fs.existsSync(SNAPSHOT_PATH)) {
  console.error(
    `✘ No baseline at ${path.relative(process.cwd(), SNAPSHOT_PATH)} — run with --update first.`,
  );
  process.exit(1);
}
const baseline = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));

const regressions = [];
for (const [name, cur] of Object.entries(snapshot)) {
  const base = baseline[name];
  if (!base) {
    regressions.push(`${name}: new component, not in baseline`);
    continue;
  }
  if (RANK[cur.status] > RANK[base.status]) {
    regressions.push(`${name}: ${base.status} → ${cur.status}`);
    continue;
  }
  const newlyBehind = cur.behind.filter(t => !base.behind.includes(t));
  if (newlyBehind.length) {
    regressions.push(`${name}: new upstream-only tokens — ${newlyBehind.join(' ')}`);
  }
}

const errored = results.filter(r => r.status === 'error');

if (regressions.length || errored.length) {
  if (regressions.length) {
    console.log(`${RED}Regressions vs baseline:${RESET}`);
    regressions.forEach(r => console.log(`  ${RED}• ${r}${RESET}`));
  }
  errored.forEach(r => console.log(`  ${RED}• ${r.name}: ${r.detail}${RESET}`));
  console.log(
    `\n${DIM}If the new divergence is intentional, re-baseline with \`pnpm check-core-drift --update\`.${RESET}\n`,
  );
  if (enforce) {
    process.exit(1);
  }
} else {
  console.log(`${GREEN}✓ No regression vs baseline.${RESET}\n`);
}
