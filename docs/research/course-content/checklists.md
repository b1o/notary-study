# Checklists: the 36 items without a citation

Task from the polish-pass session (21 October 2026): the checklist pages mark an item "No source" when its text has no `[[act:article]]` citation. 36 of the 137 items in `public/data/checklists.json` had none. Each item below got a provision from the imported acts, a reworded text that says what is true, or was removed. Both languages changed together.

Result: 34 items sourced as written, 1 item reworded and sourced (the "warning signs" item of the circumstantial verification), 1 item removed (merged into another). The file now has 136 items, all with a citation. `bun run check:content` passes.

| # | Checklist / section | Item (en) | Source added | Change |
| --- | --- | --- | --- | --- |
| 1 | sale-flat / First call | How and when the seller acquired it; during a marriage? | Art. 586(1) ГПК (ownership check); Art. 21(1) СК (community property) | Sourced |
| 2 | sale-flat / First call | All sellers and buyers: married, minors, companies, foreigners, agents? | Art. 578(4) ГПК (identity, capacity, representative power) | Sourced |
| 3 | sale-flat / First call | Mortgage on the flat? Will the buyer use a bank loan? | Art. 173, 179 ЗЗД (the mortgage follows the property; deletion by consent) | Sourced |
| 4 | sale-flat / First call | Price and payment method agreed; preliminary contract? | Art. 25(9), 25(10) ЗННД; Art. 19 ЗЗД | Sourced |
| 5 | sale-flat / Documents from the seller | Identity document of each seller. | Art. 578(5) ГПК | Sourced |
| 6 | sale-flat / Documents from the seller | For inherited property: certificate of heirs, deed of the deceased, any will. | Art. 586(2) ГПК (ownership proved by documents); Art. 1 ЗН | Sourced; the certificate of heirs itself has no provision in the library (civil registration act not imported) |
| 7 | sale-flat / Documents from the seller | For a company: current status and decision of the general meeting or the owner. | Art. 10 ЗТРРЮЛНЦ; Art. 137(4), 147(2) ТЗ | Sourced |
| 8 | sale-flat / Documents from the buyer | Identity document. | Art. 578(5) ГПК | Sourced |
| 9 | sale-flat / Documents from the buyer | Bank documents and the mortgage draft, if there is a loan. | Art. 167 ЗЗД (content of the mortgage deed) | Sourced |
| 10 | sale-flat / Checks by the office | Property register: mortgages, distraints, claims, the chain of ownership. | Art. 113, 114 ЗС | Sourced |
| 11 | sale-flat / After the signing | Copies to the parties only after the entry. | Art. 25(5) ЗННД | Sourced |
| 12 | sale-flat / After the signing | Payment from the special account under the agreement. | Art. 25а(2) ЗННД | Sourced |
| 13 | gift / Before the appointment | Reserved right of use: for whom, and after the first death? | Art. 56, 59 ЗС | Sourced |
| 14 | gift / Documents | Identity documents of all parties. | Art. 578(5) ГПК | Sourced |
| 15 | gift / Documents | Entered document of ownership. | Art. 586(4) ГПК | Sourced |
| 16 | gift / Documents | Proof of kinship if the tax exemption applies. | Art. 44(6) ЗМДТ | Sourced |
| 17 | gift / On the day | Entry the same day; notice to the municipality within 7 days. | Art. 25(5) ЗННД; Art. 51(2) ЗМДТ | Sourced |
| 18 | mortgage / From the bank | Draft deed and the loan agreement number and terms. | Art. 167 ЗЗД | Sourced |
| 19 | vehicle / Documents | Identity documents of seller and buyer. | Art. 589(2), 578(5) ГПК | Sourced |
| 20 | vehicle / Documents | Registration certificate, parts I and II. | Art. 144(4) ЗДвП (data exchange with the Ministry of Interior) | Reworded: the owner, the VIN and the data match the contract and the exchanged data; item 22 merged into it |
| 21 | vehicle / Documents | Contract in three identical copies. | Art. 144(2) ЗДвП (written contract with certified signatures); Art. 9а item 6 of Ordinance No. 32 (the notary's two-year file) | Reworded with the purpose of the copies |
| 22 | vehicle / Checks | VIN and data match the registration certificate. | — | Removed: merged into item 20 (one check, one place) |
| 23 | poa / Content | Full identity data of principal and agent. | Art. 9а item 1(a) of Ordinance No. 32 (the extract carries the data of both) | Sourced |
| 24 | poa / Content | Property by identifier; type of deal; minimum price; account for the price. | Art. 39 ЗЗД (the scope is what the principal stated); Art. 9а item 1(b)–(c) | Sourced |
| 25 | poa / Content | Term, if any. | Art. 9а item 1(b) (the extract carries the term) | Sourced |
| 26 | inherited-sale / Who owns what | Certificate of heirs from the municipality of the last address. | Art. 586(2) ГПК | Reworded: "as proof of who inherits"; the certificate itself has no provision in the library |
| 27 | inherited-sale / Who owns what | Renunciations: certificate from the district court. | Art. 52 ЗН (the renunciation is entered in the court's book) | Sourced |
| 28 | inherited-sale / Documents and checks | Deed of the deceased and death certificate. | Art. 586(2) ГПК; Art. 1 ЗН | Sourced |
| 29 | inherited-sale / Documents and checks | Tax assessment, sketch or scheme, declarations of every seller. | Art. 264(1) ДОПК; Art. 77 ЗКИР; Art. 25(8) ЗННД | Sourced |
| 30 | holographic-will / Deposit | Testator identified; envelope closed; nobody opens it. | Art. 25(2) ЗН | Sourced |
| 31 | holographic-will / Announcement | Proof of death presented. | Art. 27(1) ЗН (announcement after the death) | Sourced |
| 32 | circumstantial / Filing | Evidence of possession: tax declarations and receipts, contracts, photos. | Art. 587(1) ГПК (written evidence); Art. 79 ЗС | Sourced |
| 33 | circumstantial / Witnesses | Warning signs reported to the notary (chapter 27). | Art. 587(3) ГПК (the notary decides by a reasoned decision) | Reworded: "Doubts reported to the notary, who decides by a reasoned decision" |
| 34 | office-day / Opening | Appointments of the day; drafts and documents ready. | Art. 578(1) ГПК; Art. 18(1) of Ordinance No. 32 (copies of the draft) | Reworded: the drafts of today's deeds in the required copies |
| 35 | office-day / Opening | Information systems and registers accessible; personal accounts only. | Art. 2(1), 10 of the ordinance on the National Population Database (individual, audited access) | Sourced |
| 36 | office-day / During the day | Clean desk; no documents left at reception. | Art. 49 ЗННД (official secret of the employees) | Sourced |

Open items (no provision in the library): the certificate of heirs (civil registration rules) and the registration certificate of a vehicle (the Ministry of Interior ordinance on registration). Both items keep a related provision and say what the office checks.
