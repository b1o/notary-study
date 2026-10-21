# Decisions for the template sheets

What the templates do after this research, and why. The sources are in `standards.md`. Where the
notarial acts are silent, the sheets follow the closest written Bulgarian source, the instruction
of the Institute of Public Administration (ИПА, 2014), and the note says so.

## The page

| Decision                                                                                                                                  | Reason                                                                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Every document is on A4 pages, 210 × 297 mm.                                                                                              | Ordinance No. 32 Art. 18(1) and ПВ Art. 35(1) require A4; ISO 216 sets the size.                                                                                                                                                                          |
| Margins: top 20 mm, bottom 10 mm, binding edge 30 mm, other edge 20 mm.                                                                   | Ordinance No. 32 Art. 18(2) asks for margins wide enough to bind and gives no value. ИПА 2014 gives 30/20/20/10 mm, and 30 mm is the binding margin in the other administration source (НВУ, after БДС 6.04.1-85).                                        |
| The margins are mirrored: on an even page the 30 mm margin is on the right.                                                               | Ordinance No. 32 Art. 19(1): the drafts of all documents are on both sides of the sheet. An even page is the back of the sheet, so the binding edge is on its right.                                                                                      |
| Pages 2 and later show a page number at the bottom, in the centre.                                                                        | Ordinance No. 32 Art. 18(2) (deeds) and Art. 20(1) (certified documents of more than one sheet) require the numbers; ИПА 2014 puts them in the footer from page 2. The place is common practice.                                                          |
| A notarial deed has a frame around the text on each page, and the fee box and the entry box above the title on page 1.                    | Ordinance No. 32 Art. 18(2) (frame), Art. 19(3) and Appendix 7 (boxes, fee on the left, entry on the right).                                                                                                                                              |
| No ruled lines in the frame.                                                                                                              | Art. 18(2) puts the text "на хоризонталните редове". The dotted rows of Appendix 7 are the lines of the old printed form for a typewriter or a pen. A printed deed has its text lines in the frame and no rules.                                          |
| In a deed, the empty rest of the frame on the last page is struck out with one diagonal line.                                             | ГПК Art. 578(3) and ПВ Art. 35(1): blank places are struck out, so that nobody can add text.                                                                                                                                                              |
| The protocol on a deposited holographic will is on an envelope, C5 (229 × 162 mm, landscape), with 15 mm margins and single line spacing. | Закон за наследството Art. 25(2): the protocol is on the envelope itself. No source sets the envelope; C5 (ISO 269) holds an A4 sheet folded once. The size, the margins and the spacing are our choice; with 1.5 lines the protocol needs two envelopes. |

## The type

| Decision                                                                                                       | Reason                                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tinos, 12 pt, for the whole document. Self-hosted (`@fontsource/tinos`).                                       | Offices type in Times New Roman, and ИПА 2014 names it. Tinos has the same character widths, so the lines and the page breaks are the same as in a document typed in Times New Roman. Times New Roman is not on every device. One font for the whole document (ИПА, МДААР). |
| Line spacing "1.5 lines": 1.725 × the font size.                                                               | ИПА 2014 gives 1.5 lines. A word processor sets one line of Times New Roman at 1.15 × the font size, so 1.5 lines are 1.725 × 12 pt. Offices also use single spacing.                                                                                                       |
| First-line indent 1.25 cm; the text is justified.                                                              | ИПА 2014 and МДААР.                                                                                                                                                                                                                                                         |
| Title: 14 pt, bold, capitals, spaced, centred. Headings such as "УПЪЛНОМОЩАВАМ": 12 pt, bold, spaced, centred. | Appendix 7 centres the title. Bold and the size are common practice; ИПА asks for bold headings.                                                                                                                                                                            |
| A blank line in the template text is one empty line on the page.                                               | The text is plain text, as typed.                                                                                                                                                                                                                                           |

## Signatures, seal and stamps

| Decision                                                                                                                                                                                             | Reason                                                                                                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The seal is a ring of 40 mm with the text of Art. 14(1): "НОТАРИУС № […]" in the upper half, "РЕПУБЛИКА БЪЛГАРИЯ" in the lower half, the name, "Район на действие" and "Р. С. […]" in the centre.    | Ordinance No. 32 Art. 14(1). The page keeps room for the seal (Art. 19(1)).                                                                                                                                                             |
| A signature line is 40 mm. A line for the full name written by hand is 70 mm, with its caption under it.                                                                                             | ГПК Art. 579(1) and 589(2): the signers write their full names by hand. The widths are common practice.                                                                                                                                 |
| The certifications use the wording of the stamps in Appendix 6, one stamp for each certification. A certification of signatures and content at the same time has two stamps, signatures and content. | Ordinance No. 32 Art. 17 and Appendix 6. ГПК Art. 590(2) and (4) record the two certifications in two places, so each has its own number. ГПК Art. 580 applies through Art. 590(1), so the stamp also has the ЕГН. Amounts are in euro. |
| A stamp is 100 mm wide, in 10 pt.                                                                                                                                                                    | No source sets the size. The lines of Appendix 6 hold about 70 characters, and 70 characters of 10 pt Tinos are about 100 mm.                                                                                                           |
| The seal of a certification stands beside its stamp, not in it.                                                                                                                                      | The notary stamps the seal over the signature, partly over the stamp. A seal of 40 mm inside the stamp makes the stamp twice as tall; beside it, the seal uses the free 50 mm of the text width, and the stamp text stays readable.     |
| The invitation has the two stamps of Appendix 6: presentation and delivery.                                                                                                                          | Ordinance No. 32 Appendix 6, ГПК Art. 592(1).                                                                                                                                                                                           |

