#!/usr/bin/env node
// Drafts .changeset/pr-<number>[-<suffix>].md file(s) by asking Gemini
// to summarize this PR's diff to each tracked package as a semver
// bump + one-paragraph description, in changesets' own file format. Runs
// once per PR (the calling workflow skips this script entirely if any
// changeset file for this PR already exists), so it never overwrites
// something a human already wrote or edited. One file is written per
// package that actually changed, since each needs its own bump + summary.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

// "-latest" alias: Google keeps this pointed at their current lightest/
// cheapest Flash model, so this stays valid across model retirements
// (unlike a dated model id, which can 404 once Google sunsets it — as
// happened to live-editor's previous gemini-2.5-flash-lite pin, and as
// happened here when GitHub Models itself was fully retired).
const MODEL = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const MAX_DIFF_CHARS = 12000;

// `fileSuffix: ''` for @repo/ui keeps its existing `pr-<number>.md`
// filename unchanged, since that's the one publish.yml/release notes
// actually key off of.
const PACKAGES = [
  {
    name: '@repo/ui',
    dir: 'packages/ui',
    fileSuffix: '',
    kind: 'React component library, published to npm',
  },
  {
    name: 'web',
    dir: 'apps/web',
    fileSuffix: '-web',
    kind: 'Next.js marketing site, deployed but not published to npm',
  },
  {
    name: 'docs',
    dir: 'apps/docs',
    fileSuffix: '-docs',
    kind: 'Storybook/docs site, deployed but not published to npm',
  },
];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function diffBetween(base, head, dir) {
  return execFileSync('git', ['diff', `${base}...${head}`, '--', dir], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
  });
}

async function draftFor(pkg, { apiKey, baseSha, headSha, prNumber }) {
  let diff;
  try {
    diff = diffBetween(baseSha, headSha, pkg.dir);
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
  ].join(' ');

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'x-goog-api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [
        {
          role: 'user',
          parts: [{ text: `\`\`\`diff\n${truncatedDiff}\n\`\`\`` }],
        },
      ],
      generationConfig: {
        temperature: 0,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            bump: { type: 'STRING', enum: ['major', 'minor', 'patch'] },
            summary: { type: 'STRING' },
          },
          required: ['bump', 'summary'],
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Gemini API request failed for ${pkg.name}: ${response.status} ${response.statusText} — ${await response.text()}`,
    );
  }

  const body = await response.json();
  const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    const blockReason = body.promptFeedback?.blockReason;
    throw new Error(
      blockReason
        ? `Gemini blocked the request for ${pkg.name}: ${blockReason}`
        : `Gemini response missing candidates[0].content.parts[0].text for ${pkg.name}`,
    );
  }

  const result = JSON.parse(text);
  if (!['major', 'minor', 'patch'].includes(result.bump)) {
    throw new Error(`Invalid bump type "${result.bump}" for ${pkg.name}`);
  }

  if (!result.summary || !result.summary.trim()) {
    console.log(`Model reported no notable change for ${pkg.name} — nothing to do.`);
    return;
  }

  const filePath = `.changeset/pr-${prNumber}${pkg.fileSuffix}.md`;
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
  const apiKey = requireEnv('GEMINI_API_KEY');
  const baseSha = requireEnv('BASE_SHA');
  const headSha = requireEnv('HEAD_SHA');
  const prNumber = requireEnv('PR_NUMBER');

  for (const pkg of PACKAGES) {
    await draftFor(pkg, { apiKey, baseSha, headSha, prNumber });
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
