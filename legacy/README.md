# Notary Office Course: Bulgaria

A complete, bilingual (English and Bulgarian) course for people who want to work in a Bulgarian notary office: as a clerk, an assistant notary or a notary. The course runs in the browser, needs no installation and works offline. Only the web fonts need an internet connection; without one, the browser uses its own fonts.

## What the course contains

| Part | Content |
|---|---|
| Course | 28 chapters in 7 parts, from the first day in the office to full case simulations |
| Law library | 34 acts imported from lex.bg (the Notaries Act, the notarial part of the Civil Procedure Code, Ordinance No. 32, the tariff, civil, family, inheritance, commercial, tax and AML law), searchable, with an unofficial English translation of 561 articles |
| Citations | Every legal statement in the chapters links to the article; a click opens the article in the side margin |
| Tests | A test for each chapter (pass mark 80%) and a final exam of 40 random questions (pass mark 75%) |
| Flashcards | Leitner boxes for every chapter and for the glossary; due cards come back after 1, 3, 7, 14 and 30 days |
| Glossary | 173 Bulgarian terms with English equivalents, definitions and the law behind each one |
| Templates | 21 working templates (deeds, powers of attorney, declarations, contracts, company documents, wills) with notes and English translations |
| Checklists | 10 document checklists for common files, with ticks saved in the browser |
| Fee calculator | Notarial fee, VAT, entry fee and local acquisition tax, in the form of a notary's bill |

Progress (read chapters, test results, flashcard boxes) is saved in the browser's local storage on your computer only.

## How to open the course

**Option 1 – open the file.** Double-click `index.html`. All features work from the file system.

**Option 2 – local web server** (recommended for Chrome and for sharing on a network):

```bash
python -m http.server 8765 --bind 127.0.0.1
```

Then open <http://localhost:8765> in the browser.

Use the **BG / EN** switch in the top bar to change the language. Press `/` to jump to the search box.

## Folder structure

```
index.html              App shell
assets/
  css/app.css           All styles (light and dark theme, print styles)
  js/core.js            Namespace, UI strings, storage, script loader
  js/markdown.js        Markdown renderer with law citations and callouts
  js/laws.js            Law library: catalog, article rendering, citation parser, margin
  js/views.js           Home, course register, chapter reader, glossary, templates, search
  js/study.js           Tests, final exam, flashcards
  js/tools.js           Fee calculator and checklists
  js/app.js             Router, sidebar, language and theme switches
  img/seal.svg          Favicon
content/
  manifest.js           Parts and chapters (ids, titles, roles, reading time)
  en/NN-<id>.js         English chapters
  bg/NN-<id>.js         Bulgarian chapters
  glossary.js           Glossary
  templates.js          Document templates
  checklists.js         Document checklists
laws/
  catalog.js            List of acts (generated)
  data/<id>.js          Imported Bulgarian text of each act (generated)
  en/<id>.js            Unofficial English translations of articles
  en/index.js           List of acts that have translations
  manual/tarifa.json    Hand-transcribed tariff of notarial fees
tools/
  import_laws.py        Imports the acts from lex.bg
  laws.config.json      Acts to import, with lex.bg ids and article ranges
  check_content.py      Validates citations, chapters, quizzes and translations
```

## Writing content

A chapter is a JavaScript file that calls `NC.registerChapter(lang, {...})` with `id`, `title`, `summary`, `objectives`, `body` (Markdown in a template string), `cards` (`[front, back]` pairs) and `quiz` (questions with the correct option first, `a: 0`; options are shuffled when shown). The English and Bulgarian files of a chapter must have the same number of cards and questions.

Markdown features:

- `[[znnd:25:9]]` – a citation of Art. 25(9) of the act with id `znnd`; add `|label` for a custom label. Article numbers with letters use Cyrillic letters (`28а`, `80б`).
- `{{нотариален акт}}` – a Bulgarian term in English text.
- `> [!law]`, `[!tip]`, `[!warn]`, `[!example]`, `[!note]`, `[!task]`, `[!reform]` – callouts; `> [!solution]` renders closed until the learner opens it.
- Tables, nested lists, and ` ```doc Title ` blocks for document text.

## Updating the laws

The acts and their article ranges are listed in `tools/laws.config.json`. To download them again from lex.bg:

```bash
python tools/import_laws.py
```

To update only some acts, pass their ids (for example `python tools/import_laws.py znnd gpk`). The option `--cache DIR` keeps the downloaded pages for later runs. The tariff of notarial fees is not available on lex.bg; it is transcribed by hand in `laws/manual/tarifa.json` and merged by the importer.

The texts in this copy were retrieved on **21 October 2026**. Since 1 January 2026, amounts in leva in legal acts count as euro at 1.95583, rounded to the cent (Art. 11–13 of the Act on the Introduction of the Euro). The chapters mark draft amendments of 2026 as "Pending reform"; check the State Gazette before you rely on them.

## Checking the content

After every change, run:

```bash
python tools/check_content.py
```

The script checks that every citation points to an existing act and article, that chapter links are valid, that the English and Bulgarian chapters match, that every quiz question is valid, that all JavaScript parses (Node.js is needed for this part), and that every cited article has an English translation (warning only).

## Important

This course is a learning aid. It is not legal advice and it does not replace the official texts. Always compare a provision with the text published in the State Gazette (Държавен вестник), and follow the instructions of the notary you work for. The English translations are unofficial working translations.