## Page breaks

A page breaks only where a document can break. The rules are pure functions in
`src/app/core/reference/sheet-pages.ts`, with tests.

- Never inside a line, a signature block, a stamp, or the boxes.
- At least two lines of a paragraph at the bottom of a page and at least two at the top of the next
  page (orphans and widows, the usual rule of typesetting).
- A heading, a title and a line that ends with ":" stay with the next text.
- The last lines of the text, the signatures, the certifications and the seal stay on one page.
  Ordinance No. 32 Art. 19(1) asks for room for all of them on the page where the text ends. The
  sheet moves them to the next page instead of an allonge (Art. 19(2)).
- The same breaks on screen and in print: the page measures the text once at the real size of A4
  and prints the same pages (`@page` with the size of the paper and no margin).

The rule for the end has a visible cost: when the last lines, the signatures and the stamps do not
fit, they go to the next page together and leave room at the bottom of the page before (for
example the power of attorney for a sale, and the contract for a car). A real drafter does the
same, or adds an allonge.

Not shown: the binding and the joins of the sheets with the seal (Ordinance No. 32 Art. 20), the
number of copies, the allonge.

## Blank sizes

A blank holds what goes in it, typed in the font of the page. The size is in characters (CSS `ch`).
The rules are in `src/app/core/reference/blank-size.ts`, with tests. A blank with a hint shows the
hint and a dotted line for the rest of the size. A blank with choices ("[майка/баща]") shows the
choices and no extra line.

| What goes in it                                        | Example                                                                   | Characters   |
| ------------------------------------------------------ | ------------------------------------------------------------------------- | ------------ |
| Three names                                            | Александър Константинов Константинов                                      | 36           |
| Name of the notary (first and family name, Art. 18(3)) | Мария Петрова-Иванова                                                     | 26           |
| Full name written by hand                              | —                                                                         | 33 (≈ 70 mm) |
| ЕГН                                                    | 8001011234                                                                | 10           |
| ЕИК (13 for a branch)                                  | 1234567890001                                                             | 13           |
| Number of an identity card or a passport               | 645123456                                                                 | 9            |
| Date                                                   | 21.10.2026                                                                | 10           |
| Date in words and figures                              | двадесет и първи октомври две хиляди двадесет и шеста година (21.10.2026) | 75           |
| Year                                                   | 2026                                                                      | 4            |
| Hour                                                   | 14:30                                                                     | 5            |
| Town                                                   | Велико Търново                                                            | 16           |
| Address                                                | гр. София, ж.к. Младост 1, бл. 12, вх. А, ет. 5, ап. 18                   | 56           |
| Street                                                 | бул. Александър Стамболийски                                              | 28           |
| House, floor, flat, entrance                           | 125                                                                       | 4            |
| Register, volume, case or act number                   | 12345                                                                     | 6            |
| Registration number (also of a car)                    | СА 1234 ВН                                                                | 10           |
| Cadastral identifier                                   | 68134.4082.1069.1.12                                                      | 22           |
| Amount in figures                                      | 1 250 000,00                                                              | 14           |
| Amount in words                                        | един милион двеста и петдесет хиляди евро                                 | 50           |
| Area                                                   | 1 234,56                                                                  | 9            |
| Percentage                                             | 12,345                                                                    | 7            |
| Fraction                                               | 1/2                                                                       | 6            |
| IBAN (22 characters in groups of four)                 | BG80 BNBG 9661 1020 3456 78                                               | 27           |
| Bank, company                                          | Обединена българска банка                                                 | 26           |
| VIN                                                    | WVWZZZ1JZXW000001                                                         | 17           |
| Engine number                                          | 14 characters                                                             | 14           |
| Make, model, colour, country                           | Фолксваген                                                                | 16           |
| Description of a property                              | two lines                                                                 | 160          |
| A document                                             | нотариален акт № 12, том III, рег. № 3456, дело № 345 от 2019 г.          | 60           |
| Any other blank                                        | —                                                                         | 14           |

## Screens and themes

| Decision                                                                                                                                                                                                    | Reason                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| On a wide screen the sheet shows whole A4 pages. The text has the size of the reader's text setting (12 pt is 16 CSS px at "small"), and the page shrinks to fit the column, but never below its real size. | The page keeps its proportions and its breaks. The text never gets smaller than 12 pt, so it stays readable and grows with the reader's setting and with the browser zoom (WCAG 1.4.4). |
| When a real-size A4 page does not fit (a phone, a tablet, a narrow window), the text reflows in the width of the screen. The page breaks stay those of the A4 page.                                         | A scaled A4 page on a 375 px phone has text of about 7 px: unreadable, and against WCAG 1.4.10 (reflow). The breaks of the real page are the part worth seeing.                         |
| The paper follows the theme: dark paper in the dark theme. Print is always white paper with black text.                                                                                                     | The template teaches the layout, not the colour of paper. A white A4 page is a large bright area in a dark screen, against the reader's choice of theme.                                |
| No Print button and no Copy button. Ctrl+P prints the A4 pages.                                                                                                                                             | The templates are for viewing and study (`docs/design.md`).                                                                                                                             |
