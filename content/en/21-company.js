NC.registerChapter('en', {
  id: 'company',
  title: 'Company transactions at the notary',
  summary: 'Transfers of company shares and enterprises, specimen signatures, decisions of owners and the checks on companies.',
  objectives: [
    'Run a transfer of OOD shares from the first request to the filing in the Commercial Register.',
    'Prepare the certification of a manager\'s specimen signature and consent.',
    'Certify protocols of general meetings and sole-owner decisions in the right form.',
    'Apply the anti-money laundering checks to company clients.'
  ],
  body: `
## Why companies come to the notary

The Commercial Register accepts many documents only when signatures, and sometimes content, are notarially certified. The registration officer at the Registry Agency checks the form of every document ([[ztr:21]]). A protocol or contract in the wrong form is refused, and some decisions in the wrong form are **null** ([[tz:137:5]]). Companies also act in real estate deals as buyers and sellers (chapter 17). This chapter covers the typical company files.

## Before any company act

| Check | Source | Why |
|---|---|---|
| Current status of the company | Commercial Register, free online ([[ztr:11:1]]) | Who represents, how, any procurator, liquidation or insolvency |
| The articles of association (дружествен договор) or the statute | Commercial Register, the company file | Special majorities, forms, limits |
| Beneficial owners | Commercial Register; declarations | Anti-money laundering ([[zmip:59]], [[zmip:63]]) |
| Identity and powers of the persons who sign | Identity documents; powers of attorney | [[gpk:578:4]] |

Facts entered in the register are deemed known to third persons in good faith from the entry; facts not entered do not exist for them ([[ztr:7]], [[ztr:10]]).

## Transfer of shares in an OOD

### Step 1: is consent needed?

- **Between partners**: the transfer is free ([[tz:129:1]]).
- **To a third person**: the general meeting must admit the new partner and consent to the transfer ([[tz:129:1]], [[tz:137:1]]), with more than three quarters of the capital, unless the articles require more ([[tz:137:3]]). The protocol needs notarial certification of signatures and content at the same time, unless the articles allow simple written form ([[tz:137:4]]).
- **The sole owner of an EOOD** who sells all shares decides alone, in the same form ([[tz:147:2]]).

### Step 2: no unpaid wages or contributions

A transfer to a third person is possible only if the company has **no unpaid wages, compensations or mandatory social contributions** of its workers, including those whose employment ended in the last three years ([[tz:129:1]]). The manager and the transferor sign a **declaration on the approved form** that there are no other unpaid debts to workers. The registration officer checks the contributions electronically at the National Revenue Agency ([[tz:129:2]]).

### Step 3: the contract

- **Form:** written, with notarial certification of the **signatures and content at the same time** ([[tz:129:2]]).
- Prepare **two or more identical copies**; one stays in the notary's book ([[gpk:590:4]]).
- The contract names the company with its ЕИК, the transferor and the acquirer, the number and value of the shares, the price and its payment, and the representations about debts.
- A mayor cannot certify it ([[znnd:83:2]]). Any notary in Bulgaria can.
- The notary enters an extract in the information system of the Notary Chamber ([[n32:9а]]).

### Step 4: the filing

The company files an application to the Commercial Register **within 7 days** of the change ([[ztr:6]]). The application is filed by the merchant, a procurator, another person in the cases of law, or a lawyer with an express power ([[ztr:15]]). The new articles (or the new decision of the sole owner) and the beneficial owner data are filed too.

> [!tip] The fee
> When the Commerce Act requires the content to be certified together with the signatures, the notary charges an **ordinary fee**, not a fee on the price ([[znnd:90:2]]). Ask the notary which items of section I of the tariff the office uses.

## Specimen signature and consent of a manager

A newly elected manager is entered in the Commercial Register after presenting a **notarially certified consent** with a **specimen of the signature** ([[tz:141:3]]). The manager signs a short declaration: "I agree to be the manager of ... and my signature is: ....". The notary certifies the signature (chapter 15); the original goes to the register.

The same applies by analogy to members of the boards of joint-stock companies and to procurators, whose entry needs a specimen signature.

## Protocols of decisions

| Decision of the general meeting of an OOD | Form of the protocol |
|---|---|
| Admission and expulsion of partners; consent to transfer a share to a new member | Signatures and content certified at the same time ([[tz:137:4]]) |
| Increase or decrease of the capital | Signatures and content certified at the same time ([[tz:137:4]]) |
| Election of the manager | Signatures and content certified at the same time ([[tz:137:4]]) |
| Acquisition and disposal of real estate and real rights | Signatures and content certified at the same time ([[tz:137:4]]) |
| Other decisions (annual accounts, branches, claims against the manager) | Written form |

The articles may provide simple written form for the decisions in the first four rows ([[tz:137:4]]). Read the articles before you advise. The notary certifies the signatures of the partners present and the content of the protocol in two or more copies.

Partners may vote through an agent with an express written power ([[tz:137]]); check the articles for further requirements.

## Transfer of an enterprise

The transfer of a commercial enterprise as a whole, for example the business of a sole trader to a new EOOD, needs a written contract with **signatures and content certified at the same time** ([[tz:15:1]]). The transferor notifies creditors and debtors; the transfer is entered in the register for both sides after the checks on social contributions and wages ([[tz:16]]). The material interest for the fee is the book value of the fixed assets for the last quarter ([[znnd:97:1]]). If the enterprise includes real estate, it passes with the enterprise.

## Pledges over shares and enterprises

Company shares and a whole enterprise can be pledged without handing them over, as a **special pledge** ([[zoz:4]]). The pledge contract is in writing, and in the cases provided by the act with notarially certified signatures; every consent of the pledgee is given with a notarially certified signature ([[zoz:2]]). The pledge is entered in the Central Register of Special Pledges ([[zoz:2:1]]). Notaries enter extracts of documents for this register in the information system ([[n32:9а]]).

## Anti-money laundering for companies

For every company client, the notary identifies the **beneficial owner**: the natural person who ultimately owns or controls the company ([[zmip:59]]). Sources: the beneficial owner data in the Commercial Register ([[zmip:63]]) and, if this is not enough or contradictory, a **declaration** by the legal representative ([[zmip:59:1]]). The notary also checks whether the client acts for itself or for somebody else ([[zmip:65]]). Chapter 23 explains the full procedure.
`,
  cards: [
    ['Is consent of the general meeting needed for a share transfer between partners?', '**No**; transfers between partners are free (Art. 129(1) ТЗ).'],
    ['What majority admits a new partner in an OOD?', 'More than **three quarters** of the capital, unless the articles require more (Art. 137(3) ТЗ).'],
    ['What declaration accompanies a share transfer to a third person?', 'A declaration by the manager and the transferor that there are **no unpaid wages** and other debts to workers (Art. 129(2) ТЗ).'],
    ['In how many copies is a share transfer contract certified?', '**Two or more** identical copies; one stays with the notary (Art. 590(4) ГПК).'],
    ['Deadline to file a change in the Commercial Register?', '**7 days** from the change (Art. 6 ЗТРРЮЛНЦ).'],
    ['What does a new manager present to the register?', 'A notarially certified **consent with a specimen signature** (Art. 141(3) ТЗ).'],
    ['Which OOD decisions need protocols with signatures and content certified?', 'Admission/expulsion and consent to transfer; capital; election of manager; real estate (Art. 137(4) ТЗ).'],
    ['Can the articles replace the notarial form of such protocols?', '**Yes**, they may provide simple written form (Art. 137(4) ТЗ).'],
    ['Fee for certifying signature and content required by the Commerce Act?', 'An **ordinary fee**, not proportional (Art. 90(2) ЗННД).'],
    ['When are entered facts deemed known to third persons in good faith?', 'From the **entry** (Art. 7 ЗТРРЮЛНЦ).'],
    ['Where is a special pledge over company shares entered?', 'In the **Central Register of Special Pledges** (Art. 2 ЗОЗ).'],
    ['How does the notary identify the beneficial owner of a company?', 'From the register data, and if insufficient or contradictory, a **declaration** by the representative (Art. 59 ЗМИП).']
  ],
  quiz: [
    { q: 'An OOD has three partners. One sells her share to an outside investor. What is needed besides the contract?', o: ['A general meeting decision admitting the investor, in a protocol with certified signatures and content unless the articles allow written form', 'Nothing else', 'A court decision', 'Consent of the employees'], a: 0, e: 'Transfers to third persons need admission and consent by the general meeting, in the form of Art. 137(4).', r: 'tz:129:1, tz:137:4' },
    { q: 'What prevents the registration of a share transfer to a third person?', o: ['Unpaid social contributions found by the registration officer at the NRA', 'A bank loan of the company', 'A lease of the office', 'A pending lawsuit about a supplier'], a: 0, e: 'Art. 129(2) ТЗ.', r: 'tz:129:2' },
    { q: 'Within how many days must the company file the share transfer with the Commercial Register?', o: ['7 days', '14 days', '1 month', '3 days'], a: 0, e: 'Art. 6 ЗТРРЮЛНЦ.', r: 'ztr:6' },
    { q: 'The general meeting elected a new manager in a protocol with simple signatures; the articles say nothing about form. What is the status of the election?', o: ['Null; the election needs a protocol with certified signatures and content', 'Valid', 'Voidable', 'Valid after the entry'], a: 0, e: 'Art. 137(4)–(5) ТЗ.', r: 'tz:137:4, tz:137:5' },
    { q: 'What does a manager sign at the notary for the Commercial Register?', o: ['A consent with a specimen signature, with the signature certified', 'A notarial deed', 'A will', 'A declaration of income'], a: 0, e: 'Art. 141(3) ТЗ.', r: 'tz:141:3' },
    { q: 'A sole trader transfers his business to his new EOOD. What form does the contract need?', o: ['Written with signatures and content certified at the same time', 'A notarial deed', 'Simple written form', 'An oral agreement'], a: 0, e: 'Art. 15(1) ТЗ.', r: 'tz:15:1' },
    { q: 'How does the notary charge for a share transfer contract that needs signature and content certified at the same time?', o: ['An ordinary fee under section I of the tariff', 'A proportional fee on the price', 'No fee', 'A fee set by the Registry Agency'], a: 0, e: 'Art. 90(2) ЗННД.', r: 'znnd:90:2' },
    { q: 'The register shows a beneficial owner, but the company says the owner changed last month. What does the notary do?', o: ['Asks for a declaration by the legal representative and documents', 'Ignores the difference', 'Refuses all acts forever', 'Relies on what the client says orally'], a: 0, e: 'When the information is contradictory, a declaration by the representative is required.', r: 'zmip:59:1' },
    { q: 'May a mayor in a village certify the signatures on a share transfer?', o: ['No', 'Yes', 'Yes, if there is no notary', 'Yes, with the Notary Chamber\'s consent'], a: 0, e: 'Art. 83(2) ЗННД.', r: 'znnd:83:2' },
    { q: 'A company pledges its shares in a subsidiary to a bank. Where is the pledge entered?', o: ['In the Central Register of Special Pledges', 'In the property register', 'With the notary only', 'Nowhere'], a: 0, e: 'Art. 2(1) ЗОЗ.', r: 'zoz:2:1' }
  ]
});
