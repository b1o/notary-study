# 03 legal-system: audit

Sources checked: Конституция Art. 5, 22; ЗНА Art. 3, 4, 6, 7, 8, 12, 14, 15; ЗМДТ Art. 1(2); ЗСВ Art. 279, 280; ГПК Art. 60, 62, 179, 180, 577, 586; ЗННД Art. 3, 4(3), 12(4), 16, 52, 80, 80б, § 1; ЗЛС Art. 1–5; ЗЗД Art. 18, 19, 26, 27, 30, 32, 34, 35, 44; ЗС Art. 110.

## Lesson

| # | Finding | Source | Fix |
| --- | --- | --- | --- |
| 1 | "Interpretative decisions bind the courts and the administration": true (Art. 130(2) ЗСВ: binding on the judiciary, the executive, local government and all bodies that issue administrative acts), but Art. 130 is not in the ЗСВ extract, so the sentence has no citation. | ЗСВ Art. 130(2) | Keep the sentence; add Art. 130 to the extract if the importer allows it (see pass 2). |
| 2 | "Can it be confirmed? Voidable: yes, by a written act or by voluntary performance": a contract voidable for extreme need cannot be confirmed. | ЗЗД Art. 35(3) | Add "except for extreme need". |
| 3 | "Three years for most grounds": right; the term for extreme need is one year (Art. 33(2) ЗЗД, not cited). The start of the three years differs per ground (Art. 32(2)). | ЗЗД Art. 32, 33 | Add the start of the term in half a sentence. |
| 4 | "Administrative courts hear appeals against orders of the Minister about entries and transfers of notaries": Art. 12(4) names the Administrative Court Sofia Region for the competition order; Art. 34б(5) the competent administrative court for a transfer. | ЗННД Art. 12(4), 34б(5) | Keep; add 34б(5) as a second citation. |
| 5 | "the Registry Agency is under the Ministry": ЗТРРЮЛНЦ and ЗКИР say "Агенцията по вписванията към министъра на правосъдието". No citation in the lesson. | ЗТРРЮЛНЦ, ЗКИР | Add a citation (ЗКИР Art. 3 or wherever the phrase sits; check in pass 2). |
| 6 | Capacity: "limited disability is like the position of a minor of 14 to 18": Art. 5(3) ЗЛС applies Art. 4(2). Correct. | ЗЛС Art. 5 | Keep. |
| 7 | "Deadline for filing at the court": Art. 62(1) ГПК. The question's distractor "until midnight" is the rule for a filing by post or electronically (Art. 62(2)). The explanation must say so. | ГПК Art. 62 | Explanation of question 12. |

Everything else matches the cited text: the hierarchy of sources, entry into force three days after promulgation, the courts and bodies, the citation format, the forms of transactions, void and voidable, official and private documents, Art. 60(1) ГПК, Art. 16(2) ЗННД.

## Bulgarian version

Natural and equal to the English. "Законодателство" is the interface name of the library.

## Questions (12)

| # | Problem | Action |
| --- | --- | --- |
| 3 | The right option is 60 characters, the others 25. | Four readings of equal form (article/paragraph/item vs chapter/section/point…). |
| 6 | The right option is the longest; "The child with the consent of the parents" is a good distractor (the rule for 14–18). | Equalise the lengths. |
| 10 | Definition question; the right option is the longest. | Replace with a case: a lease vs a right of use (which one binds a later buyer). |
| 7 | Good case. | Keep; explain why "valid between the parties" is wrong (Art. 26(1), form). |
| 12 | Good case. | Explanation: the post rule. |
| others | Acceptable. | Improve the explanations (1, 2, 8 are one line). |

## Cards (14)

Definitional. Card 7 "Legal capacity vs capacity to act?" is not a question. Rework into "A 17-year-old wants to sell a bicycle: who signs?" style where possible; keep 14 cards.

## Fix status

Pass 2 (commit 976cca7): findings 2, 3 and 4 fixed. Finding 1 stays open: Art. 130 ЗСВ is not in the extract, and a re-import needs the network (add "130" to the `include` list of `zsv` in `tools/laws.config.json` and run `python tools/import_laws.py zsv`). Finding 5 kept without a citation: the phrase "към министъра на правосъдието" was not located in the imported extracts. Finding 6 kept; 7 for pass 3.
