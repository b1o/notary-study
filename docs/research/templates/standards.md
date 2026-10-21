# Standards for the document templates

Research for the templates (`/templates`): which rules set the form, the paper and the layout of
the documents that the templates show. Retrieved on 2026-10-21. Each entry says what the source
settles. "Primary" is a legal act. "Written practice" is an official instruction that does not bind
notaries. "Common practice" has no written source that we found; offices differ.

## Primary sources (legal acts)

The acts are in `public/data/laws/acts` (lex.bg, unofficial consolidated texts).

### Наредба № 32 за служебните архиви на нотариусите (`n32.json`)

| Provision           | What it settles                                                                                                                                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Art. 14(1)          | The seal of the notary is round, 40 mm in diameter. Centre: the first name and family name of the notary, "Район на действие", "Р. С." and the seat of the district court. Upper half of the ring: "Нотариус" and the register number. Lower half: "Република България". |
| Art. 14(3)          | A notary can have one rubber seal, one metal seal and one dry (embossed) seal.                                                                                                                                                                                           |
| Art. 17, Appendix 6 | The certifications on a document can be stamps (щемпели) with the wording of Appendix 6: signatures, date, content, a copy, the presentation and the delivery of a notarial invitation, a protest. The appendix gives no size for a stamp.                               |
| Art. 18(1)          | A draft notarial deed is on rectangular sheets of white A4 paper, 80 g/m² or more. A deed for entry follows Appendix 7, in at least five copies.                                                                                                                         |
| Art. 18(2)          | The blank margins must be wide enough to bind the deed. The second and each later page are numbered. The text is on horizontal lines in a frame on each page.                                                                                                            |
| Art. 18(3), (4)     | The notary is written with first name and family name as in the register of the Notary Chamber, then the district, the register number and the place of the office.                                                                                                      |
| Art. 19(1)          | The drafts of all documents are on both sides of the sheet. The page where the text ends must have room for the signatures of the parties, the certifications, and the signature and the seal of the notary.                                                             |
| Art. 19(2)          | When there is no room, an allonge is glued on, with the signature and the seal of the notary in at least two places.                                                                                                                                                     |
| Art. 19(3)          | A document for entry has room before the title on the first page for the entry data.                                                                                                                                                                                     |
| Art. 20(1)          | A certified document of more than one sheet is numbered and glued or sewn; each two sheets are joined with the signature and the seal of the notary in at least two places.                                                                                              |
| Appendix 7          | The first page of a deed for entry: two boxes at the top, the notarial fee on the left and the entry data on the right; then the title "НОТАРИАЛЕН АКТ", "за …" and the line "№ … том … рег. № … дело № … от … г."; then the text lines.                                 |

Appendix 7 on lex.bg is an HTML table. It gives the order and the place of the parts, not their
sizes, and it does not show the frame.

### ГПК (`gpk.json`)

| Provision     | What it settles                                                                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Art. 578(1)   | The form, the kind and the size of the paper of a draft deed follow the form approved by the Minister of Justice (that is, Ordinance No. 32).                  |
| Art. 578(2)   | The draft is clean and legible, written by hand in black or blue ink, or printed.                                                                              |
| Art. 578(3)   | Figures about the content of the deal are also written in words. Blank places are struck out.                                                                  |
| Art. 579(1)   | The participants write their names and sign before the notary.                                                                                                 |
| Art. 580      | The content of a deed: date (and if necessary the hour and the place), the notary, full names, ЕГН and identity document data, content, documents, signatures. |
| Art. 589(2)   | For a document about rights in real estate, the signers write their full name by hand and sign before the notary.                                              |
| Art. 590(1)   | A certification is a note (надпис) on the document; Art. 580 applies to it.                                                                                    |
| Art. 590(4)   | Signatures and content certified at the same time: two or more identical copies.                                                                               |
| Art. 592(1)   | A notarial invitation: three identical copies; the notary notes the delivery on each.                                                                          |
| Art. 593, 594 | A protocol of appearance and a protocol of acceptance: two identical copies, signed by the applicant and the notary.                                           |

### Правилник за вписванията (`pv.json`)

| Provision  | What it settles                                                                                                                                                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Art. 9(1)  | The registry office writes the entry number, the date, and the volume and page of the property book on the act itself (the entry box of Appendix 7).                                                                                            |
| Art. 35(1) | Deeds and papers for the books are printed or written in black or blue ink, without deletions; the blank places in the forms are struck out; figures are also written in words; white A4 paper of 80 g/m² or more; margins wide enough to bind. |

### Закон за наследството (`zn.json`)

| Provision  | What it settles                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| Art. 25(2) | The notary writes the protocol for a deposited holographic will on the closed envelope itself.        |
| Art. 27(3) | The protocol of announcement describes the will; the will is attached and countersigned on each page. |

### Закон за кадастъра и имотния регистър (`zkir.json`)

