# Sorani skill for Claude

A Claude skill for writing, translating and displaying **Sorani Kurdish** (Central Kurdish, `ckb`)
correctly.

Language models write Sorani with Arabic and Persian habits: the wrong ی and ک, ة or ه where
Kurdish writes ە, Latin punctuation, and broken right-to-left layouts in fonts that lack
ڕ ڵ ێ ۆ. About eight million people write Sorani, and I couldn't find a skill for it, so I wrote one.

## What's inside

- **Letters:** the Kurdish letters, their code points, and the Arabic lookalikes to avoid.
- **Spelling:** written vowels, the ئ at the start of vowel words, no tatweel.
- **Punctuation and digits:** ، ؟ ؛ and how to pick one digit set per audience.
- **Grammar basics:** definite and indefinite endings, ezafe, demonstratives, verb prefixes,
  so generated sentences come out right.
- **Natural writing:** verb last, how to handle technical terms, تۆ or ئێوە.
- **Web display:** `lang="ckb" dir="rtl"`, `<bdi>` for mixed text, logical CSS, fonts with
  Kurdish coverage, and a way to test that a font really has the letters.
- **`check-sorani.mjs`:** a dependency-free checker that flags Arabic and Persian letters typed
  by mistake, mixed digit sets and Latin punctuation, and fixes the always-safe ones with `--fix`.

## Install

```bash
cp -r skills/sorani ~/.claude/skills/
```

Or per project: `.claude/skills/sorani/`. Claude loads it whenever Sorani text or a Kurdish UI
is involved.

## Check a file

```bash
node skills/sorani/scripts/check-sorani.mjs strings/ckb.json
node skills/sorani/scripts/check-sorani.mjs --fix strings/ckb.json
```

## Run the tests

```bash
node --test "tests/*.test.mjs"
```

## Status

Version 0.1, written for a Sorani-language medical-education app. It doesn't replace a native
speaker: the skill tells Claude to flag uncertain sentences and ask for a human read before
anything ships. Next up are a glossary format and evals.

## License

MIT
