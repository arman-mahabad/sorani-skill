#!/usr/bin/env node
// Sorani text checks. No dependencies.
//   node check-sorani.mjs [--fix] FILE...
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const AR = '؀-ۿ'; // Arabic block, where every Sorani letter lives
const word = (ch) => new RegExp(`[${AR}]`).test(ch ?? '');

// Always-safe replacements in Sorani text.
export const FIXES = [
  { from: /ي/g, to: 'ی', what: 'Arabic yeh ي (U+064A); use Kurdish ی (U+06CC)' },
  { from: /ى/g, to: 'ی', what: 'alef maksura ى (U+0649); use ی (U+06CC)' },
  { from: /ك/g, to: 'ک', what: 'Arabic kaf ك (U+0643); use ک (U+06A9)' },
  { from: /ـ/g, to: '', what: 'tatweel ـ (U+0640); remove it' },
];

export function check(text) {
  const problems = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    const at = (msg) => problems.push({ line: i + 1, msg });
    for (const f of FIXES) if (line.match(f.from)) at(f.what);
    if (/ة/.test(line)) at('teh marbuta ة (U+0629); Sorani writes ە (U+06D5)');
    if (/ؤ/.test(line)) at('waw with hamza ؤ (U+0624); Sorani o is ۆ (U+06C6)');
    if (new RegExp(`[${AR}]ه(?![${AR}])`).test(line)) at('word-final ه (U+0647): if this is the vowel e, use ە (U+06D5)');
    for (let k = 0; k < line.length; k++) {
      const c = line[k];
      if (!',?;'.includes(c)) continue;
      const before = line.slice(0, k).trimEnd().slice(-1);
      const after = line.slice(k + 1).trimStart()[0];
      if (word(before) && (after === undefined || word(after))) {
        at(`Latin "${c}" between Kurdish words; use ${{ ',': '،', '?': '؟', ';': '؛' }[c]}`);
      }
    }
  });
  const sets = [/[0-9]/, /[٠-٩]/, /[۰-۹]/].filter((r) => r.test(text)).length;
  if (sets > 1) problems.push({ line: 0, msg: 'digits from more than one set (Latin, Arabic-Indic, Persian); pick one' });
  if (/ه/.test(text) && /ھ/.test(text)) problems.push({ line: 0, msg: 'both ه (U+0647) and ھ (U+06BE) used for h; pick one' });
  return problems;
}

export function fix(text) {
  return FIXES.reduce((t, f) => t.replace(f.from, f.to), text);
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const args = process.argv.slice(2);
  const doFix = args.includes('--fix');
  const files = args.filter((a) => a !== '--fix');
  if (files.length === 0) { console.error('usage: check-sorani.mjs [--fix] FILE...'); process.exit(2); }
  let total = 0;
  for (const file of files) {
    let text = readFileSync(file, 'utf8');
    if (doFix) { const fixed = fix(text); if (fixed !== text) { writeFileSync(file, fixed); text = fixed; console.log(`fixed ${file}`); } }
    for (const p of check(text)) { total++; console.log(`${file}${p.line ? `:${p.line}` : ''}  ${p.msg}`); }
  }
  console.log(total ? `${total} problem(s)` : 'ok');
  process.exit(total ? 1 : 0);
}
