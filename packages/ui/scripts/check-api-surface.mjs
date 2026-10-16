#!/usr/bin/env node
// Public API surface tripwire (Phase 3 regression net, ui-kit#294).
//
// Guards the exact blind spot that shipped ui-kit#277: the `exports` maps in
// package.json (dev) and package.publish.json (published) silently drifted —
// a dead `./enums` subpath in one, a missing `./providers` in the other — and
// no gate caught it. This script:
//
//   1. Asserts the two manifests expose the SAME set of `exports` subpaths
//      (their target paths differ — src vs dist — but the subpath KEYS must
//      match, or published consumers get a surface that dev never tests).
//   2. Asserts every component a tier index exports as `default as X` has an
//      `./X` subpath in both manifests and an `X` entry in tsdown.config.ts,
//      all pointing at the file the tier index resolves to (ui-kit#545).
//      Without this, older components never got a subpath while newer ones did,
//      and a moved file would leave its subpath pointing at the old path.
//   3. Snapshots the union of subpaths + the runtime export names from the
//      built barrel (dist/index.mjs) into api-surface.snapshot.json, and fails
//      if the live surface no longer matches. Any intended change is recorded
//      by re-running with `--update`, which makes the diff show up in review.
//
// Run after `build` (it reads dist/index.mjs). `--update` rewrites the
// snapshot; bare run checks against it.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_DIR = path.join(__dirname, '..');
const SNAPSHOT_PATH = path.join(__dirname, 'api-surface.snapshot.json');

const update = process.argv.includes('--update');

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(PKG_DIR, file), 'utf8'));
}

function exportSubpaths(pkg) {
  return Object.keys(pkg.exports ?? {}).sort();
}

// The built barrel emits a single flat `export { A, B, ... };` line. Parse the
// names out of it statically — importing dist/index.mjs would execute every
// component module (and Swiper's `.css` import, which Node can't load).
function runtimeExportNames() {
  const dist = path.join(PKG_DIR, 'dist', 'index.mjs');
  if (!fs.existsSync(dist)) {
    console.error(
      '✘ dist/index.mjs not found — run `pnpm --filter @repo/ui build` first.',
    );
    process.exit(1);
  }
  const src = fs.readFileSync(dist, 'utf8');
  const names = new Set();
  // `export { A, B as C };` — take the exported (post-`as`) name.
  for (const m of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of m[1].split(',')) {
      const token = part.trim();
      if (!token) continue;
      const asMatch = token.match(/\bas\s+([A-Za-z0-9_$]+)$/);
      names.add(asMatch ? asMatch[1] : token);
    }
  }
  // `export default X` / `export const X` / `export function X` (defensive —
  // the current barrel uses only the braced form).
  for (const m of src.matchAll(
    /export\s+(?:default\s+|const\s+|function\s+|class\s+)([A-Za-z0-9_$]+)/g,
  )) {
    names.add(m[1] === 'default' ? 'default' : m[1]);
  }
  return [...names].sort();
}

const devExports = exportSubpaths(readJson('package.json'));
const publishExports = exportSubpaths(readJson('package.publish.json'));

const errors = [];

// 1. Manifest consistency (the #277 guard).
const onlyDev = devExports.filter(k => !publishExports.includes(k));
const onlyPublish = publishExports.filter(k => !devExports.includes(k));
if (onlyDev.length || onlyPublish.length) {
  errors.push(
    'exports subpath drift between package.json and package.publish.json:' +
      (onlyDev.length
        ? `\n    only in package.json (dev): ${onlyDev.join(', ')}`
        : '') +
      (onlyPublish.length
        ? `\n    only in package.publish.json (published): ${onlyPublish.join(', ')}`
        : ''),
  );
}

// 2. Every tier-index component has a matching subpath (#545). Named-only
// exports such as `export { Row, Col } from './grid'` are skipped: subpaths
// expose a single default export.
const TIERS = ['atoms', 'molecules', 'organisms', 'templates'];

