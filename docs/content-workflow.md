# Content workflow

This document tells how to write and change the course content and the law data. Read it together with `README.md` (structure) and `docs/design.md` (purpose, content rules, decisions). Add to it what the next session must know.

## Where the content is

| File | What it holds |
| --- | --- |
| `public/data/manifest.json` | The parts and the chapters: `id`, `number`, `part`, `file`, `minutes`, `title`, `summary`. The app shows the chapters in the order of this list. |
| `public/data/chapters/{en,bg}/NN-id.md` | The lesson text. |
| `public/data/chapters/{en,bg}/NN-id.json` | The objectives, the cards and the test of a chapter. |
| `public/data/laws/catalog.json`, `laws/acts/<id>.json` | The law library, written by `tools/import_laws.py`. Do not edit the act files by hand. |
| `public/data/laws/en/<id>.json` | Unofficial English translations, by article number. |
| `tools/manual/tarifa.json` | The fee tariff, a hand-made act. |
| `public/data/glossary.json`, `templates.json`, `checklists.json` | Glossary, document templates, checklists. |

The progress of a reader, the flashcard boxes and the test results use the chapter `id`, not the number. A card key is `<chapter id>:<card index>`.

The two languages have the same structure: the same headings, tables and callouts, the same number of cards and questions, and the same citations in the same order.

## Writing a lesson

### Citations

Every statement of law cites its provision. A citation is a link that opens the law panel.

| Form | Example | Shows (EN / BG) |
| --- | --- | --- |
| Article | `[[zzd:18]]` | Art. 18 ЗЗД / чл. 18 ЗЗД |
| Paragraph | `[[znnd:25:9]]` | Art. 25(9) ЗННД / чл. 25, ал. 9 ЗННД |
| Item of a paragraph | `[[znnd:97:1:7]]` | Art. 97(1), item 7 ЗННД |
| Item without a paragraph | `[[gpk:580::3]]` | Art. 580, item 3 ГПК |
| Provision of the final blocks | `[[znnd:§1]]`, `[[zut:§5::46]]` | § 1 ЗННД |
| Tariff item | `[[tarifa:8]]` | Item 8 ТНТ / т. 8 ТНТ |
| Own label | `[[gpk:530\|Art. 530–541]]` | Art. 530–541 |

- Article numbers use the Cyrillic letter: `28а`, not `28a`.
- Use a label for a range, for a list, or to keep the wording of the sentence, for example "Чл. 200 ЗУТ" at the start of a Bulgarian sentence. A range links to its first article.
- Paragraph numbers follow the law views: "(9)" marks paragraph 9. In an act without such numbers (ЗЗД, ЗЛС, ЗН), every line that is not an item starts the next paragraph. Check with `bun run law zzd:26:2` before you cite.
- Write no plain reference such as "Art. 25 ЗННД" to an article that the library has. `bun run check:content` warns about it.
- Law outside the library stays plain text, and the text says where it is. Examples: Art. 313 НК, Art. 33 of the GDPR, the 2006 act that amended ЗС, Art. 452–453 ГПК.

### Other marks

- `{{нотариален акт}}`: a Bulgarian term in English text.
- `> [!law|tip|warn|example|note|task|reform|solution] Title`: a callout. `solution` stays closed until the reader opens it.
- A fenced block with the language `doc`: the text of a document, shown like a sheet of paper. Citations do not work inside it.
- A reference to another chapter: "(chapter 18)", "(глава 18)".

### Cards and questions

- `answer` is always `0`. The app shuffles the options.
- `refs` lists the provisions of the question. The explanation cites them too, and it says why the wrong options are wrong.
- In each chapter, the right option may be the only longest option in at most a third of the questions. Keep the right option shorter than twice the mean of the wrong options. Do not repeat a word of the question only in the right option. `docs/research/course-content/00-method.md` describes these measures.

### Amounts

Bulgaria uses the euro since 1 January 2026. Lev amounts in the acts apply through Art. 11–13 ЗВЕРБ: divide by 1.95583 and round to the cent. For a fee: convert the material interest to leva, apply the tariff item, then convert the fee to euro.

## Adding or renumbering a chapter

1. Add the entry to `chapters` and to its part in `manifest.json`.
2. Write the `.md` and `.json` files in both languages.
3. If the numbers of other chapters move, rename their files and change every "chapter N" and "глава N" in the lessons, cards and explanations of both languages.
4. Update the counts in `README.md`.

The file names contain the chapter number. After a publish that renames files, a reader with the old manifest gets "404" for the renamed chapters. The old manifest stays in an open tab, and GitHub Pages lets a browser keep `manifest.json` for 10 minutes (`Cache-Control: max-age=600`). A reload after that time, or a hard reload at once, fixes it. No progress is lost. So do not renumber chapters without a good reason, and make all the renames in one publish.

## Law data

- Read a provision: `bun run law znnd:25:9`, `bun run law --en zaz:3`, `bun run law --grep zmdt "наследств"`.
- Import: `python tools/import_laws.py zut zds --cache <folder>`. The cache keeps the lex.bg pages, so a second run needs no download.
- `include` in `tools/laws.config.json` makes a partial import: articles (`"25"`, `"7-8"`) and named provisions of the act's own final blocks (`"§5"`). A range takes the articles with a letter too (`"147"` takes `147а`). Without `include`, the import is full and keeps the annexes as notes under their own heading. The provisions of amending acts are never kept.
- After an import, compare the old and the new items (`git diff`). Only the changes that you expect may appear.
- Translations go in `public/data/laws/en/<act>.json`: `{"25": {"paragraphs": ["Art. 25. (1) ...", "(2) ..."]}}`. Keep the line shape of the Bulgarian text. A partial translation ends with a line such as "(The other items of § 5 are not translated here.)". A cited article without a translation gives a warning.

## Checks

Run before every commit:

```bash
bun run check:content
bun run lint
bun run test
bun run build
bunx prettier --check "src/**/*.{ts,html,scss}"
```

`bun run check:content` fails when a citation names an act, an article, a paragraph or an item that the library does not have. It also fails on a Latin letter in an article number, an unknown chapter link, different counts in the two languages, a bad answer index, right options that are too often the longest, HTML left in a law text, or a translation of an article that the act does not have. It warns about untranslated cited articles, very long right options and plain references.

## Publishing

A push to `main` publishes the site (`.github/workflows/pages.yml`). Push only when the owner asks. After the push, `gh run list --workflow pages.yml` shows the run, which takes about one minute. Then open https://b1o.github.io/notary-study/. Every deep link returns the status 404, because `404.html` is a copy of the app. The page still works.

## Pitfalls on Windows

- Python `write_text` writes CRLF. Write with `newline="\n"`.
- Python prints Cyrillic only after `sys.stdout.reconfigure(encoding="utf-8")`. With `python -I`, `PYTHONIOENCODING` has no effect.
- A Bash heredoc can change backslashes. Put a script with regular expressions in a file, or use an editor tool.

## Research notes

Research notes go in `docs/research/<topic>/`, with their sources. The course review is in `docs/research/course-content/`: the method (`00-method.md`), one note per chapter (old chapter numbers), and the audit of 22 October 2026 with its addendum on the new lessons.
