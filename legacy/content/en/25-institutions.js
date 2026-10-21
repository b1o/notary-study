NC.registerChapter('en', {
  id: 'institutions',
  title: 'Working with institutions and registers',
  summary: 'The Registry Agency, the cadastre, municipalities, the tax agency, civil registration, the police, courts and banks: what to ask and how.',
  objectives: [
    'Name the institution that issues or keeps each document a notary file needs.',
    'Read a cadastral identifier and a property register record.',
    'Order sketches, certificates and inquiries, and know their limits.',
    'Communicate with institutions correctly: in writing, electronically, and by phone.'
  ],
  body: `
## The map

| Institution | What the office needs from it |
|---|---|
| **Registry Agency** ({{Агенция по вписванията}}) and its registry offices ({{служби по вписванията}}) | Property register: entries, inquiries, certificates of encumbrances; Commercial Register and register of non-profit entities; register of property regimes of spouses |
| **Registration judge** at the district court | Orders entries, notes and deletions; refuses them ([[zsv:280]]) |
| **Geodesy, Cartography and Cadastre Agency** ({{АГКК}}) and its local offices | Cadastral map; sketches of plots and schemes of objects; identifiers; corrections |
| **Municipality** ({{община}}) | Tax assessment certificates; local taxes; certificates of heirs and civil status; building documents |
| **National Revenue Agency** ({{НАП}}) | Electronic check for public debts ([[dopk:264:1]]) |
| **Ministry of Regional Development**, civil registration ({{ГРАО}}) | National Population Database ([[znnd:19:2]]) |
| **Ministry of Interior** ({{МВР}}) | Register of identity documents; vehicle registration |
| **Courts** | Permissions for children's property; acceptance and renunciation of inheritances; appeals |
| **Notary Chamber** | Register of notaries; information system; guidance |
| **Ministry of Justice** | Inspections; apostilles; competitions; ordinances |
| **SANS, Financial Intelligence Directorate** | Reports under the AML law ([[zmip:72]]) |
| **Banks** | Payments, special accounts, mortgages, consents to delete |

The notary has **free access** to court and administrative offices, may consult files and receive copies and certificates **with priority** ([[znnd:19:1]]).

## The property register

### What it is

The property register consists of the **partidas** ({{партиди}}) of the properties ([[zkir:3:1]]). It records the acts that recognise or transfer ownership and create, transfer, change or end other real rights, and the distraints and mortgages ([[zkir:3:2]]). Every partida has five parts ([[zkir:59:1]]):

| Part | Content |
|---|---|
| **А** | The property: identifier, type, address, boundaries, area, purpose ([[zkir:60]]) |
| **Б** | The owner and the acts that recognise or transfer ownership ([[zkir:61]]) |
| **В** | Other real rights, claims under [[zs:114]], contracts subject to entry ([[zkir:62]]) |
| **Г** | Mortgages: type, act, amount, maturity, creditor, debtor ([[zkir:63]]) |
| **Д** | Distraints: type, act, authority, amount, deletion ([[zkir:64]]) |

The partida **announces**; it is **not evidence** of the facts and rights entered ([[zkir:59:4]]). The documents in the file are the evidence.

> [!note] Personal and real system
> The law builds a **real** system, organised by property. Until the registry office of a district switches fully, records are kept by person (owner), with auxiliary partidas for properties ([[zkir:65:3]], [[zkir:65:4]]). In practice, search both by the **name and identity number** of each owner in the chain and by the **identifier** of the property.

### The entry

- An entry is made at the request of the interested person, at the request of a **notary** in the cases of law, or ex officio ([[zkir:76:1]]).
- The request states the property, its **identifier**, the partida number and the fact entered, and has a **sketch** or **scheme** attached ([[zkir:77]]).
- The judge orders the entry; the date is recorded and the judge signs; the act shows the incoming number, the date and the partida ([[zkir:84]]). An entry without the judge's order or signature is invalid ([[zkir:85]]).
- The registry office **notifies the cadastre office** of new partidas and entries at once ([[zkir:86]]) and the municipality within 7 days ([[zmdt:51:1]]).

### Inquiries and certificates

- Anyone can ask for an inquiry about entries, and for a **certificate of encumbrances** (existence or absence of entries) ([[gpk:569]]). For a sale, the certificate usually covers the property and the owners for the last **10 years**; a longer period costs more.
- Inquiries can be made online through the Registry Agency's portal with an electronic signature.

## The cadastre

The cadastre is the set of basic data about the location, boundaries and size of properties ([[zkir:2:1]]). Each plot, building and separate object gets a unique **identifier** ([[zkir:26]]). The identifier starts with the **EKATTE** code of the settlement ([[zkir:26:2]]), for example:

\`\`\`doc Reading an identifier
68134 . 4083 . 123 . 1 . 5
  │       │      │    │   └ separate object (flat) No. 5
  │       │      │    └ building No. 1 on the plot
  │       │      └ plot No. 123
  │       └ cadastral region No. 4083
  └ EKATTE code of the settlement (Sofia)
\`\`\`

The office orders from the cadastre office, usually online:

- a **sketch** ({{скица}}) of a plot, or a **scheme** ({{схема}}) of a separate object: needed for the entry ([[zkir:77]]);
- a **sketch-project** ({{скица-проект}}) when a deal creates new properties, for example a partition or a declaratory deed for a property not yet on the map ([[zkir:52]]).

Errors in the map are corrected by the cadastre office on written evidence and a project ([[zkir:54]]); obvious errors on application ([[zkir:53б]]). A dispute about ownership is settled in court ([[zkir:54:2]]).

## The municipality

- **Certificate of tax assessment** under [[dopk:264:1]]: the base for fees and tax; shows whether the property's taxes are paid.
- **Local taxes**: the tax on acquisition is paid to the municipality of the property ([[zmdt:49:1]]); the notary informs the municipality within 7 days ([[zmdt:51:2]]).
- **Certificate of heirs** and civil status certificates (birth, marriage, death), from the civil registration data.
- **Building documents**: permits and acts of commissioning, kept by the chief architect's office.
- **Mayors** perform limited notarial acts where there is no notary ([[znnd:83]]).

## The National Revenue Agency

The notary checks **electronically** that the transferor of real estate, the mortgagor or the pledgor, and the seller of a vehicle, has no unpaid public debts subject to enforcement ([[dopk:264:1]], [[dopk:264:2]]). Print or save the result in the case file.

## Civil registration and identity

- The notary and the assistant notary have individual access to the **National Population Database**: names, identity number, addresses, legal restrictions, marital status, marriages and divorces, deaths, relatives ([[nnbd:2:1]], [[nnbd:3:2]]).
- They also have access to the **National Register of Bulgarian Identity Documents**, for documents with a photo ([[nnrbld:1]], [[nnrbld:2]]). The information is used only for the duties under [[znnd:25:3]] ([[nnrbld:3]]).
- Access is personal and is **audited**: the ministry may ask the notary to give the reason for each inquiry within one month ([[nnbd:10]], [[nnbd:11]]).

## The Ministry of Interior and vehicles

The Ministry of Interior and the Notary Chamber exchange information on registered vehicles and contracts ([[zdvp:144:4]]). The buyer registers the vehicle within one month ([[zdvp:145:2]]).

## Courts

| Matter | Court |
|---|---|
| Entries, notes, deletions; refusals of entry | Registration judge, district court ([[zsv:280]]) |
| Permission to dispose of a child's or ward's property | District court of the child's address ([[sk:130:3]]) |
| Acceptance, renunciation, inventory of an inheritance | District judge where the inheritance opened ([[zn:49]], [[zn:52]]) |
| Appeal against a notary's refusal | Regional court ([[gpk:577:1]]) |
| Disciplinary appeals | Supreme Court of Cassation ([[znnd:80]]) |

## How to communicate

- **In writing.** An official letter states: the office, the notary, the case number, the legal basis for the request (for example [[znnd:19:1]]), what is requested, the deadline, and a contact. Keep a copy with the outgoing number.
- **Electronically.** Most portals require a **qualified electronic signature** of the notary or an authorised person. Save every response as a file in the case.
- **By phone.** Introduce yourself and the office, give the case number, write down the name of the official and the date. Never give personal data of clients by phone to an unknown caller.
- **Professional secrecy.** Disclose only what the request needs ([[znnd:26]], [[znnd:49]]).
`,
  cards: [
    ['What are the five parts of a property register partida?', 'А – property; Б – owner; В – other rights, claims, contracts; Г – mortgages; Д – distraints (Art. 59 ЗКИР).'],
    ['Is the partida evidence of ownership?', '**No**; it announces facts, it is not evidence of them (Art. 59(4) ЗКИР).'],
    ['What must the request for entry contain?', 'Applicant, fact entered, description, **identifier**, partida number, signature; a **sketch or scheme** attached (Art. 77 ЗКИР).'],
    ['What makes an entry invalid?', 'No order of the registration judge, or no signature under Art. 84 (Art. 85 ЗКИР).'],
    ['Who gives cadastral identifiers?', 'The **Geodesy, Cartography and Cadastre Agency** (Art. 26(3) ЗКИР).'],
    ['What does an identifier always contain?', 'The **EKATTE** code of the settlement (Art. 26(2) ЗКИР).'],
    ['When is a sketch-project needed?', 'When a deal creates new or changed properties, e.g. a partition or a declaratory deed (Art. 52 ЗКИР).'],
    ['Who issues the certificate of tax assessment?', 'The **municipality** (Art. 264(1) ДОПК).'],
    ['Whom does the registry office notify after an entry?', 'The **cadastre office** at once (Art. 86 ЗКИР) and the **municipality** within 7 days (Art. 51(1) ЗМДТ).'],
    ['Can the ministry audit a notary\'s inquiries in the population database?', '**Yes**; the notary gives the reason for each inquiry within one month of a sample (Art. 10–11 of the access ordinance).'],
    ['What right of access to offices does the notary have?', 'Free access to court and administrative offices, files and copies, **with priority** (Art. 19(1) ЗННД).']
  ],
  quiz: [
    { q: 'In which part of a partida do you find a bailiff\'s distraint?', o: ['Part Д', 'Part Б', 'Part Г', 'Part А'], a: 0, e: 'Part Д records distraints.', r: 'zkir:64, zkir:59:1' },
    { q: 'The partida shows a person as owner. Is this proof of ownership?', o: ['No, the partida announces; the acts are the evidence', 'Yes, always', 'Yes, after 10 years', 'Only for apartments'], a: 0, e: 'Art. 59(4) ЗКИР.', r: 'zkir:59:4' },
    { q: 'What does the office attach to a request for entry of a sale of a flat?', o: ['A scheme of the separate object from the cadastre', 'A photo', 'A tax return', 'A utility bill'], a: 0, e: 'Art. 77 ЗКИР.', r: 'zkir:77' },
    { q: 'What is "68134" in the identifier 68134.4083.123.1.5?', o: ['The EKATTE code of the settlement', 'The flat number', 'The plot number', 'The postal code'], a: 0, e: 'The identifier always includes the EKATTE code.', r: 'zkir:26:2' },
    { q: 'Two heirs divide a plot into two new plots. What does the office need from the cadastre?', o: ['A sketch-project for the new plots', 'Nothing', 'Only the old sketch', 'A building permit'], a: 0, e: 'For a partition that creates new properties, a sketch-project is issued.', r: 'zkir:52' },
    { q: 'Which institution issues the certificate of tax assessment?', o: ['The municipality', 'The National Revenue Agency', 'The Registry Agency', 'The cadastre office'], a: 0, e: 'The local taxes department of the municipality.', r: 'dopk:264:1' },
    { q: 'An entry was made without the registration judge\'s order. What is its status?', o: ['Invalid', 'Valid', 'Voidable', 'Valid after 3 days'], a: 0, e: 'Art. 85 ЗКИР.', r: 'zkir:85' },
    { q: 'A caller says he is from "the tax office" and asks for a client\'s identity number by phone. What do you do?', o: ['Refuse; ask for a written request through official channels', 'Give it to help', 'Give only the address', 'Ask the client by text message'], a: 0, e: 'Professional secrecy binds employees.', r: 'znnd:49, znnd:26' },
    { q: 'Where does a parent ask for permission to sell a child\'s flat?', o: ['The district court of the child\'s current address', 'The notary', 'The municipality', 'The regional court'], a: 0, e: 'Art. 130(3) СК.', r: 'sk:130:3' },
    { q: 'What right does Art. 19(1) ЗННД give the notary?', o: ['Free access to offices, files and copies with priority', 'Free taxi rides to courts', 'Access to bank accounts of clients', 'Power to order entries'], a: 0, e: 'Art. 19(1) ЗННД.', r: 'znnd:19:1' }
  ]
});
