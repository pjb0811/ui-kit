#!/usr/bin/env node
// Primary changelog-automation path for .github/workflows/changelog-develop.yml.
// Asks a GitHub Models chat completion for a semver bump + changelog entry per
// changed public package, then applies that JSON directly to package.json /
// CHANGELOG.md. Exits non-zero on any failure so the workflow can fall back
// to the Claude Code Action step instead.

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

function listCandidatePackages() {
  const root = 'packages';
  return fs
    .readdirSync(root)
    .map(name => ({ name, dir: path.join(root, name) }))
    .filter(({ dir }) => fs.existsSync(path.join(dir, 'package.json')))
    .map(({ name, dir }) => {
      const pkgJsonPath = path.join(dir, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
      return { name, dir, pkgJsonPath, pkgName: pkg.name, version: pkg.version, private: pkg.private === true };
    })
    .filter(pkg => !pkg.private);
}

function diffFor(pkg) {
  let diff;
  try {
    diff = git([
      'diff',
      beforeSha,
      afterSha,
      '--',
      pkg.dir,
      `:(exclude)${pkg.dir}/CHANGELOG.md`,
    ]);
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
  if (bump === 'major') return 'Major Changes';
  if (bump === 'minor') return 'Minor Changes';
  return 'Patch Changes';
}

function applyVersionBump(pkg, newVersion) {
  const text = fs.readFileSync(pkg.pkgJsonPath, 'utf8');
  const updated = text.replace(/"version":\s*"[^"]+"/, `"version": "${newVersion}"`);
  fs.writeFileSync(pkg.pkgJsonPath, updated);
}

function applyChangelogEntry(pkg, newVersion, bump, entry) {
  const changelogPath = path.join(pkg.dir, 'CHANGELOG.md');
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

function extractJson(content) {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : content;
  return JSON.parse(raw.trim());
}

function validateResults(results, candidates) {
  const validNames = new Set(candidates.map(c => c.dir));
  if (!Array.isArray(results)) throw new Error('Model response is not a JSON array');
  for (const r of results) {
    if (!r || typeof r !== 'object') throw new Error('Result entry is not an object');
    if (!validNames.has(r.package)) throw new Error(`Unknown package in result: ${r.package}`);
    if (!['major', 'minor', 'patch'].includes(r.bump)) throw new Error(`Invalid bump type: ${r.bump}`);
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
    console.log('No relevant changes in any public package — nothing to do.');
    return;
  }

  const sections = changed
    .map(
      ({ pkg, diff }) => `## Package: ${pkg.dir} (name: ${pkg.pkgName}, current version: ${pkg.version})\n\n\`\`\`diff\n${diff}\n\`\`\``,
    )
    .join('\n\n');

  const exampleChangelog = changed[0].pkg;
  const examplePath = path.join(exampleChangelog.dir, 'CHANGELOG.md');
  const example = fs.existsSync(examplePath)
    ? fs.readFileSync(examplePath, 'utf8').split('\n').slice(0, 20).join('\n')
    : '(no existing CHANGELOG.md yet — use a "## x.y.z" heading followed by "### Patch Changes" etc.)';

  const systemPrompt = [
    'You are a release-notes assistant for a pnpm/turborepo monorepo.',
    'You will be given a git diff for one or more changed packages and must decide',
    'a semver bump (major/minor/patch) and write a changelog entry for each.',
    "Respond with ONLY a JSON array, no prose, no markdown code fences, matching:",
    "Array<{ package: string; bump: 'major' | 'minor' | 'patch'; entry: string }>",
    "`package` must be exactly one of the package directory paths given.",
    '`entry` must be markdown bullet lines starting with "- ", written for developers',
    'consuming this package, matching the tone and detail level of the example shown.',
    'Only include packages that have a real, user-facing or API-relevant change;',
    'omit packages whose diff is purely internal/test/story-only noise.',
  ].join(' ');

  const userPrompt = `${sections}\n\n## Existing CHANGELOG.md style example (from ${exampleChangelog.dir})\n\n\`\`\`\n${example}\n\`\`\``;

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
