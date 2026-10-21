# Notary course

A bilingual (Bulgarian and English) study hub for work in a Bulgarian notary office: course chapters,
the law texts that the chapters cite, and study tools. It is an Angular 22 app without a server.
All content is static data in `public/data`. `docs/design.md` states the purpose (a learning tool,
not a tool for real case work), the content rules and the decisions so far.

| Section               | What it does                                                                              |
| --------------------- | ----------------------------------------------------------------------------------------- |
| Course                | 28 chapters in 7 parts. Every legal statement cites its provision.                        |
| Law library           | 34 acts from lex.bg, with an unofficial English translation of 561 articles               |
| Glossary              | 173 Bulgarian terms with the English term, a definition and the provisions                |
| Templates, checklists | Document templates on A4 pages, for study; checklists with ticks that the browser keeps   |
| Fee calculator        | Notarial fee, additional fee, VAT, entry fee and local tax, as a bill with its provisions |
| Tests and exam        | A test per chapter (pass mark 80%) and a final exam of 40 questions (pass mark 75%)       |
| Flashcards            | Leitner boxes per chapter and for the glossary                                            |
| Search                | Chapters, laws and glossary; a query such as "чл. 25 ЗННД" also opens the provision       |

Progress, ticks, cards and settings stay in the browser's local storage. There is no account and no
server.

## Run it

