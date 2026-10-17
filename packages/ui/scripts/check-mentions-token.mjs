import assert from 'node:assert/strict';
import fs from 'node:fs';

import ts from 'typescript';

const source = fs.readFileSync(
  new URL('../src/components/atoms/mentions/token.ts', import.meta.url),
  'utf8',
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { findToken, insertToken } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);

const middle = 'Hello @ali there';
const token = findToken(middle, 10, 10, ['@']);

assert.deepEqual(token, { start: 6, end: 10, prefix: '@', query: 'ali' });
assert.deepEqual(insertToken(middle, token, 'alice'), {
  value: 'Hello @alice there', caret: 12,
});
assert.equal(findToken('mail@example.com', 8, 8, ['@']), null);
assert.equal(findToken('Hello @alice', 6, 6, ['@']), null);
assert.equal(findToken('Hello @alice there', 9, 14, ['@']), null);
assert.equal(findToken('@a\ntext', 3, 3, ['@']), null);
assert.equal(findToken('deleted ', 8, 8, ['@']), null);
assert.equal(findToken('@a', -1, 0, ['@']), null);

const selected = findToken('Hello @alice there', 8, 11, ['@']);

assert.equal(selected.query, 'a');
assert.deepEqual(insertToken('Hello @alice there', selected, 'bob'), {
  value: 'Hello @bob there', caret: 10,
});
const multi = '@alice\nAssign @bo';

assert.deepEqual(insertToken(multi, findToken(multi, multi.length, multi.length, ['@']), 'bob'), {
  value: '@alice\nAssign @bob ', caret: 19,
});
assert.deepEqual(findToken('##to', 4, 4, ['#', '##']), {
  start: 0, end: 4, prefix: '##', query: 'to',
});
assert.deepEqual(findToken('안녕 @지', 5, 5, ['@']), {
  start: 3, end: 5, prefix: '@', query: '지',
});
assert.deepEqual(insertToken('@a\nnext', findToken('@a\nnext', 2, 2, ['@']), 'alice'), {
  value: '@alice\nnext', caret: 6,
});
console.log('✓ Mention token contracts passed: mid-text replacement, selections, boundaries, multiline, Unicode and longest prefixes.');
