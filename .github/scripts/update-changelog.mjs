#!/usr/bin/env node
// Changelog automation for .github/workflows/changelog-develop.yml.
// Asks a GitHub Models chat completion for a semver bump + changelog entry per
// changed public package (plus a dated entry for repo-root/tooling changes),
// then applies that JSON directly to package.json / CHANGELOG.md. Exits
// non-zero on failure, which fails the workflow run (no changelog PR that time).

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const MODEL = process.env.GITHUB_MODELS_MODEL || 'openai/gpt-4o';
const API_URL = 'https://models.github.ai/inference/chat/completions';
const MAX_DIFF_CHARS = 20000;

const token = requireEnv('GITHUB_TOKEN');
const afterSha = requireEnv('AFTER_SHA');
const beforeSha = resolveBeforeSha(process.env.BEFORE_SHA, afterSha);

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function resolveBeforeSha(before, after) {
  if (before && !/^0+$/.test(before)) return before;
  return git(['rev-parse', `${after}~1`]).trim();
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
}

const ROOT_ID = '.';

function listCandidatePackages() {
  const root = 'packages';
  const packages = fs
    .readdirSync(root)
    .map(name => ({ name, dir: path.posix.join(root, name) }))
    .filter(({ dir }) => fs.existsSync(path.posix.join(dir, 'package.json')))
    .map(({ name, dir }) => {
      const pkgJsonPath = path.posix.join(dir, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
      return {
        name,
        dir,
        pkgJsonPath,
        pkgName: pkg.name,
        version: pkg.version,
        private: pkg.private === true,
        isRoot: false,
      };
    })
    .filter(pkg => !pkg.private);

  // Repo-root / tooling changes (CI workflows, root config, etc.) that don't
  // belong to any individual package — tracked in a dated root CHANGELOG.md
  // instead of a semver-versioned one, since the root package.json has no
  // version field (it isn't published).
  const rootEntry = {
    name: 'root',
    dir: ROOT_ID,
    pkgJsonPath: null,
    pkgName: 'ui-kit',
    version: null,
    private: false,
    isRoot: true,
  };

  return [...packages, rootEntry];
}

function diffFor(pkg) {
  const pathspec = pkg.isRoot
    ? [ROOT_ID, ':(exclude)packages', ':(exclude)apps', ':(exclude)CHANGELOG.md', ':(exclude)pnpm-lock.yaml']
    : [pkg.dir, `:(exclude)${pkg.dir}/CHANGELOG.md`];

  let diff;
  try {
    diff = git(['diff', beforeSha, afterSha, '--', ...pathspec]);
  } catch {
    return '';
  }
  if (diff.length > MAX_DIFF_CHARS) {
    diff = `${diff.slice(0, MAX_DIFF_CHARS)}\n... (diff truncated)`;
  }
  return diff;
}

function bumpVersion(version, bump) {
  const [major, minor, patch] = version.split('.').map(Number);
  if (bump === 'major') return `${major + 1}.0.0`;
  if (bump === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

function bumpHeading(bump) {
  if (bump === 'major') return 'Major 변경사항';
  if (bump === 'minor') return 'Minor 변경사항';
  return 'Patch 변경사항';
}

function applyVersionBump(pkg, newVersion) {
  const text = fs.readFileSync(pkg.pkgJsonPath, 'utf8');
  const updated = text.replace(/"version":\s*"[^"]+"/, `"version": "${newVersion}"`);
  fs.writeFileSync(pkg.pkgJsonPath, updated);
}

function applyChangelogEntry(pkg, newVersion, bump, entry) {
  const changelogPath = path.posix.join(pkg.dir, 'CHANGELOG.md');
  const section = `## ${newVersion}\n\n### ${bumpHeading(bump)}\n\n${entry.trim()}\n`;

  if (!fs.existsSync(changelogPath)) {
    fs.writeFileSync(changelogPath, `# ${pkg.pkgName}\n\n${section}`);
    return;
  }

  const content = fs.readFileSync(changelogPath, 'utf8');
  const lines = content.split('\n');
  // lines[0] is the "# PackageName" title, lines[1] is the blank line after it.
  lines.splice(2, 0, section);
  fs.writeFileSync(changelogPath, lines.join('\n'));
}

function applyRootChangelogEntry(pkg, entry) {
  const changelogPath = path.posix.join(pkg.dir, 'CHANGELOG.md');
  const today = new Date().toISOString().slice(0, 10);
  const todayHeading = `## ${today}`;
  const bullets = entry.trim();

  const content = fs.existsSync(changelogPath) ? fs.readFileSync(changelogPath, 'utf8') : '# Changelog\n';

  if (content.includes(`${todayHeading}\n`)) {
    const updated = content.replace(`${todayHeading}\n\n`, `${todayHeading}\n\n${bullets}\n`);
    fs.writeFileSync(changelogPath, updated);
    return;
  }

  const lines = content.split('\n');
  const headingIdx = lines.findIndex(l => l.startsWith('## '));
  const section = [todayHeading, '', bullets, ''];
  const insertAt = headingIdx === -1 ? lines.length : headingIdx;
  lines.splice(insertAt, 0, ...section);
  fs.writeFileSync(changelogPath, lines.join('\n'));
}

function extractJson(content) {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : content;
  return JSON.parse(raw.trim());
}

function validateResults(results, candidates) {
  const byDir = new Map(candidates.map(c => [c.dir, c]));
  if (!Array.isArray(results)) throw new Error('Model response is not a JSON array');
  for (const r of results) {
    if (!r || typeof r !== 'object') throw new Error('Result entry is not an object');
    const candidate = byDir.get(r.package);
    if (!candidate) throw new Error(`Unknown package in result: ${r.package}`);
    const allowedBumps = candidate.isRoot ? ['none'] : ['major', 'minor', 'patch'];
    if (!allowedBumps.includes(r.bump)) throw new Error(`Invalid bump type "${r.bump}" for ${r.package}`);
    if (!r.entry || typeof r.entry !== 'string' || !r.entry.trim()) throw new Error('Missing changelog entry text');
  }
  return results;
}

async function main() {
  const candidates = listCandidatePackages();
  const changed = candidates
    .map(pkg => ({ pkg, diff: diffFor(pkg) }))
    .filter(({ diff }) => diff.trim().length > 0);

  if (changed.length === 0) {
    console.log('No relevant changes in any public package or repo-root files — nothing to do.');
    return;
  }

  const styleExample = pkg => {
    const examplePath = path.posix.join(pkg.dir, 'CHANGELOG.md');
    if (!fs.existsSync(examplePath)) {
      return pkg.isRoot
        ? '(new file — start with "# Changelog" followed by a "## YYYY-MM-DD" heading and bullets)'
        : '(no existing CHANGELOG.md yet — use a "## x.y.z" heading followed by "### Patch Changes" etc.)';
    }
    return fs.readFileSync(examplePath, 'utf8').split('\n').slice(0, 20).join('\n');
  };

  const sections = changed
    .map(({ pkg, diff }) => {
      const label = pkg.isRoot
        ? `## Repo root / tooling changes (package identifier: "${ROOT_ID}", no version — this is NOT a publishable package)`
        : `## Package: ${pkg.dir} (identifier: "${pkg.dir}", name: ${pkg.pkgName}, current version: ${pkg.version})`;
      return `${label}\n\n\`\`\`diff\n${diff}\n\`\`\`\n\nCHANGELOG.md style example for this entry:\n\`\`\`\n${styleExample(pkg)}\n\`\`\``;
    })
    .join('\n\n');

  const systemPrompt = [
    'You are a release-notes assistant for a pnpm/turborepo monorepo.',
    'You will be given a git diff for one or more changed packages, and possibly',
    'a special repo-root entry (identifier ".") for changes to tooling/CI/root',
    'config files that do not belong to any individual package.',
    "Respond with ONLY a JSON array, no prose, no markdown code fences, matching:",
    "Array<{ package: string; bump: 'major' | 'minor' | 'patch' | 'none'; entry: string }>",
    '`package` must be exactly one of the identifiers given.',
    'For a real package, decide a semver `bump`: major = breaking API change,',
    'minor = new backward-compatible feature/prop/export, patch = bug fix,',
    'internal refactor, docs, or other non-breaking change.',
    'For the repo-root entry (identifier "."), `bump` must always be exactly "none"',
    '— it has no version number, it only gets a dated changelog entry.',
    '`entry` must be markdown bullet lines starting with "- ", matching the',
    'structure and detail level of the style example given for that entry.',
    'Write the bullet text itself in Korean (한국어), regardless of what',
    'language the style example or older changelog entries happen to be in —',
    'this only affects the language of new text you write, not existing content.',
    'Keep each bullet concise and terse: do NOT end sentences with polite',
    'full-sentence endings like "~했습니다" or "~합니다"; end with a short',
    'noun/verb-stem form instead (e.g. "~추가", "~수정", "~개선", "~제거"),',
    'matching this repository\'s commit-message convention style.',
    'Only include entries that have a real, user-facing/API-relevant, or',
    'meaningfully-affects-contributors change; omit anything that is purely',
    'internal/test/story-only noise with no one who would care to read about it.',
  ].join(' ');

  const userPrompt = sections;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub Models request failed: ${response.status} ${response.statusText} — ${await response.text()}`);
  }

  const body = await response.json();
  const content = body.choices?.[0]?.message?.content;
  if (!content) throw new Error('GitHub Models response missing choices[0].message.content');

  const results = validateResults(extractJson(content), changed.map(c => c.pkg));

  if (results.length === 0) {
    console.log('Model reported no user-facing changes — nothing to do.');
    return;
  }

  for (const result of results) {
    const { pkg } = changed.find(c => c.pkg.dir === result.package);
    if (pkg.isRoot) {
      applyRootChangelogEntry(pkg, result.entry);
      console.log(`Updated ${pkg.dir}/CHANGELOG.md (dated entry)`);
      continue;
    }
    const newVersion = bumpVersion(pkg.version, result.bump);
    applyVersionBump(pkg, newVersion);
    applyChangelogEntry(pkg, newVersion, result.bump, result.entry);
    console.log(`Updated ${pkg.dir}: ${pkg.version} -> ${newVersion} (${result.bump})`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