function resolveComponentFile(tier, specifier) {
  for (const candidate of [
    `${specifier}.tsx`,
    `${specifier}.ts`,
    `${specifier}/index.ts`,
    `${specifier}/index.tsx`,
  ]) {
    const file = `src/components/${tier}/${candidate}`;
    if (fs.existsSync(path.join(PKG_DIR, file))) return file;
  }
  return null;
}

function tierComponents() {
  return TIERS.flatMap(tier => {
    const index = fs.readFileSync(
      path.join(PKG_DIR, 'src', 'components', tier, 'index.ts'),
      'utf8',
    );
    return [
      ...index.matchAll(/^export \{ default as (\w+) \} from '\.\/([^']+)';/gm),
    ].map(([, name, specifier]) => ({
      name,
      file: resolveComponentFile(tier, specifier),
    }));
  });
}

function tsdownEntries() {
  const source = fs.readFileSync(
    path.join(PKG_DIR, 'tsdown.config.ts'),
    'utf8',
  );
  return Object.fromEntries(
    [...source.matchAll(/^\s+(\w+): '(src\/[^']+)',$/gm)].map(([, k, v]) => [
      k,
      v,
    ]),
  );
}

{
  const dev = readJson('package.json').exports ?? {};
  const publish = readJson('package.publish.json').exports ?? {};
  const entries = tsdownEntries();
  const problems = [];

  for (const { name, file } of tierComponents()) {
    const key = `./${name}`;
    const published = publish[key];
    if (!file) {
      problems.push(`${name}: tier index points at a file that does not exist`);
      continue;
    }
    if (dev[key] !== `./${file}`) {
      problems.push(
        `${name}: package.json ${key} should be "./${file}" (is ${JSON.stringify(dev[key])})`,
      );
    }
    if (
      published?.types !== `./dist/${name}.d.mts` ||
      published?.import !== `./dist/${name}.mjs` ||
      published?.default !== `./dist/${name}.mjs`
    ) {
      problems.push(
        `${name}: package.publish.json ${key} should point at ./dist/${name}.{mjs,d.mts}`,
      );
    }
    if (entries[name] !== file) {
      problems.push(
        `${name}: tsdown.config.ts entry should be '${file}' (is ${JSON.stringify(entries[name])})`,
      );
    }
  }

  if (problems.length) {
    errors.push(
      'component subpaths out of sync with the tier indexes:\n    ' +
        problems.join('\n    '),
    );
  }
}

// 3. Snapshot the full surface.
const surface = {
  exports: [...new Set([...devExports, ...publishExports])].sort(),
  names: runtimeExportNames(),
};

if (update && errors.length === 0) {
  fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(surface, null, 2) + '\n');
  console.log('✓ api-surface snapshot updated.');
  process.exit(0);
}

if (!fs.existsSync(SNAPSHOT_PATH)) {
  console.error('✘ api-surface.snapshot.json missing — run with --update.');
  process.exit(1);
}

const saved = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));

function diff(kind, before, after) {
  const added = after.filter(x => !before.includes(x));
  const removed = before.filter(x => !after.includes(x));
  if (added.length || removed.length) {
    errors.push(
      `${kind} changed:` +
        (added.length ? `\n    + ${added.join(', ')}` : '') +
        (removed.length ? `\n    - ${removed.join(', ')}` : ''),
    );
  }
}

diff('exports subpaths', saved.exports, surface.exports);
diff('export names', saved.names, surface.names);

if (errors.length) {
  console.error('✘ Public API surface changed:\n');
  for (const e of errors) console.error('  - ' + e + '\n');
  console.error(
    'If this change is intentional, re-run `node scripts/check-api-surface.mjs --update`\n' +
      'and commit the updated snapshot so the change is visible in review.',
  );
  process.exit(1);
}

console.log(
  `✓ Public API surface matches snapshot (${surface.names.length} names, ${surface.exports.length} subpaths).`,
);
