# Sorani skill for Claude

A Claude skill for writing, translating and displaying Sorani Kurdish (Central Kurdish, `ckb`)
correctly.

## Why I built this

I build a study app for medical students that is written in Sorani. Language models write
Sorani with Arabic and Persian habits: the wrong ی and ک, ة or ه where Kurdish writes ە, Latin
commas and question marks, and right-to-left pages that break in fonts without ڕ ڵ ێ ۆ.
I couldn't find a Claude skill for Sorani, so I wrote one.

## Try it

```bash
node skills/sorani/scripts/check-sorani.mjs examples/mistakes.txt
```

```
examples/mistakes.txt:1  Arabic yeh ي (U+064A); use Kurdish ی (U+06CC)
examples/mistakes.txt:1  Arabic kaf ك (U+0643); use ک (U+06A9)
examples/mistakes.txt:2  Latin "?" between Kurdish words; use ؟
3 problem(s)
```

Add `--fix` and it rewrites the file, fixing only the changes that are always safe (here the
two letters). It exits with 1 when problems remain, and it needs Node and nothing else.

## What's inside

- Letters: the Kurdish letters, their code points, and the Arabic lookalikes to avoid.
- Spelling: written vowels, ئ at the start of words that begin with a vowel, no tatweel.
- Punctuation and digits: ، ؟ ؛ and how to pick one digit set for each audience.
- Grammar basics: definite and indefinite endings, ezafe, demonstratives and verb prefixes,
  so generated sentences come out right.
- Natural writing: verb last, how to handle technical terms, تۆ or ئێوە.
- Web display: `lang="ckb" dir="rtl"`, `<bdi>` for mixed text, logical CSS, fonts that cover
  Kurdish, and a way to test that a font really has the letters.
- `check-sorani.mjs`: flags Arabic and Persian letters typed by mistake, mixed digit sets and
  Latin punctuation.

## Install

```bash
cp -r skills/sorani ~/.claude/skills/
```

Or per project, at `.claude/skills/sorani/`. Claude loads it whenever Sorani text or a Kurdish
interface comes up.

## Tests

```bash
node --test "tests/*.test.mjs"
```

The tests cover `check-sorani.mjs`. The skill's written rules have no evals yet.

## Status

Version 0.1. It doesn't replace a native speaker: the skill tells Claude to flag sentences it
is unsure of and ask for a human read before anything ships. A glossary format and evals come
next.

## License

MIT
