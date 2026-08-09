#!/usr/bin/env node
// Flags template literals with `${...}` interpolation used inside `cn(...)`
// calls under src/. Tailwind v4 only extracts class candidates that appear
// as literal strings in source — anything built via string interpolation
// (e.g. `` `before:${side}-0` ``) silently never makes it into the
// generated CSS. This bit ui-kit#177 (Popover's arrow classes) once
// already; this is a lightweight heuristic tripwire against it recurring,
// not a full parser — false positives are possible on unusual code, in
// which case just fix the flagged spot to use a literal lookup table
// instead (see popover.tsx/drawer.tsx for the pattern) or, if it's
// genuinely not a Tailwind class, ignore this script's finding.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.join(__dirname, '..', 'src');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

// Scans one file's raw text for backtick template literals that (a)
// contain `${` and (b) sit inside a `cn(...)` call, however deeply
// nested (e.g. inside a conditional or another function call within the
// cn() argument list). Skips over line/block comments and '...'/"..."
// strings so unbalanced brackets in them don't throw off paren tracking.
function findFindings(filePath, content) {
  const findings = [];
  const stack = []; // one entry per open paren: { isCn: boolean }
  const len = content.length;
  let i = 0;

  const isInsideCn = () => stack.some(frame => frame.isCn);
  const lineAt = index => content.slice(0, index).split('\n').length;

  while (i < len) {
    const ch = content[i];
    const next = content[i + 1];

    if (ch === '/' && next === '/') {
      const end = content.indexOf('\n', i);
      i = end === -1 ? len : end;
      continue;
    }

    if (ch === '/' && next === '*') {
      const end = content.indexOf('*/', i + 2);
      i = end === -1 ? len : end + 2;
      continue;
    }

    if (ch === "'" || ch === '"') {
      const quote = ch;
      let j = i + 1;
      while (j < len && content[j] !== quote) {
        j += content[j] === '\\' ? 2 : 1;
      }
      i = j + 1;
      continue;
    }

    if (ch === '`') {
      const start = i;
      let j = i + 1;
      let hasInterpolation = false;

      while (j < len && content[j] !== '`') {
        if (content[j] === '\\') {
          j += 2;
          continue;
        }
        if (content[j] === '$' && content[j + 1] === '{') {
          hasInterpolation = true;
          let braceDepth = 1;
          j += 2;
          while (j < len && braceDepth > 0) {
            if (content[j] === '{') braceDepth++;
            else if (content[j] === '}') braceDepth--;
            j++;
          }
          continue;
        }
        j++;
      }
      j++; // closing backtick

      if (hasInterpolation && isInsideCn()) {
        findings.push({
          file: filePath,
          line: lineAt(start),
          snippet: content.slice(start, j).replace(/\s+/g, ' ').slice(0, 100),
        });
      }

      i = j;
      continue;
    }

    if (ch === '(') {
      const before = content.slice(Math.max(0, i - 2), i);
      const beforeThat = content[i - 3];
      const isCnCall =
        before === 'cn' && !/[a-zA-Z0-9_$]/.test(beforeThat ?? '');
      stack.push({ isCn: isCnCall });
      i++;
      continue;
    }

    if (ch === ')') {
      stack.pop();
      i++;
      continue;
    }

    i++;
  }

  return findings;
}

const files = walk(SRC_DIR);
const allFindings = files.flatMap(file =>
  findFindings(file, fs.readFileSync(file, 'utf8')),
);

if (allFindings.length === 0) {
  console.log(
    `✓ No dynamically-constructed class strings found in cn() calls (${files.length} files scanned).`,
  );
  process.exit(0);
}

console.error(
  `✗ Found ${allFindings.length} template literal(s) with interpolation inside cn() calls — Tailwind won't generate CSS for these unless the interpolated parts happen to appear as literal strings elsewhere in source:\n`,
);
for (const { file, line, snippet } of allFindings) {
  console.error(`  ${path.relative(process.cwd(), file)}:${line}`);
  console.error(`    ${snippet}\n`);
}
console.error(
  'Replace with a literal lookup table instead (see popover.tsx getArrowClassName / drawer.tsx ROUNDED_CLASSES for the pattern).',
);
process.exit(1);
