# 01 welcome: audit

Sources checked: ЗННД Art. 2, 5, 8, 12, 25(5), 27, 28а, 34(2), 40, 41, 46, 49, 50; ГПК Art. 179, 569, 573, 576, 578, 579, 582; ЗВЕРБ Art. 11–13; `docs/design.md` (decisions of 2026-10-21); news on the draft law of August 2026 (see `00-method.md`).

## Lesson

| # | Finding | Source | Fix |
| --- | --- | --- | --- |
| 1 | "Your path": the home page no longer has a role filter. | Decision 2026-10-21, `docs/design.md` | Remove the bullet (EN, BG). |
| 2 | "Each chapter test gives feedback after each question" and "You certify a chapter": the test shows the answers only at the end; the app has "mark as read" and a best score, no certificate. | Decision 2026-10-21; `src/app/core/progress/progress.service.ts` | Rewrite the bullet. |
| 3 | "Templates, checklists and the fee calculator. Use them during practice, and later in the office": templates and checklists are for viewing and study. | `docs/design.md`, content rules | Rewrite the bullet. |
| 4 | "A person who does not know Bulgarian signs through an interpreter whom the notary appoints": Art. 582 ГПК requires an interpreter only when the notary does not know the language of that person. | ГПК Art. 582 | Add the condition (lesson and card, EN and BG). |
| 5 | "Every notarial document in Bulgaria is in Bulgarian": no provision cited. The language rule for the proceedings is Art. 4 ГПК (not in the extract); the lesson states it as a fact. | ГПК Art. 4 | Keep as a plain statement; no citation available in the library. Noted. |
| 6 | "The Minister of Justice appoints new notaries after a competition": exact rule: the Minister issues an order for entry in the register of the Chamber; the Council of Notaries enters the notary after the oath. | ЗННД Art. 12(3), 14(1), 15 | Make the sentence exact. |
| 7 | "keeps a copy for at least 100 years (Art. 28а(3))": the 100 years apply to the alphabetical index, the register of Art. 28а(1) item 3 and the books of items 4 and 5 (deeds, wills). Acceptable as a summary. | ЗННД Art. 28а(1), (3) | Keep. |
| 8 | The reform callout: the draft exists (published 2026-08-21). "A central register of wills at the Notary Chamber": the sources describe an entry of announced wills in the information system of the Chamber, not a separate register. | See `00-method.md` | Reword to "entry of announced wills in the information system of the Notary Chamber". |
| 9 | The table of roles and the working day are examples of practice; the text already says "a typical day". | — | Keep. |

Correct and verified: Art. 2 (state assigns; register; personal performance), 573(2) (deeds subject to entry only in the office in working hours), 576 (nullity), 179 (official document), 25(5) (entry on the same day), 27 (working hours set by the Minister), 46(1) (substitute: experience of Art. 8(1) item 3 and an exam), 49, 50, 34(2), 40(1), ЗВЕРБ 11–13.

## Bulgarian version

Says the same as the English. "Главата се удостоверява" is odd wording and follows the out-of-date bullet; rewritten with it. "Законодателство" is the name of the law library in the interface (`ui-text.bg.ts`), so the bullet keeps that name.

## Questions (10)

| # | Problem | Action |
| --- | --- | --- |
| 2 | The right option is twice as long as the others. | Shorten the right option, lengthen the wrong ones; keep the case. |
| 5 | The wrong options are not plausible ("At the bank of the buyer"). | Use the rule of Art. 573(3) as the tempting wrong option (other acts may be done outside the office). |
| 6 | The right option is 80 characters, the others 30. | Rewrite with four statements of equal form. |
| 9 | Tests a news item (the draft law), no provision. | Replace with a case on Art. 2(3)/Art. 40 (who may sign what). |
| 1, 3, 4, 7, 8, 10 | Acceptable. 8 is a calculation (good). | Improve explanations where they are one line. |

## Cards (10)

Mostly recall with a provision; the facts are right. Card 8 (interpreter) is incomplete (finding 4). Rework 3 cards into "what follows / when" form: the clerk card, the entry-day card, the language card.

## Fix status

Pass 2 (commit 976cca7): findings 1, 2, 3, 4 (lesson), 6 and 8 fixed; 5, 7 and 9 kept. Pass 3: see the questions and cards tables.

Pass 3 (commit 70a7410): questions and cards rewritten as planned above. Measure after: unique longest EN 1/10, BG 1/10; case-like questions EN 4, BG 2; 10 cards per language; every explanation names the provision.
