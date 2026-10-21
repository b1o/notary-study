# Notary course

A bilingual (Bulgarian and English) study hub for work in a Bulgarian notary office: course chapters,
the law texts that the chapters cite, and study tools. It is an Angular 22 app without a server.
All content is static data in `public/data`.

The old version of the app (plain JavaScript) is in `legacy/`. It stays there until the Angular
version has all its features: tests, flashcards, exam, glossary, templates, checklists, fee
calculator and search.

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
      content/     Manifest, chapter files, and the course index (which chapters cite an article)
      i18n/        Language, and every interface text in ui-text.en.ts and ui-text.bg.ts
      laws/        Law catalog and acts, citations, law text helpers, law panel state
      markdown/    Course Markdown to HTML (marked, plus citation, term, callout and doc blocks)
      progress/    Reading progress, saved in localStorage
      settings/    Reading settings, saved in localStorage, applied as attributes on <html>
      storage/     storedSignal(): a signal that is kept in localStorage
      text/        Small text helpers (HTML escaping, heading ids)
    shared/        Reusable components and DOM helpers: icon, choice group, Markdown content,
                   article text, load status
    layout/        Parts of the app frame: side navigation, law panel, reading settings
    features/      Pages, one folder per route. Each page loads lazily.
  styles/          Global styles: tokens, reading settings, base, small components, prose
public/data/       Content: manifest, chapters (Markdown + JSON per language), laws, glossary
tools/             Content tools: law importer (Python) and content check (TypeScript)
```

Dependencies point one way: `features` and `layout` use `shared` and `core`; `shared` uses `core`.

## How the main parts work

- **Content.** `ContentService` loads `manifest.json`. A chapter page loads its Markdown and its
  JSON (objectives, cards, quiz) for the current language with `httpResource`.
- **Citations.** The chapter Markdown cites provisions as `[[znnd:25:9]]` (act, article,
  paragraph). The renderer turns them into links. A click opens the provision in the law panel;
  Ctrl or middle click opens the law library page.
- **Law panel.** `LawPanelService` holds the shown provision, its history and the panel width.
  The panel shows the article with the cited paragraph marked, the heading path, the neighbouring
  articles, the other articles of the section, the chapter sections that cite the article, and the
  glossary terms. Drag its left edge, or focus the edge and use the arrow keys, to resize it.
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
