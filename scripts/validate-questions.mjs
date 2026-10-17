#!/usr/bin/env node
// Validates every src/content/questions.*.json: unique ids, answer key present, 4-5 choices, non-empty explanation.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = new URL('../src/content/', import.meta.url).pathname;
let problems = 0, total = 0;
const seenIds = new Set();
for (const f of readdirSync(dir).filter(f => /^questions\.\w+\.json$/.test(f))) {
  const exam = f.split('.')[1];
  const items = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  for (const q of items) {
    total++;
    const where = `${f} ${q.id ?? '(no id)'}`;
    const fail = m => { problems++; console.error(`✗ ${where}: ${m}`); };
    if (!q.id) fail('missing id');
    if (seenIds.has(q.id)) fail('duplicate id'); seenIds.add(q.id);
    if (q.exam !== exam) fail(`exam field "${q.exam}" does not match file "${exam}"`);
    if (!q.prompt?.trim()) fail('empty prompt');
    if (!Array.isArray(q.choices) || q.choices.length < 4 || q.choices.length > 5) fail('needs 4 or 5 choices');
    const keys = (q.choices ?? []).map(c => c.key);
    if (new Set(keys).size !== keys.length) fail('duplicate choice keys');
    if (!keys.includes(q.answer)) fail(`answer "${q.answer}" is not a choice key`);
    if (!q.explanation?.trim()) fail('empty explanation');
    if (!q.section || !q.topic) fail('missing section/topic');
  }
  console.log(`${f}: ${items.length} questions`);
}
console.log(problems ? `${problems} problem(s) in ${total} questions` : `✓ ${total} questions valid`);
process.exit(problems ? 1 : 0);
