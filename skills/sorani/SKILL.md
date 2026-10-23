---
name: sorani
description: Write, translate, review and display Sorani Kurdish (Central Kurdish, ckb) correctly. Use when producing any Sorani text, translating English into Sorani, building a UI or web page in Sorani or with a Kurdish language switch, choosing fonts or numerals for Kurdish, or checking Kurdish text for Arabic and Persian letters typed by mistake.
---

# Sorani Kurdish

Sorani (Central Kurdish, language code `ckb`) is written right to left in a Kurdish
version of the Arabic script. Models tend to drift into Arabic or Persian spelling,
letters and phrasing, because there is far more of both in their training data. This
skill keeps text Kurdish.

Sorani is not Kurmanji (Northern Kurdish, Latin script, `kmr`). If the user says only
"Kurdish", ask which, or infer from the region: Iraqi Kurdistan (Erbil, Sulaymaniyah)
and Iranian Kurdistan mostly write Sorani.

## 1. Use Kurdish letters, not Arabic lookalikes

| Use | Code point | Not | Why |
| --- | --- | --- | --- |
| ی | U+06CC | ي U+064A, ى U+0649 | Arabic yeh has dots in final form |
| ک | U+06A9 | ك U+0643 | Arabic kaf |
| ە | U+06D5 | ة U+0629, word-final ه U+0647 | ە is the vowel "e" |
| ۆ | U+06C6 | ؤ U+0624 | ؤ is Arabic waw with hamza |
| ێ | U+06CE | ي or ی plus a mark | its own letter |

Kurdish-only letters to expect: ڕ (U+0695, rolled r), ڵ (U+06B5, dark l), ێ, ۆ, ە,
ڤ (U+06A4, v). Also پ چ ژ گ as in Persian.

**h:** writers use either ه (U+0647) or ھ (U+06BE). Pick one per project and keep to it.
Never use ه for the vowel e.

## 2. Spelling rules that differ from Arabic and Persian

- **Vowels are written.** ا = a, ە = e, ۆ = o, و = u/w, وو = û, ی = î/y, ێ = ê.
  Only the short i is unwritten.
- **A word that starts with a vowel starts with ئ:** ئەو, ئێمە, ئاو.
- **No tatweel** (ـ U+0640) for stretching words, and no Arabic harakat.
- **Don't add zero-width non-joiners out of Persian habit.** ە, ا, د, ر, ڕ, ز, ژ, و, ۆ
  already don't join to the left.

## 3. Punctuation and numbers

- Comma ، (U+060C), question mark ؟ (U+061F), semicolon ؛ (U+061B). The full stop is `.`.
- Pick one digit set per document and audience:
  - Iraqi Kurdistan: Arabic-Indic ٠١٢٣٤٥٦٧٨٩ (U+0660–0669) are common, and Latin 0–9
    is normal in apps and tech.
  - Iran: Persian digits ۰۱۲۳۴۵۶۷۸۹ (U+06F0–06F9).
  - Never mix two sets in one text.

## 4. Grammar to get right

Sorani has no grammatical gender. Word order is subject, object, verb, so the verb
comes last.

| Form | Ending | Example |
| --- | --- | --- |
| the (one) | -ەکە | کتێبەکە (the book) |
| the (many) | -ەکان | کتێبەکان (the books) |
| a / one | -ێک | کتێبێک (a book) |
| plural | -ان | کتێبان (books) |
| of / 's (ezafe) | -ی | کتێبی من (my book) |
| this / that | ئەم / ئەو ... -ە | ئەم کتێبە (this book) |

After a vowel the endings change: دەرگاکە (the door), دەرگایەک (a door).

Verbs: دە- for the present (دەخوێنم, I read/study), نا- for the negative present
(ناخوێنم), ب- for the subjunctive and imperative (بخوێنە, read!), and نە- for the
negative past. Person endings attach to the verb: -م (I), -یت/-ی (you), -ێت/-ات (he/she/it),
-ین (we), -ن (you plural, they).

## 5. Writing Sorani that sounds Kurdish

- Don't translate word for word from English. Rebuild the sentence with the verb last.
- Keep technical and medical terms the way users actually say them. Kurdish students
  often use the English term (or the Latin one in medicine). Ask, or follow the project's
  glossary.
- Choose "you": تۆ (informal) or ئێوە (plural and polite). Apps for students often use تۆ,
  and official or medical text uses ئێوە. Keep one.
- Prefer common Sorani words over Arabic or Persian synonyms when both exist.
- Keep UI labels short. Sorani words run longer than English ones, so leave room.
- **Always tell the user that a native speaker should read the text before it ships.**
  Flag any sentence you are unsure of rather than smoothing it over.

## 6. Displaying Sorani on the web

```html
<html lang="ckb" dir="rtl">
```

- For mixed pages, set `lang="ckb" dir="rtl"` on the Sorani element, not only the page.
- Wrap English words, code, numbers with units and user names in `<bdi>`, or use
  `dir="auto"`, so punctuation doesn't jump to the wrong side.
- Use CSS logical properties (`margin-inline-start`, `padding-inline-end`, `text-align: start`)
  so the layout flips by itself. Mirror arrows and "back" icons; never mirror logos,
  media controls or clocks.
- Don't use `letter-spacing` on Arabic-script text; it breaks letter joining.
- Use a slightly larger font size and line height than for Latin text (about 1.1×,
  line-height around 1.7).
- Number formatting: `new Intl.NumberFormat('ckb-IQ')` gives Arabic-Indic digits.
  Check what your runtime returns.

### Fonts

Many Arabic fonts lack ڕ ڵ ێ ۆ ە and fall back to another font for those letters only,
which looks broken. Fonts with Kurdish coverage include Vazirmatn, Noto Sans Arabic and
Noto Naskh Arabic. Kurdish-made fonts such as Rabar and NRT also exist; check their licences.

Test coverage instead of trusting a font's description. Render `ڕ ڵ ێ ۆ ە ڤ` in the
target font and in a generic fallback, and compare glyph widths with canvas
`measureText`. Identical widths for every letter usually mean the font fell back.

## 7. Check the text

```bash
node scripts/check-sorani.mjs FILE...        # report problems
node scripts/check-sorani.mjs --fix FILE...  # also fix the safe ones in place
```

It flags Arabic yeh and kaf, ة, ؤ, tatweel, word-final ه used where ە is likely,
mixed digit sets, mixed ه and ھ, and Latin `,` `?` `;` between Kurdish words.
`--fix` changes only the replacements that are always right (ي ى → ی, ك → ک, tatweel
removed). Everything else needs a human eye.
