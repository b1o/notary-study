# Design

What this app is for, the rules for its content and its interface, and the decisions that shape it.
`README.md` describes how the code works; `CLAUDE.md` holds the coding rules. Read this file before
you change content or design.

## Purpose

- A personal information hub and learning tool for work in a Bulgarian notary office. A reader uses
  it to learn the work and to look things up: the course, the law texts, the glossary, examples of
  documents and processes, and study tools.
- It is not a tool for real case work. It holds no client data and no case files, and it has no
  accounts. Nothing in it is a form to fill in for a client or a record of a real file.
- Plain wording. No marketing, no "your path", no certificates or badges.

## Content rules

- **Sources.** Every legal statement cites its provision (`[[act:article:paragraph]]`). Check a
  fact against the imported primary text in `public/data/laws` before you write it.
- **Examples of a process.** A checklist, a workflow or a list of steps is an example of a typical
  flow, unless a source states the whole process. The page says so. An item with a cited provision
  is a requirement of the law. An item without one is marked "No source": it can be common practice
  or a rule that is not cited yet, and offices differ.
- **Templates.** A template shows what a real document looks like and what it contains. It is for
  viewing and study, not a form to use. It follows the standards for the real document (form,
  paper size, layout) as far as the sources state them.
- **Tests and flashcards** check understanding, not recognition. A wrong option is a mistake that a
  learner could really make; the right option does not stand out by its length or its wording.
- **Law texts** are unofficial consolidated texts from lex.bg. The English translation is
  unofficial and exists for some articles only (all the articles that the course cites).
- **Languages.** Every interface text exists in Bulgarian and English. English text keeps
  Bulgarian legal terms and act abbreviations on purpose (ЗННД, нотариален акт); mark Bulgarian
  parts with `lang="bg"`.

## Interface rules

- Styles use the tokens of `src/styles/_tokens.scss`, in both themes. In the dark theme an active or
  selected element gets lighter, so it stands out; bold text looks bold.
- No coloured side borders as decoration.
- Reuse `shared/` and `src/styles/_components.scss`. Different alignment between pages shows
  duplicated code.
- Check a change at 375 to 3440 px, with the largest text and the wide measure, in both themes.
- WCAG 2.2 AA; axe passes on every page.

## Decisions

| Date       | Decision                                                                                                          |
| ---------- | ----------------------------------------------------------------------------------------------------------------- |
| 2026-10-21 | No role filter: every reader sees all chapters.                                                                   |
| 2026-10-21 | Law text in Bulgarian or English, not both at once. It follows the interface language until the reader picks one. |
| 2026-10-21 | Tests and the exam show right and wrong only at the end, with a review of all answers.                            |
| 2026-10-21 | Checklists have no ticks to save. They are examples of a typical flow and say so.                                 |
| 2026-10-21 | Templates are for viewing and study: no print or copy button. They follow the standards of the real document.     |
| 2026-10-21 | Templates are A4 pages at the real size, after the standards in `docs/research/templates`.                        |
| 2026-10-21 | A template page shrinks to fit the column, never below its real size; then its text flows.                        |
| 2026-10-21 | The paper of a template follows the theme; print is always black on white.                                        |

## Open questions

- English text writes amounts in leva as "лв." in about 70 places and as "leva" in a few. Keep
  "лв.", or use "BGN" or "leva"?
