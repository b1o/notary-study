# 06 office: audit

Sources checked: ЗННД Art. 13, 22, 25(5), 27, 28а, 28б, 50, 89; Наредба № 32 Art. 1а, 2, 2б, 2в, 4–21, 25–28; ГПК Art. 573; the ordinances on register access Art. 2; namrb.org (position of the Council of Notaries of 2024-01-08 on municipal powers of attorney for vehicles).

## Lesson

| # | Finding | Source | Fix |
| --- | --- | --- | --- |
| 1 | The table of the information system lists "electronic administrative services" (Art. 9а item 11) among the data to enter at once. Item 11 enters into force on 3 September 2027. | Наредба № 32 Art. 9а item 11 (ДВ, бр. 80 от 2026 г.) | Mark the row "from 3 September 2027". |
| 2 | "Registers start each calendar year", the day closure, corrections, printed registers, one general register: all match Art. 5 and 7(3). | Наредба № 32 | Keep. |
| 3 | Seven registers and books, retention 10/100 years: match Art. 28а(1)–(3) ЗННД and Art. 4 Наредба № 32. Row 4 "and marriage contracts": Art. 28а(1) item 4 ЗННД. | ЗННД, Наредба № 32 | Keep. |
| 4 | Volumes of 200 documents, numbering per year, Art. 6(2) on refused entries, lacing: match Art. 6. | Наредба № 32 Art. 6 | Keep. |
| 5 | Case files: opened for deeds, wills and deposits, circumstantial verifications (Art. 10(1)); contents (11(1), (4), (5)); cover (10(3)); numbering (10(4)); retention 5/100 years (10(5)). Gap: Art. 10(2) (no new file for a deed after a circumstantial verification, for a ЖСК member, for a revocation of a will made by the same notary). | Наредба № 32 Art. 10, 11 | Add Art. 10(2) in one sentence. |
| 6 | Seal: 40 mm, content, three seals, loss and damage: match Art. 14 and 16. | Наредба № 32 | Keep. |
| 7 | Paper and format: match Art. 18–20. Entry: four copies, two requests: Art. 21(1); wills: Art. 21(2)–(3). | Наредба № 32 | Keep. |
| 8 | "Notaries call it Единство": confirmed by the NAMRB publication (ИС „Единство“). | namrb.org | Keep. |
| 9 | Access to the information system: state bodies free (2б), banks and the listed entities paid (2в). | Наредба № 32 | Keep. |
| 10 | "Who does what" table and the closing checklist are practice. The lesson does not say so. | `docs/design.md` | Add one sentence: "a typical division; offices differ". |

## Bulgarian version

Natural and equal to the English.

## Questions (12)

| # | Problem | Action |
| --- | --- | --- |
| 1 | Good calculation case. | Keep; explanation with the arithmetic. |
| 2 | The right option is the longest; "correction fluid" is a real office mistake (good). | Shorten the right option. |
| 9 | The right option is the longest; the wrong options are not items of Art. 9а. | Use near misses: a power of attorney with a certified signature only (for a bank → yes, item 5; for a school → no). |
| 10 | The right option is the longest. | Equalise. |
| 12 | The right option is 80 characters. | Rewrite as four short statements. |
| 3, 4, 5, 6, 7, 8, 11 | Acceptable. | Improve the explanations (5 and 8 are one line). |

Add a case on Art. 10(5) (which file may be destroyed after five years) and on Art. 21(2) (a will revoked at another notary).

## Cards (16)

Facts verified. Rework 4 cards into consequence form (the two-hour rule as a case, a register kept on a computer, a lost seal, a refused entry).

## Fix status

Pass 2 (commit a129829): findings 1, 5 and 10 fixed; the others kept.

Pass 3 (commit 70a7410): questions and cards rewritten as planned above. Measure after: unique longest EN 0/12, BG 2/12; case-like questions EN 4, BG 3; 16 cards per language; every explanation names the provision.