| Provision  | What it settles                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------ |
| Art. 26(2) | The identifier of a property is unique in the country and includes the ЕКАТТЕ code of the place. |

## Standards

| Source                   | What it settles                                                                                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ISO 216 (БДС EN ISO 216) | A4 is 210 × 297 mm; the sides have the ratio 1 : √2. The ISO catalogue page refused the request (HTTP 403); the size is in every secondary source that we read.                |
| ISO 269                  | C5 envelope: 162 × 229 mm, for an A4 sheet folded once. Secondary source only.                                                                                                 |
| ISO 13616 (IBAN)         | A Bulgarian IBAN has 22 characters, written in groups of four (27 characters with spaces). Secondary sources: wise.com, qonto.com.                                             |
| ISO 3779 (VIN)           | A vehicle identification number has 17 characters. Not checked in a primary source.                                                                                            |
| БДС 6.04.1-85            | "Унифицирани системи за управленска документация", the state standard for the layout of administrative documents. We did not get its text; the instructions below refer to it. |

## Written practice (official instructions, not binding on notaries)

| Source                                                                                                                                         | What it settles                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Институт по публична администрация, "Практическа инструкция за създаване и оформяне на документите в публичната администрация", 2014, p. 12–13 | Letterheads: one side of white A4 paper, black letters; Times New Roman or Verdana; 1.5 line spacing; a first-line indent of 1.25 cm; margins of 30 mm left, 20 mm top, 20 mm right, 10 mm bottom. Text justified; one space between words; one font for the whole document; bold for headings. On a document of more pages, the footer of the first page is empty and the second and later pages carry the page number. |
| МДААР and Институт за български език, "Практическа инструкция за оформяне на документи в администрацията"                                      | Refers to БДС 6.04.1-85 for the place of the parts. Text justified, a new paragraph with an indent, one font. An example in the text says that the body text is 12 pt.                                                                                                                                                                                                                                                   |
| НВУ "Васил Левски", Appendix 12 "Служебни полета" (2013)                                                                                       | Cites БДС 6.04.1-85: left margin 3 cm (for binding in the archive), top and bottom 2 cm, right 1 cm. The text of this PDF has no Unicode map; we read the numbers from the extracted layout and the search result.                                                                                                                                                                                                       |

## Common practice (no written source found)

- **Font and size of a notarial deed.** Offices type deeds in Times New Roman, 12 pt. No notarial act
  sets a font. The searches for an instruction of the Notary Chamber on the layout found nothing.
- **Line spacing.** Offices use single or 1.5 spacing. Only the administration instruction states a
  value (1.5).
- **Size of a certification stamp.** Appendix 6 gives the wording only. The lines of the appendix hold
  about 70 characters.
- **Where the page number goes.** Ordinance No. 32 says only that the pages are numbered.
- **Ink colour of the seal and the stamps.** Usually blue or violet. No source.
- **Envelope of a holographic will.** The law says "on the envelope", not which envelope.
- **Lengths of the data in a blank.** ЕГН has 10 digits (ЕСГРАОН; secondary source: kik-info.com).
  ЕИК has 9 digits (Наредба № 1 for the commercial register; secondary source: trudipravo.bg).
  The number of an identity card has 9 characters (observed). A cadastral identifier such as
  "68134.4082.1069.1.12" has about 20 characters (observed; the structure is in the ordinance under
  Art. 31 ЗКИР, which we did not import).

## Sources

- Наредба № 32: https://lex.bg/laws/ldoc/-550233600 (Appendices 6 and 7 read from the HTML, decoded
  from windows-1251). Also `public/data/laws/acts/n32.json`.
- ГПК, ПВ, ЗН, ЗКИР: `public/data/laws/acts/gpk.json`, `pv.json`, `zn.json`, `zkir.json`.
- ИПА, Практическа инструкция (2014):
  https://www.ipa.government.bg/sites/default/files/instrukciya-dokumenooborot_0.pdf (pages 12–13
  read in the browser; the PDF text has no Unicode map).
- МДААР, Практическа инструкция за оформяне на документи в администрацията:
  https://maglizh.bg/wp-content/uploads/2021/10/Практическа-инструкция-за-оформяне-на-документи.pdf
- НВУ, Служебни полета: https://nvu.bg/sites/default/files/norm_baza/adm_mod/2013/slujebni%20poleta.pdf
- Tinos, a font with the metrics of Times New Roman (Steve Matteson; OFL):
  https://github.com/google/fonts/blob/main/ofl/tinos/DESCRIPTION.en_us.html and the Fontsource
  package `@fontsource/tinos` 5.3.0 (Cyrillic, 400 and 700, upright and italic).
- IBAN: https://wise.com/ae/iban/bulgaria, https://qonto.com/pt/iban/bulgaria
- ЕГН: https://kik-info.com/proverki/proverka-na-egn.php
- ЕИК: https://trudipravo.bg/izbrani-statii/targovski-registar-edinen-identifikatzionen-kod/