The project uses [bun](https://bun.sh) and Node 24 (pinned with Volta in `package.json`).

```bash
bun install
bun start              # dev server on http://localhost:4200
bun run build          # production build in dist/
bun run test           # unit tests (Vitest)
bun run lint           # ESLint, including template accessibility rules
bun run check:content  # checks citations, links and translations in public/data
```

## Structure

```
src/
  app/
    core/          Services and pure logic. No components. Never imports from shared/ or features/.
      content/     Manifest, chapter files, chapter sections, the course index (which chapters
                   cite an article)
      data/        PromiseCache: one request per file, shared by every caller
      fees/        The notarial tariff, the fee actions and the bill (pure functions)
      i18n/        Language, and every interface text in ui-text.en.ts and ui-text.bg.ts
      laws/        Law catalog and acts, citations, law text helpers, law panel state
      markdown/    Course Markdown to HTML (marked, plus citation, term, callout and doc blocks),
                   and to plain text for search
      progress/    Reading progress and test results, saved in localStorage
      reference/   Glossary, templates and checklists, and the layout of a template text
      search/      Full-text search: the index, the ranking and the snippets
      settings/    Reading settings, saved in localStorage, applied as attributes on <html>
      storage/     storedSignal(): a signal that is kept in localStorage; removal of retired keys
      study/       Leitner boxes for flashcards, and the tests and the exam
      text/        Small text helpers (folding for search, formats, HTML escaping, heading ids)
    shared/        Reusable components. Pages build on these instead of their own copies.
      layout/      PageLayout (the frame of every page), PageHeader, MissingPage
      course/      Chapter list by part, glossary list
      law/         Article text, citation pills (LawRefs), the click rule for citations
      ui/          Icon, notice, choice group, select field, search box, outline list,
                   Markdown content, load status, print button
      dom/         Element size (ResizeObserver), scroll to a fragment, sticky bar
    layout/        Parts of the app frame: side navigation, law panel, reading settings
    features/      Pages, one folder per route. Each page loads lazily.
  styles/          Global styles: tokens, reading settings, base, small components, prose
public/data/       Content: manifest, chapters (Markdown + JSON per language), laws, glossary
tools/             Content tools: law importer (Python) and content check (TypeScript)
```

Dependencies point one way: `features` and `layout` use `shared` and `core`; `shared` uses `core`.

## How the main parts work

- **Pages.** Every page sits in `PageLayout` (`main`: full or reading width; an optional
  side column at the start or the end) with a `PageHeader`. So all pages share one frame, one left
  edge and one heading style. The side sections of the app are listed once in `app-sections.ts`.
- **Content.** `ContentService` loads `manifest.json`. A chapter page loads its Markdown and its
  JSON (objectives, cards, quiz) for the current language with `httpResource`.
- **Citations.** The chapter Markdown cites provisions as `[[znnd:25:9]]` (act, article,
  paragraph). The renderer turns them into links. A click opens the provision in the law panel;
  Ctrl or middle click opens the law library page.
- **Law panel.** `LawPanelService` holds the shown provision, its history and the panel width.
  The panel shows the article with the cited paragraph marked, the heading path, the neighbouring
  articles, the other articles of the section, the chapter sections that cite the article, and the
  glossary terms. Drag its left edge, or focus the edge and use the arrow keys, to resize it. On a
  phone the panel fills the screen and has no edge to drag.
- **Gestures.** On a small screen, a swipe to the right from the left edge opens the navigation, a
  swipe to the left closes it, and a swipe to the right on the law panel closes the panel
  (`shared/dom/swipe.ts`, handled in `app.ts`). Vertical scrolling stays with the browser.
- **Templates.** A template is plain text, as it is typed. `core/reference/document-layout.ts` finds its title, register line, headings, signatures and the
  certifications of the notary (one stamp after each `---`). `sheet-line.ts` sizes each blank by
  what goes in it (`blank-size.ts`), and `sheet-flow.ts` gives the rules for page breaks.
  `DocumentSheet` lays the text out in a hidden A4 page at the real size, measures it, and
  `sheet-pages.ts` breaks it into pages; the screen and the print show the same pages. A notarial
  deed also gets the fee box, the entry box and the frame of the official form (Appendix 7 to
  Ordinance No. 32), from `forms` in `templates.json`. The standards and the decisions are in
  `docs/research/templates`.
- **Study tools.** Flashcards use Leitner boxes (`core/study/leitner.ts`): a known card moves one
  box up and comes back after 1, 3, 7, 14 or 30 days; a missed card goes back to box 1. Tests and
  the exam draw from the chapter questions (`core/study/quiz.ts`); `ProgressService` keeps the
  scores.
- **Fee calculator.** `core/fees` converts the material interest into leva, applies the tariff and
  converts the result back into euro. The page describes its fields as data (`fee-form.ts`), and
  the tax rate field gets its legal limits from the Signal Forms schema.
- **Search.** `SearchService` loads all chapter texts of the language, all acts with their
  translations, and the glossary on the first search, and keeps them in memory. A result needs
  every word of the query in some form: `core/search/word-forms.ts` gives the forms of a word one
  stem (a light stemmer for Bulgarian after J. Savoy, and one for English), so "нотариален" also
  finds "нотариалния". The word as typed ranks above another form of it, and that above its letters
  inside a longer word; a number counts only as a whole word. The whole query, and the whole query
  in a title, rank higher. The glossary filter and the filter of an act use the same matching
  (`filterItems`). Chapter results link to the section, with the same fragment ids as the rendered
  chapter.
- **Texts and languages.** Every interface text is in `core/i18n`. A missing translation is a
  compile error. `LanguageService.current` decides the language of the interface and the content.
- **Reading settings.** `ReadingSettingsService` writes data attributes on `<html>`;
  `src/styles/_reading.scss` turns them into CSS values. The settings form uses Signal Forms.
- **Styles.** Components use only the custom properties of `src/styles/_tokens.scss`. The rendered
  Markdown is outside Angular's style encapsulation, so its styles are global (`_prose.scss`).

## Fonts

Golos Text (interface and headings) and Literata (chapters and law texts) are self-hosted through
Fontsource. Both keep the standard Cyrillic letter forms when the page language is Bulgarian.

## Law data

`tools/import_laws.py` downloads the acts from lex.bg and writes `public/data/laws`. The texts are
unofficial consolidated versions. Check the State Gazette (Държавен вестник) before you rely on one.

lex.bg marks chapters and sections in most acts. In some older acts (ЗЗД, ЗЛС, ЗН) every heading has
the same mark, so the importer finds the outline from the numbering: "ОБЩА ЧАСТ", "I.", "1.", "А)".
The rules and examples are in `outline_levels`; run `python -m doctest tools/import_laws.py` after a change.
