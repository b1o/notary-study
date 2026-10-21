NC.registerChapter('en', {
  id: 'vehicles',
  title: 'Sale of motor vehicles',
  summary: 'The form of the contract, the checks before signing, the fee, the tax and the registration of the new owner.',
  objectives: [
    'Decide when a vehicle sale needs notarially certified signatures.',
    'Carry out the checks that the law requires before the certification.',
    'Calculate the notarial fee and the local tax for a vehicle sale.',
    'Complete the file: the information system, the notice to the municipality and the buyer\'s registration.'
  ],
  body: `
## When the notary is needed

The ownership of motor vehicles is transferred by a **written contract** ([[zdvp:144:1]]). For the following vehicles, the **signatures of the parties must be notarially certified** ([[zdvp:144:2]]):

- registered **cars**;
- registered **trailers** with a load capacity over **10 tonnes**;
- registered **wheeled tractors**;
- registered **motorcycles** with an engine over **350 cm³**;
- the vehicles above also when their registration was terminated.

The certification is **not** required for end-of-life vehicles, for vehicles whose acquirer is abroad and that will not be registered again in Bulgaria, and for vehicles deregistered after a total loss ([[zdvp:144:2]]).

A sale to a person **without a permanent address or address registration** in Bulgaria is made only after the registration is terminated and the plates are returned ([[zdvp:144:3]]).

The certification is a certification of signatures (chapter 15). Any notary may perform it ([[gpk:570:2]]). An assistant notary may perform it on the notary's instructions.

> [!warn] Why the form matters
> Good faith does not protect the buyer of a car from a non-owner, because the transfer needs certified signatures ([[zs:78]]). If a seller of common property is married, the other spouse can challenge the sale like a sale of real estate ([[sk:24:5]]). Check the registration certificate, the identity and the marital status.

## Documents

| Document | Purpose |
|---|---|
| Identity documents of seller and buyer | Identity and capacity |
| **Registration certificate** of the vehicle (parts I and II) | Owner, VIN, registration number |
| Power of attorney, if an agent signs; for a company, its current status | Representation |
| For a common vehicle of spouses: the other spouse's participation or power of attorney | [[sk:24:5]] |
| The contract in at least three identical copies | One for each party and one for the office |

## Checks before the certification

| Check | How | Article |
|---|---|---|
| Vehicle tax paid by the seller | Automated check in the Ministry of Finance exchange system, or a document issued or certified by the municipality | [[dopk:264:2]], [[zmdt:50:2]] |
| No unpaid public debts of the seller subject to enforcement | Electronic check at the National Revenue Agency | [[dopk:264:2]] |
| The vehicle data and the owner | Registration certificate; data exchanged between the Ministry of Interior and the Notary Chamber | [[zdvp:144:4]] |
| Local tax on acquisition paid by the buyer | Payment document | [[zmdt:50:1]] |

If the check finds unpaid public debts, the rule of [[dopk:264:4]] applies, as for real estate (chapter 17).

## The contract

A vehicle sale contract usually states:

- the parties with their identity data;
- the vehicle: make, model, type, **VIN** (chassis number), engine number, registration number, colour, date of first registration;
- the **price** and how it was paid (bank transfer for 10,000 leva / 5,112.92 € or more, [[zopvb:3:1]]);
- the handover of the vehicle, the keys and the documents;
- the seller's statement that the vehicle is not encumbered, stolen or pledged;
- who pays the costs.

The signatures are certified on all copies; the parties sign before the notary ([[gpk:589:2]]).

## Fee and tax

- **Notarial fee.** For the certification of signatures on contracts for the transfer of motor vehicles, the full fee of item 8 applies ([[tarifa:11]]). The material interest is the **value for which the vehicle is insured** ([[znnd:97:1]]), or the agreed price if it is higher ([[znnd:97:3]]).
- **Local tax** on the acquisition of a vehicle for value: 0.1–3% set by the municipality ([[zmdt:44:1]], [[zmdt:47:2]]), on the insurance value ([[zmdt:33:1]], [[zmdt:46:2]]). The buyer pays it unless agreed otherwise ([[zmdt:45:1]]). It is not due for some vehicles, for example vehicles bought abroad by a buyer abroad that will not be registered in Bulgaria ([[zmdt:44:4]]).
- **Annual vehicle tax.** The new owner does not pay the annual tax for the current year if the previous owner paid it until the end of the year ([[zmdt:58:3]]).

> [!example] A used car
> A car insured for 8,000 € (15,646.64 лв.) is sold. Item 8: 160.50 + 0.8% × (15,646.64 − 10,000) = 205.67 лв. = **105.16 €**, plus VAT. The local tax at 2.5% of 8,000 € is **200 €**. The fee calculator gives the same result for "Sale of a motor vehicle".

## After the certification

1. **Information system.** The notary enters a **scan** of the contract in the information system of the Notary Chamber. The notary keeps, in a special file, for **two years**, a copy of the contract, the documents of representation and the declarations about the special requirements ([[n32:9а]]).
2. **Data to the Ministry of Interior.** The Ministry of Interior and the Notary Chamber exchange information electronically about registered vehicles and the contracts ([[zdvp:144:4]]). The buyer may ask for the registration certificate to be prepared in advance, if the plates do not change ([[zdvp:144:5]]).
3. **Notice to the municipality** within **7 days** about the transfer and the tax paid ([[zmdt:51:2]]).
4. **The buyer registers** the vehicle within **one month** at the registration service of the buyer's permanent address, unless the buyer is a dealer who bought it for resale ([[zdvp:145:2]]). Before driving, the buyer needs valid compulsory civil liability insurance.

## Powers of attorney for vehicles

A power of attorney to sell a vehicle or to register it needs a notarially certified signature in practice, and its extract is entered in the information system ([[n32:9а]]). Powers certified by mayors are valid even though mayors cannot enter them in the system (chapter 5).
`,
  cards: [
    ['Which vehicles need notarially certified signatures on the sale contract?', 'Registered **cars**, **trailers over 10 t**, **wheeled tractors**, **motorcycles over 350 cm³** (Art. 144(2) ЗДвП).'],
    ['Name two exceptions from the certification requirement.', 'End-of-life vehicles; vehicles whose acquirer is abroad without later Bulgarian registration; vehicles deregistered after a total loss (Art. 144(2) ЗДвП).'],
    ['Which notary may certify a car sale?', '**Any** notary (Art. 570(2) ГПК).'],
    ['What does the notary check about the vehicle tax?', 'That the **seller paid** the vehicle tax, through the MoF system or a municipal document (Art. 264(2) ДОПК).'],
    ['Material interest for the fee on a car sale?', 'The value for which the vehicle is **insured** (Art. 97(1) ЗННД).'],
    ['Which tariff item applies to a car sale?', 'Item 11: the **full item 8 fee** (item 11 ТНТ).'],
    ['What does the notary enter in the information system after a car sale?', 'A **scan** of the contract; and keeps a copy with representation documents and declarations for **two years** (Art. 9а Наредба № 32).'],
    ['Deadline for the buyer to register the car?', '**One month** (Art. 145(2) ЗДвП).'],
    ['Does the buyer pay the annual vehicle tax again for the current year?', '**No**, if the seller paid it until the end of the year (Art. 58(3) ЗМДТ).'],
    ['Can a person without a Bulgarian address buy a registered car directly?', 'Only after the registration is **terminated** and the plates returned (Art. 144(3) ЗДвП).']
  ],
  quiz: [
    { q: 'A motorcycle with a 250 cm³ engine is sold. Must the signatures be notarially certified?', o: ['No, the rule covers motorcycles over 350 cm³', 'Yes, all motorcycles', 'Yes, all registered vehicles', 'Only if the price is over 5,000 €'], a: 0, e: 'Art. 144(2) ЗДвП covers motorcycles with an engine over 350 cm³.', r: 'zdvp:144:2' },
    { q: 'A car registered in Varna is sold by a seller in Sofia. Which notary may certify the contract?', o: ['Any notary', 'Only a notary in Varna', 'Only a notary in Sofia', 'Only the notary at the buyer\'s address'], a: 0, e: 'Certifications of signatures are not bound to a district.', r: 'gpk:570:2' },
    { q: 'What must the notary check about the seller before certifying a car sale?', o: ['Paid vehicle tax and no enforceable public debts', 'The seller\'s salary', 'The seller\'s driving licence points', 'Nothing beyond the identity'], a: 0, e: 'Art. 264(2) ДОПК.', r: 'dopk:264:2' },
    { q: 'The car is insured for 12,000 €; the price is 9,000 €. What is the material interest for the fee?', o: ['12,000 €, the insured value', '9,000 €', '10,500 €', 'The market price set by the notary'], a: 0, e: 'For a vehicle, the material interest is the value for which it is insured; for onerous deals the price applies if it is higher.', r: 'znnd:97:1, znnd:97:3' },
    { q: 'What does the office do with the signed contract in the information system?', o: ['Enters a scan of it', 'Nothing', 'Enters only the price', 'Sends it to the bank'], a: 0, e: 'Art. 9а, item 6 of Ordinance No. 32.', r: 'n32:9а' },
    { q: 'How long does the notary keep the copy of the contract and the declarations in a special file?', o: ['Two years', 'Ten years', 'One hundred years', 'Six months'], a: 0, e: 'Art. 9а, item 6 of Ordinance No. 32.', r: 'n32:9а' },
    { q: 'Within what time must the buyer register the car?', o: ['One month', 'Two weeks', 'Three months', 'One year'], a: 0, e: 'Art. 145(2) ЗДвП.', r: 'zdvp:145:2' },
    { q: 'The buyer wants to pay 7,000 € in cash. Is it allowed?', o: ['No, payments of 10,000 лв. (5,112.92 €) or more must go through a payment account', 'Yes, cars are an exception', 'Yes, if the notary counts the money', 'Yes, if written in the contract'], a: 0, e: 'Art. 3 ЗОПБ.', r: 'zopvb:3:1' },
    { q: 'The car belongs to a married couple as common property; only the husband comes. What is the risk?', o: ['The wife can challenge the sale as for real estate', 'There is no risk for movables', 'The sale is void automatically', 'The buyer becomes co-owner with the wife'], a: 0, e: 'For dispositions that need certified signatures, the rule for common real estate applies.', r: 'sk:24:5' },
    { q: 'Within what time does the notary notify the municipality about the car sale?', o: ['7 days', '1 month', '2 months', 'Not at all'], a: 0, e: 'Art. 51(2) ЗМДТ covers vehicles too.', r: 'zmdt:51:2' }
  ]
});
