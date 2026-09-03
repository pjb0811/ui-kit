#!/usr/bin/env node
// Drafts .changeset/<branch-slug>[-<suffix>].md file(s) by asking an LLM
// to summarize this PR's diff to each tracked package (minus each
// package's own `exclude` list — see PACKAGES) as a semver bump +
// one-paragraph description, in changesets' own file format. Runs once
// per PR (the calling workflow skips this script entirely if a
// changeset was already added in this PR), so it never overwrites
// something a human already wrote or edited. One file is written per
// package that actually changed, since each needs its own bump + summary.
//
// Uses NVIDIA's OpenAI-compatible API Catalog endpoint. Model selection,
// fallback logic, and <think>-block stripping live in nvidia-chat.mjs.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { nvidiaChat, requireEnv } from './nvidia-chat.mjs';

const MAX_DIFF_CHARS = 12000;

// `fileSuffix: ''` for @repo/ui keeps its filename as just the branch
// slug (`<slug>.md`), since that's the one publish.yml/release notes
// actually key off of.
const PACKAGES = [
  {
    name: '@repo/ui',
    dir: 'packages/ui',
    // README/CHANGELOG/AGENTS.md edits at the package root have zero
    // effect on what actually publishes (files: ["dist"]) — excluded so
    // a docs-wording-only PR doesn't get a changeset. Everything else
    // under packages/ui (src/, package.json, build config) stays in
    // scope: a dependency bump or build-config change can legitimately
    // warrant one (e.g. 5.3.0's "Update dependencies to latest
    // versions"), so this only excludes specific known-irrelevant files
    // rather than narrowing wholesale to src/.
    exclude: [
      'packages/ui/README.md',
      'packages/ui/README.ko.md',
      'packages/ui/CHANGELOG.md',
      'packages/ui/AGENTS.md',
    ],
    fileSuffix: '',
    kind: 'React component library, published to npm',
  },
  {
    name: 'web',
    dir: 'apps/web',
    exclude: [],
    fileSuffix: '-web',
    kind: 'Next.js marketing site, deployed but not published to npm',
  },
  {
    name: 'docs',
    dir: 'apps/docs',
    exclude: [],
    fileSuffix: '-docs',
    kind: 'Storybook/docs site, deployed but not published to npm',
  },
];

// The model isn't guaranteed to honor a strict JSON-only instruction, so
// pull the object out of a ```json fenced block if present and fall back to
// parsing the raw content otherwise.
function extractJson(content) {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : content;
  return JSON.parse(raw.trim());
}

function diffBetween(base, head, dir, exclude = []) {
  return execFileSync(
    'git',
    [
      'diff',
      `${base}...${head}`,
      '--',
      dir,
      ...exclude.map(path => `:!${path}`),
    ],
    { encoding: 'utf8', maxBuffer: 1024 * 1024 * 20 },
  );
}

async function draftFor(pkg, { apiKey, baseSha, headSha, branchSlug }) {
  let diff;
  try {
    diff = diffBetween(baseSha, headSha, pkg.dir, pkg.exclude);
  } catch (err) {
    console.log(
      `Could not diff ${baseSha}...${headSha} for ${pkg.dir}: ${err.message}`,
    );
    return;
  }

  if (!diff.trim()) {
    console.log(
      `No changes under ${pkg.dir} — skipping changeset draft for ${pkg.name}.`,
    );
    return;
  }

  const truncatedDiff =
    diff.length > MAX_DIFF_CHARS
      ? `${diff.slice(0, MAX_DIFF_CHARS)}\n... (truncated)`
      : diff;

  const systemPrompt = [
    `You are a release-notes assistant for "${pkg.name}" (a ${pkg.kind})`,
    'that uses changesets for versioning.',
    'You will be given a git diff for one pull request.',
    'bump: major = breaking change or major user-facing redesign, minor =',
    'new backward-compatible feature/page/export, patch = bug fix, internal',
    'refactor, docs, or other non-breaking change.',
    'summary: one short paragraph (1-3 sentences), imperative present',
    'tense, describing the user-facing effect of this change — this text',
    'is used verbatim as a changelog entry, so do not include prose about',
    'the diff itself, file names, or meta-commentary.',
    'If the diff has no user-facing or notable effect (pure test/story/',
    'internal-only noise), respond with bump "patch" and an empty summary.',
    'Respond with ONLY a JSON object, no prose, no markdown code fences,',
    "matching: { \"bump\": \"major\" | \"minor\" | \"patch\", \"summary\": string }.",
  ].join(' ');

  // A drafted changeset is a nice-to-have, not something worth failing the
  // required "draft" check over — if the API is unavailable even after all
  // candidates are exhausted, skip this package instead of blocking the PR.
  let result;
  try {
    const content = await nvidiaChat(apiKey, {
      temperature: 0,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `\`\`\`diff\n${truncatedDiff}\n\`\`\`` },
      ],
    });

    result = extractJson(content);
    if (!result || typeof result !== 'object') {
      throw new Error(`Model response is not an object for ${pkg.name}`);
    }
    if (!['major', 'minor', 'patch'].includes(result.bump)) {
      throw new Error(`Invalid bump type "${result.bump}" for ${pkg.name}`);
    }
  } catch (err) {
    console.log(
      `NVIDIA API unavailable, skipping changeset draft for ${pkg.name}: ${err.message}`,
    );
    return;
  }

  if (!result.summary || !result.summary.trim()) {
    console.log(`Model reported no notable change for ${pkg.name} — nothing to do.`);
    return;
  }

  const filePath = `.changeset/${branchSlug}${pkg.fileSuffix}.md`;
  const fileContent = [
    '---',
    `'${pkg.name}': ${result.bump}`,
    '---',
    '',
    result.summary.trim(),
    '',
  ].join('\n');

  fs.writeFileSync(filePath, fileContent);
  console.log(`Wrote ${filePath} (${result.bump}): ${result.summary}`);
}

async function main() {
  const apiKey = requireEnv('NVIDIA_API_KEY');
  const baseSha = requireEnv('BASE_SHA');
  const headSha = requireEnv('HEAD_SHA');
  const branchSlug = requireEnv('BRANCH_SLUG');

  for (const pkg of PACKAGES) {
    await draftFor(pkg, { apiKey, baseSha, headSha, branchSlug });
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
