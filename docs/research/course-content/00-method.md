# Course content review: method and measures

Date of the review: October 2026. Branch `claude/course-review-60eafa`, from `polish-pass` at commit 4a3bf1f.

## What the review covers

- 28 chapters in `public/data/chapters/{bg,en}`: the lesson (`.md`) and the objectives, cards and quiz (`.json`).
- 324 questions and 359 cards per language at the start; 336 questions and 364 cards after pass 3. The glossary (`public/data/glossary.json`) only where a chapter depends on it.
- Not covered: `templates.json` (another session works there). `checklists.json` only for the 36 items without a citation, on a later request of the polish-pass session (see `checklists.md`, commit b638f7e).

## Sources, in this order

1. The imported acts in `public/data/laws/acts` (unofficial consolidated texts from lex.bg, retrieved 2026-10-21). A statement in a lesson is checked against the cited paragraph. The helper script prints a cited paragraph with its English translation.
2. For facts that the imported acts do not state: official sites (lex.bg, dv.parliament.bg, notary-chamber.bg, registryagency.bg, justice.government.bg, constcourt.bg) and, for context, law firm notes. Each note names the source next to the fact.
3. Amounts: Bulgaria uses the euro since 2026-01-01. Lev amounts in the acts apply through ЗВЕРБ (Art. 11–13): divide by 1.95583 and round to the cent.

## Passes

1. Audit: one note per chapter (`NN-id.md`) with the errors, the gaps, the weak questions and the weak cards. Each finding names its source.
2. Lesson fixes, both languages. Each fix is listed in the chapter note under "Fix status".
3. Questions and cards, both languages. Counts stay equal between the languages.
4. Final check: `bun run check:content`, the measures below, and a re-read of a sample of each chapter.

## Measures of the tests (script `tools/check-content.ts` after pass 3; before that a scratch script)

- **Unique longest**: the right option is strictly longer than every wrong option. Chance level with 4 options: 25 %.
- **Mean length ratio**: length of the right option divided by the mean length of the wrong options. A fair question is near 1.0.
- **Giveaway**: a word of 5 letters or more from the question appears in the right option and in no wrong option.
- **Case-like**: the question text is a situation (longer than 90 characters).
- **Short explanation**: fewer than 80 characters; such an explanation seldom says why the wrong options are wrong.
- **Recall-style card**: the front starts with "What is", "Which", "Who", "How many", "Where" (BG: "Какво е", "Кои", "Кой", "Колко", "Къде").

### Baseline (commit 4a3bf1f)

| Measure | EN | BG |
| --- | --- | --- |
| Questions | 324 | 324 |
| Unique longest | 230 (71 %) | 219 (68 %) |
| Longest or tie | 240 (74 %) | 231 (71 %) |
| Mean length ratio | 2.21 | 2.16 |
| Giveaway word | 73 | 49 |
| Case-like | 114 | 110 |
| Short explanation | 216 | 224 |
| Cards | 359 | 359 |
| Recall-style cards | 116 (32 %) | 86 (24 %) |

Per chapter the share of "unique longest" ranges from 40 % (19-vehicles) to 100 % (23-aml).

### After pass 3 (commits 70a7410, 189f0ad, 5857c51)

| Measure | EN | BG |
| --- | --- | --- |
| Questions | 336 | 336 |
| Unique longest | 39 (12 %) | 38 (11 %) |
| Longest or tie | 77 (23 %) | 70 (21 %) |
| Mean length ratio | 0.99 | 1.00 |
| Giveaway word | 56 | 47 |
| Case-like | 144 | 142 |
| Short explanation | 0 | 0 |
| Cards | 364 | 364 |
| Recall-style cards | 121 (33 %) | 71 (20 %) |

Per chapter the share of "unique longest" is at most 33 % (14-deeds BG, 4 of 12; 28-cases EN, 4 of 14); 11 chapters in English and 12 in Bulgarian have none. `bun run check:content` now fails a chapter above a third. The "giveaway" count stays near the baseline because the measure counts any shared word of five letters, and a case question names the act (a power, a will, a mortgage) that the right option names too; a read of the flagged questions found no option that the question text alone identifies. The "recall-style" count follows the card fronts that start with "What is" or "Who", which the rewritten cards keep when the fact is a definition or a competence.

## Rules for a rewritten question

- Every wrong option is a mistake that a learner can make: a rule from a neighbouring case, a wrong number from the same act, the old rule, a common office habit.
- The options have the same form and a similar length (ratio under 1.5 as a target; unique longest under a third per chapter).
- No word of the question appears only in the right option.
- The explanation says why the right option is right and why the most tempting wrong option is wrong, with the provision.
- At least a third of the questions of a chapter apply a rule to a case.

## Rules for a rewritten card

- One fact per card. The front asks for a consequence, a condition or a reason ("What follows if…", "When may…", "Why…").
- The back is short and exact, with the provision in the course format (Art. 25(5) ЗННД / чл. 25, ал. 5 ЗННД).

## Cross-cutting findings

- **Court names in English.** The course calls районен съд "district court" and окръжен съд "regional court" (glossary, the chapters, the English law translations: about 70 places). The official English names of the Bulgarian courts are the opposite: районен съд = Regional Court, окръжен съд = District Court (the courts' own sites, for example "Sofia Regional Court" for Софийски районен съд). The course is consistent with itself, so the review does not flip the terms. Open question for the user: flip them in one commit (glossary, chapters, `laws/en`, `ui-text`)?
- **The app changed after the lessons were written.** Chapter 1 still describes the role filter, feedback after each question and checklists with ticks. The decisions of 2026-10-21 in `docs/design.md` removed these. Fixed in pass 2.
- **Commerce Act checks dated 2027.** Art. 16(2) and Art. 129(2) ТЗ in the imported text contain the electronic check of the National Revenue Agency by the registration officer, "в сила от 02.04.2027 г." (ДВ, бр. 69 от 2026 г.). Chapters 12, 21 and 28 state the check as if it applied now. Fixed in pass 2: "from 2 April 2027".
- **Ethics code.** Art. 34(1) ЗННД ties professional ethics to the statute of the Chamber. Two web searches (21 October 2026) found no official text of a separate ethics code. Chapter 27 names only the statute. Open question for a person: does the Chamber publish ethical rules apart from the statute?
- **ЗМИП Art. 73(1).** The full text confirms "до 5 работни дни" from the day after the order (chapter 23).
- **The draft law against property fraud (August 2026).** The Ministry of Justice published the package for public consultation on 21 August 2026 (consultation 12641-К on strategy.bg; news: news.bg, banker.bg 2026-08-21; an opinion with the proposed texts: challengingthelaw.com, "Становище по Законопроект за изменение и допълнение на Закона за наследството от м.08.2026 г."). Content as the sources state it: changes to ЗН, ГПК, СК and ЗЗД; a notice of an announced holographic will on the site of the Notary Chamber and a one-month period for objections (new Art. 27а, 27б ЗН); entry of announced wills in the information system of the Chamber (Art. 25 ЗН); nullity of wills and gifts in favour of staff of care homes and hospitals; acceptance of an inheritance in writing with a certified signature; new requirements for declaratory deeds; stricter rules for powers of attorney for real estate and for prescription. The sources do not describe a separate "central register of wills"; the course text says "register", which is close to the proposed entry in the information system. No source reports that the bill reached Parliament. The lessons keep the callouts as "a draft, not law".
