/* Document templates: Bulgarian working text, English working translation, notes and law references.
 * Placeholders are in square brackets. The notary decides the final wording of every document. */
(function () {
  const DEEDS = { en: 'Notarial deeds', bg: 'Нотариални актове' };
  const POA = { en: 'Powers of attorney', bg: 'Пълномощни' };
  const DECL = { en: 'Declarations', bg: 'Декларации' };
  const CONTRACTS = { en: 'Contracts with certified signatures', bg: 'Договори с нотариална заверка' };
  const COMPANY = { en: 'Company documents', bg: 'Документи на дружества' };
  const OTHER = { en: 'Other notarial acts', bg: 'Други нотариални действия' };
  const WILLS = { en: 'Wills', bg: 'Завещания' };

  NC.setTemplates([
    {
      id: 'sale-deed',
      group: DEEDS,
      title: { bg: 'Нотариален акт за покупко-продажба на недвижим имот', en: 'Notarial deed of sale of real estate' },
      use: { en: 'The deed for the sale of a flat, a house or a plot. Only the notary of the property\'s district issues it, in the office.', bg: 'Актът за продажба на апартамент, къща или поземлен имот. Издава се само от нотариуса по местонахождението на имота, в кантората.' },
      law: 'zzd:18, gpk:570:1, gpk:580, gpk:586, znnd:25:9, pv:6',
      text: `НОТАРИАЛЕН АКТ
за покупко-продажба на недвижим имот

№ [...], том [...], рег. № [...], дело № [...] от [година] г.

Днес, [дата словом и цифром] г., пред мен, [име на нотариуса], нотариус в район на действие Районен съд – [град], вписан под рег. № [...] в регистъра на Нотариалната камара, в нотариалната ми кантора в гр. [...], ул. [...] № [...], се явиха:

1. [Три имена], ЕГН [...], с лична карта № [...], издадена на [дата] от МВР – [град], с постоянен адрес [...], [гражданско състояние], от една страна като ПРОДАВАЧ, и
2. [Три имена], ЕГН [...], с лична карта № [...], издадена на [дата] от МВР – [град], с постоянен адрес [...], от друга страна като КУПУВАЧ,

които, след като се убедих в самоличността, дееспособността и представителната им власт, заявиха, че сключват следния договор:

I. ПРОДАВАЧЪТ [име] продава на КУПУВАЧА [име] следния свой собствен недвижим имот: САМОСТОЯТЕЛЕН ОБЕКТ В СГРАДА с идентификатор [.....] по кадастралната карта и кадастралните регистри на гр. [...], одобрени със Заповед № [...] на изпълнителния директор на АГКК, с адрес: гр. [...], ул. [...] № [...], ет. [...], ап. [...], с предназначение: жилище, апартамент, брой нива на обекта: 1, с площ [...] (словом) кв. м, при съседни самостоятелни обекти: на същия етаж – [...]; под обекта – [...]; над обекта – [...], заедно с прилежащото избено помещение № [...] с площ [...] кв. м, както и [...] % идеални части от общите части на сградата и от правото на строеж върху поземления имот, в който е построена сградата.

II. Цената на имота е [сума цифром] ([сума словом]) евро, която КУПУВАЧЪТ заплаща на ПРОДАВАЧА [начин на плащане: по специалната сметка на нотариуса съгласно споразумение от [дата] / по банкова сметка IBAN [...] в [банка] / изплатена изцяло преди подписването на този акт].

III. Страните декларират, че посочената в този акт цена е действително уговореното плащане по сделката (чл. 25, ал. 9 ЗННД).

IV. ПРОДАВАЧЪТ декларира, че имотът не е обременен с ипотеки, възбрани, вещни права в полза на трети лица, наемни договори и искови претенции, освен [...].

V. Владението върху имота се предава на КУПУВАЧА [при подписването на акта / на дата [...]].

VI. Разноските по прехвърлянето – нотариални такси, такса за вписване и местен данък – са за сметка на [...].

Нотариусът провери, че ПРОДАВАЧЪТ е собственик на имота и че са налице особените изисквания за сделката, за което бяха представени: нотариален акт № [...], том [...], рег. № [...], дело № [...] от [...] г. на нотариус [...], вписан в Служба по вписванията – [град] с вх. рег. № [...]; схема на самостоятелен обект № [...] от [дата], издадена от СГКК – [град]; удостоверение за данъчна оценка по чл. 264, ал. 1 ДОПК изх. № [...] от [дата], издадено от Община [...]; декларации по чл. 25, ал. 8 ЗННД; [други].

Нотариусът извърши справки по чл. 25, ал. 2 и ал. 3 ЗННД и проверка по чл. 264, ал. 1 ДОПК по електронен път в НАП.

Този нотариален акт се прочете на страните, които, след като го одобриха, го подписаха пред мен.

ПРОДАВАЧ: ..........................  ([собственоръчно изписани три имена])
КУПУВАЧ:  ..........................  ([собственоръчно изписани три имена])

НОТАРИУС: ..........................`,
      notes: {
        en: `- **Who and where.** Only the notary of the district where the property is ([[gpk:570:1]]), in the office in working hours ([[gpk:573:2]]).
- **Content.** The deed must contain the date, the notary, the full identity data of the participants, the content, the documents checked and the signatures ([[gpk:580]]). A deed for entry also contains the addresses, the description of the property and the price ([[pv:6:1]]).
- **Description.** Copy the identifier, the area and the neighbours from the scheme or sketch. Write numbers also in words ([[gpk:578:3]]).
- **Common property.** If the seller is married and the flat is common, both spouses sign as sellers ([[sk:24:3]]).
- **Price.** Over 10,000 лв. (5,112.92 €), the payment goes through the special account or a bank account ([[znnd:25:10]]).
- **Signing.** The notary reads the deed; the parties write their full names by hand and sign ([[gpk:579:1]]).`,
        bg: `- **Кой и къде.** Само нотариусът по местонахождението на имота ([[gpk:570:1]]), в кантората, в работно време ([[gpk:573:2]]).
- **Съдържание.** Актът съдържа дата, нотариус, пълните данни на участниците, съдържанието, проверените документи и подписите ([[gpk:580]]). Акт за вписване съдържа и адресите, описанието на имота и цената ([[pv:6:1]]).
- **Описание.** Препишете идентификатора, площта и съседите от схемата или скицата. Числата се изписват и словом ([[gpk:578:3]]).
- **Общо имущество.** Ако продавачът е в брак и имотът е общ, двамата съпрузи подписват като продавачи ([[sk:24:3]]).
- **Цена.** Над 10 000 лв. (5 112,92 €) плащането минава през специалната сметка или банкова сметка ([[znnd:25:10]]).
- **Подписване.** Нотариусът прочита акта; страните изписват собственоръчно имената си и подписват ([[gpk:579:1]]).`
      },
      en: `NOTARIAL DEED
of sale of real estate

No. [...], volume [...], reg. No. [...], case No. [...] of [year]

Today, [date in words and figures], before me, [name of the notary], notary in the district of the District Court of [town], entered under reg. No. [...] in the register of the Notary Chamber, in my office at [address], appeared:

1. [Full name], personal No. [...], identity card No. [...], issued on [date] by the Ministry of Interior, [town], permanent address [...], [marital status], as SELLER, and
2. [Full name], personal No. [...], identity card No. [...], issued on [date] by the Ministry of Interior, [town], permanent address [...], as BUYER,

who, after I satisfied myself of their identity, capacity and power of representation, stated that they conclude the following contract:

I. The SELLER sells to the BUYER the following real estate, owned by the seller: A SEPARATE OBJECT IN A BUILDING with identifier [...] under the cadastral map of [town], approved by Order No. [...] of the Executive Director of the Cadastre Agency, at [address], floor [...], flat [...], purpose: dwelling, area [...] (in words) m², neighbours: on the same floor [...]; below [...]; above [...], with cellar No. [...] of [...] m², and [...] % ideal parts of the common parts of the building and of the right of construction on the land.

II. The price is [amount in figures] ([amount in words]) euro, paid by the BUYER to the SELLER [method: through the notary's special account under an agreement of [date] / to bank account IBAN [...] / paid in full before the signing].

III. The parties declare that the price stated is the payment actually agreed (Art. 25(9) of the Notaries Act).

IV. The SELLER declares that the property is free of mortgages, distraints, real rights of third persons, leases and claims, except [...].

V. Possession passes to the BUYER [on signing / on [date]].

VI. The costs of the transfer – notarial fees, entry fee and local tax – are paid by [...].

The notary checked that the SELLER is the owner and that the special requirements are met, on the basis of: notarial deed No. [...]; scheme No. [...]; certificate of tax assessment under Art. 264(1) of the Tax Procedure Code; declarations under Art. 25(8) of the Notaries Act; [other].

The notary made the checks under Art. 25(2) and (3) of the Notaries Act and the electronic check at the National Revenue Agency under Art. 264(1) of the Tax Procedure Code.

This deed was read to the parties, who approved it and signed it before me.

SELLER: ............  BUYER: ............  NOTARY: ............`
    },
    {
      id: 'gift-deed',
      group: DEEDS,
      title: { bg: 'Нотариален акт за дарение със запазено право на ползване', en: 'Notarial deed of gift with a reserved right of use' },
      use: { en: 'Parents give a home to a child and keep the right to live in it for life.', bg: 'Родители даряват жилище на дете и запазват правото да живеят в него до края на живота си.' },
      law: 'zzd:225, zs:56, zs:59, zmdt:44:6',
      text: `НОТАРИАЛЕН АКТ
за дарение на недвижим имот със запазено право на ползване

№ [...], том [...], рег. № [...], дело № [...] от [година] г.

Днес, [дата] г., пред мен, [име на нотариуса], нотариус в район на действие Районен съд – [град], рег. № [...] на Нотариалната камара, в кантората ми в гр. [...], се явиха:

1. [Три имена], ЕГН [...], л.к. № [...], изд. на [дата] от МВР – [град], и
2. [Три имена], ЕГН [...], л.к. № [...], изд. на [дата] от МВР – [град], съпрузи, от една страна като ДАРИТЕЛИ, и
3. [Три имена], ЕГН [...], л.к. № [...], изд. на [дата] от МВР – [град], от друга страна като ДАРЕН,

които, след като се убедих в самоличността и дееспособността им, заявиха, че сключват следния договор:

I. ДАРИТЕЛИТЕ даряват на своя син [име] следния свой собствен недвижим имот: [описание по кадастралната карта: вид, идентификатор, адрес, площ, съседи, принадлежности], като си запазват пожизнено и безвъзмездно правото на ползване върху имота, за двамата заедно, а след смъртта на единия от тях – изцяло за преживелия.

II. ДАРЕНИЯТ [име] заяви, че приема дарението с благодарност.

III. Данъчната оценка на имота е [...] евро.

IV. Разноските по дарението са за сметка на [...].

Нотариусът провери, че ДАРИТЕЛИТЕ са собственици на имота и че са налице особените изисквания за сделката, за което бяха представени: [документ за собственост]; [скица/схема]; удостоверение за данъчна оценка по чл. 264, ал. 1 ДОПК; декларации по чл. 25, ал. 8 ЗННД.

Нотариусът разясни на страните, че собствеността преминава веднага, че дарението може да бъде отменено само на основанията по чл. 227 ЗЗД и че то може да бъде намалено при накърняване на запазената част на наследниците.

Този нотариален акт се прочете на страните, които, след като го одобриха, го подписаха пред мен.

ДАРИТЕЛИ: ..................  ..................
ДАРЕН:    ..................
НОТАРИУС: ..................`,
      notes: {
        en: `- **Acceptance.** The recipient must accept the gift ([[zzd:225]]). A parent who donates to a minor cannot accept for the child; the other parent or a special representative does ([[zzd:38]], [[sk:129:2]]).
- **Right of use.** It ends by law at the death of the last holder ([[zs:59]]); the deed should say what happens after the first death.
- **Meet alone.** Elderly donors are met alone ([[znnd:20]]).
- **Tax.** Gifts between relatives in the direct line and spouses are exempt ([[zmdt:44:6]]).
- **Risk for other heirs.** Explain the reduction risk ([[zn:30]]).`,
        bg: `- **Приемане.** Дареният трябва да приеме дарението ([[zzd:225]]). Родител, който дарява на малолетно дете, не може да приеме вместо него; приема другият родител или особен представител ([[zzd:38]], [[sk:129:2]]).
- **Право на ползване.** Погасява се по закон със смъртта на последния ползвател ([[zs:59]]); актът трябва да казва какво става след първата смърт.
- **Среща насаме.** Възрастните дарители се изслушват насаме ([[znnd:20]]).
- **Данък.** Даренията между роднини по права линия и съпрузи са освободени ([[zmdt:44:6]]).
- **Риск за другите наследници.** Разяснете риска от намаляване ([[zn:30]]).`
      },
      en: `NOTARIAL DEED of gift of real estate with a reserved right of use

The DONORS [names], spouses, give to their son [name] the following real estate that they own: [description], and reserve for life and free of charge the right of use, for both of them together and, after the death of one, in full for the survivor.

The RECIPIENT accepts the gift.

The notary explained that ownership passes at once, that the gift can be revoked only on the grounds of Art. 227 of the Obligations and Contracts Act, and that it may be reduced if it infringes the reserved portion of heirs.

[Checks, documents, reading and signatures as in the sale deed.]`
    },
    {
      id: 'mortgage-deed',
      group: DEEDS,
      title: { bg: 'Нотариален акт за учредяване на договорна ипотека', en: 'Notarial deed creating a contractual mortgage' },
      use: { en: 'The buyer\'s bank secures a loan on the property bought.', bg: 'Банката на купувача обезпечава кредит с купения имот.' },
      law: 'zzd:166, zzd:167, zzd:169, zzd:170, tarifa:8',
      text: `НОТАРИАЛЕН АКТ
за учредяване на договорна ипотека

№ [...], том [...], рег. № [...], дело № [...] от [година] г.

Днес, [дата] г., пред мен, [нотариус], се явиха:

1. [Банка] АД, ЕИК [...], със седалище и адрес на управление [...], представлявано от [име], ЕГН [...], в качеството на [пълномощник съгласно пълномощно рег. № [...]], като КРЕДИТОР, и
2. [Три имена], ЕГН [...], с постоянен адрес [...], [занятие], като КРЕДИТОПОЛУЧАТЕЛ и ИПОТЕКАРЕН ДЛЪЖНИК,

които заявиха, че сключват следния договор:

I. За обезпечаване на вземането на КРЕДИТОРА по Договор за кредит № [...] от [дата] за сумата от [сума цифром] ([словом]) евро, ведно с договорната лихва в размер на [...], наказателните лихви, таксите и разноските, с краен срок на погасяване [дата], ИПОТЕКАРНИЯТ ДЛЪЖНИК учредява в полза на КРЕДИТОРА договорна ипотека върху следния свой собствен недвижим имот: [описание].

II. Ипотеката се учредява за сумата от [...] евро.

III. [Други уговорки по искане на банката.]

Нотариусът провери, че ипотекарният длъжник е собственик на имота, за което се представи [документ], и извърши проверка по чл. 264, ал. 1 ДОПК.

Този нотариален акт се прочете на страните, които, след като го одобриха, го подписаха пред мен.

КРЕДИТОР: ..................   ИПОТЕКАРЕН ДЛЪЖНИК: ..................
НОТАРИУС: ..................`,
      notes: {
        en: `- **Required content.** The creditor, the debtor, the owner if different, the property, the secured claim, its maturity and interest ([[zzd:167]]). Uncertainty about these makes the mortgage invalid ([[zzd:170]]).
- **Only by entry.** The mortgage exists from its entry in the property register ([[zzd:166]]); the rank follows the order of entry ([[zzd:169]]).
- **No forfeiture clause.** An agreement that the bank becomes owner on default is invalid ([[zzd:152]]).
- **Fee.** Item 8 on the secured amount ([[znnd:97:1]], [[tarifa:8]]).`,
        bg: `- **Задължително съдържание.** Кредитор, длъжник, собственик, ако е различен, имот, обезпечено вземане, падеж и лихви ([[zzd:167]]). Неопределеност в тях прави ипотеката недействителна ([[zzd:170]]).
- **Само чрез вписване.** Ипотеката възниква с вписването в имотния регистър ([[zzd:166]]); редът следва поредността на вписване ([[zzd:169]]).
- **Без клауза за собственост.** Уговорка, че банката става собственик при неплащане, е недействителна ([[zzd:152]]).
- **Такса.** Т. 8 върху обезпечената сума ([[znnd:97:1]], [[tarifa:8]]).`
      },
      en: `NOTARIAL DEED creating a contractual mortgage

To secure the claim of the CREDITOR [bank, UIC] under loan agreement No. [...] of [date] for [amount] euro, with the agreed interest of [...], penalty interest, fees and costs, final maturity [date], the MORTGAGE DEBTOR [name, personal No., address, occupation] creates in favour of the CREDITOR a contractual mortgage on the following real estate that the debtor owns: [description]. The mortgage is created for [amount] euro.

[Checks, reading and signatures.]`
    },
    {
      id: 'poa-sale',
      group: POA,
      title: { bg: 'Пълномощно за продажба на недвижим имот', en: 'Power of attorney to sell real estate' },
      use: { en: 'An owner who cannot attend authorises another person to sell a specific property. Signature and content are certified at the same time.', bg: 'Собственик, който не може да присъства, упълномощава друго лице да продаде конкретен имот. Подписът и съдържанието се удостоверяват едновременно.' },
      law: 'zzd:37, zzd:38, zzd:39, gpk:590:4, n32:9а, tarifa:4, tarifa:5',
      text: `ПЪЛНОМОЩНО

Долуподписаният [три имена], ЕГН [...], л.к. № [...], изд. на [дата] от МВР – [град], с постоянен адрес [...],

УПЪЛНОМОЩАВАМ

[три имена], ЕГН [...], л.к. № [...], изд. на [дата] от МВР – [град], с постоянен адрес [...],

със следните права:

1. Да продаде от мое име и за моя сметка, на когото намери за добре [или: на [име], ЕГН [...]], на цена не по-ниска от [сума цифром] ([словом]) евро, следния мой собствен недвижим имот: [вид], с идентификатор [...] по кадастралната карта на [град], с адрес [...], с площ [...] кв. м, [принадлежности и идеални части].
2. Да получи продажната цена [само по моята банкова сметка IBAN [...] в [банка]].
3. Да подписва декларациите по чл. 25, ал. 8 и ал. 9 ЗННД, по чл. 264 ДОПК и по Закона за мерките срещу изпирането на пари, както и всички други декларации, необходими за сделката.
4. Да се снабдява с удостоверения, скици, схеми и други документи от всички държавни и общински органи, да плаща такси и данъци и да подава молби за вписване.
5. [Да договаря сам със себе си – чл. 38 ЗЗД.] [Да преупълномощава трети лица – чл. 43 ЗЗД.]

Пълномощното е валидно до [дата].

[Дата], гр. [...]                       УПЪЛНОМОЩИТЕЛ: ..................
                                       ([собственоръчно изписани три имена])

---
Удостоверителен надпис (по одобрения образец):
Удостоверявам подписа на [три имена], ЕГН [...], положен върху този документ, и съдържанието на документа.
Рег. № [...], том [...], № [...] / [дата]. Такса [...] евро.
НОТАРИУС: ..................   (печат)`,
      notes: {
        en: `- **Form.** A power for a deal that needs a notarial deed needs signature and content certified **at the same time** ([[zzd:37]]). Two or more copies; one stays in the book ([[gpk:590:4]]).
- **Real estate.** The principal writes the full name by hand and signs before the notary ([[gpk:589:2]]).
- **Scope.** The agent can do only what the power states ([[zzd:39]]). "To manage" does not cover a sale; a sale does not cover a gift.
- **Self-contracting and re-delegation** need express words ([[zzd:38]], [[zzd:43]]).
- **Information system.** The notary enters the extract at once ([[n32:9а]]).
- **Fee.** 10 лв. per signature ([[tarifa:5]]) plus the content fee ([[tarifa:4]]).`,
        bg: `- **Форма.** Пълномощно за сделка, която изисква нотариален акт, изисква **едновременно** удостоверяване на подписа и съдържанието ([[zzd:37]]). Два или повече екземпляра; единият остава в книгата ([[gpk:590:4]]).
- **Имоти.** Упълномощителят изписва собственоръчно пълното си име и подписва пред нотариуса ([[gpk:589:2]]).
- **Обхват.** Пълномощникът може да извърши само това, което е посочено ([[zzd:39]]). „Да управлява“ не включва продажба; продажба не включва дарение.
- **Договаряне със себе си и преупълномощаване** изискват изрично посочване ([[zzd:38]], [[zzd:43]]).
- **Информационна система.** Нотариусът въвежда извлечението веднага ([[n32:9а]]).
- **Такса.** 10 лв. на подпис ([[tarifa:5]]) плюс таксата за съдържание ([[tarifa:4]]).`
      },
      en: `POWER OF ATTORNEY

I, the undersigned [full name], personal No. [...], identity card No. [...], AUTHORISE [full name], personal No. [...], with the following rights:

1. To sell in my name and for my account, to any person [or: to [name]], at a price not lower than [amount] euro, my real estate: [type], identifier [...], address [...], area [...] m², [accessories].
2. To receive the price [only to my bank account IBAN [...]].
3. To sign the declarations under Art. 25(8) and (9) of the Notaries Act, Art. 264 of the Tax Procedure Code and the anti-money laundering law, and all other declarations needed.
4. To obtain certificates, sketches and schemes, to pay fees and taxes, and to file requests for entry.
5. [To contract with himself – Art. 38 ZZD.] [To re-delegate – Art. 43 ZZD.]

Valid until [date].

Endorsement: I certify the signature of [name] on this document and the content of the document. Reg. No. [...]. NOTARY: ......`
    },
    {
      id: 'poa-bank',
      group: POA,
      title: { bg: 'Пълномощно за представителство пред банка', en: 'Power of attorney for a bank' },
      use: { en: 'A client authorises a relative to manage an account or receive money. The notary certifies the signature.', bg: 'Клиент упълномощава близък да управлява сметка или да получава суми. Нотариусът заверява подписа.' },
      law: 'zzd:36, gpk:589:2, n32:9а, tarifa:5',
      text: `ПЪЛНОМОЩНО

Долуподписаният [три имена], ЕГН [...], л.к. № [...], изд. на [дата] от МВР – [град],

УПЪЛНОМОЩАВАМ

[три имена], ЕГН [...], л.к. № [...], изд. на [дата] от МВР – [град],

да ме представлява пред [банка] АД, ЕИК [...], като от мое име:
1. внася и тегли суми от сметка IBAN [...];
2. получава извлечения и справки по сметката;
3. [закрива сметката / открива депозити];
4. подписва всички необходими документи във връзка с горното.

Пълномощното е валидно до [дата / до изричното му оттегляне].

[Дата], гр. [...]                       УПЪЛНОМОЩИТЕЛ: ..................

---
Удостоверявам подписа върху този документ, положен от [три имена], ЕГН [...].
Рег. № [...] / [дата]. Такса [...] евро.
НОТАРИУС: ..................   (печат)`,
      notes: {
        en: `- **Form.** The law does not set a form, but banks require a notarially certified signature. Many banks have their own wording; ask the client to check with the bank first.
- **Information system.** Extracts of powers for acts before banks go into the system ([[n32:9а]]).
- **At home.** For a bedridden principal, the notary may certify outside the office ([[gpk:573:3]]); add 25% for work outside the office in working hours ([[tarifa:23]]).`,
        bg: `- **Форма.** Законът не изисква форма, но банките изискват нотариална заверка на подписа. Много банки имат свой текст; посъветвайте клиента да провери в банката предварително.
- **Информационна система.** Извлеченията от пълномощни пред банки се въвеждат в системата ([[n32:9а]]).
- **У дома.** При трудноподвижен упълномощител нотариусът може да завери извън кантората ([[gpk:573:3]]); добавя се 25% за действие извън кантората в работно време ([[tarifa:23]]).`
      },
      en: `POWER OF ATTORNEY

I, [full name], AUTHORISE [full name] to represent me before [bank], UIC [...], and in my name: 1. to deposit and withdraw money from account IBAN [...]; 2. to receive statements; 3. [to close the account / open deposits]; 4. to sign all documents needed for the above. Valid until [date / revocation].

Endorsement: I certify the signature on this document, made by [name]. Reg. No. [...]. NOTARY: ......`
    },
    {
      id: 'poa-revocation',
      group: POA,
      title: { bg: 'Оттегляне на пълномощно', en: 'Revocation of a power of attorney' },
      use: { en: 'The principal revokes an earlier power. The revocation goes into the information system at once.', bg: 'Упълномощителят оттегля по-ранно пълномощно. Оттеглянето се въвежда веднага в информационната система.' },
      law: 'zzd:38, zzd:41, n32:9а',
      text: `ОТТЕГЛЯНЕ НА ПЪЛНОМОЩНО

Долуподписаният [три имена], ЕГН [...], л.к. № [...], изд. на [дата] от МВР – [град],

на основание чл. 38 и чл. 41 от Закона за задълженията и договорите

ОТТЕГЛЯМ

пълномощно с [удостоверяване на подписа и съдържанието] рег. № [...] от [дата] на [име на нотариуса], нотариус с рег. № [...] на Нотариалната камара, с което упълномощих [три имена], ЕГН [...].

[Дата], гр. [...]                       УПЪЛНОМОЩИТЕЛ: ..................

---
Удостоверявам подписа [и съдържанието] на този документ.
Рег. № [...] / [дата].
НОТАРИУС: ..................   (печат)`,
      notes: {
        en: `- **Always possible.** The principal can always revoke; a waiver of this right is invalid ([[zzd:38]]).
- **Third persons.** The end of a power cannot be relied upon against third persons in good faith unless it was entered ([[zzd:41]]). Enter the extract with the number and date of the revoked power and the certifying notary ([[n32:9а]]).
- **Next steps.** Send the agent a notarial invitation; inform the bank or the other side; ask for the original back.`,
        bg: `- **Винаги е възможно.** Упълномощителят винаги може да оттегли пълномощното; отказът от това право е недействителен ([[zzd:38]]).
- **Трети лица.** Прекратяването не може да се противопостави на добросъвестни трети лица, освен ако е вписано ([[zzd:41]]). Въведете извлечение с номера и датата на оттегленото пълномощно и заверилия нотариус ([[n32:9а]]).
- **Следващи стъпки.** Изпратете на пълномощника нотариална покана; уведомете банката или другата страна; поискайте оригинала обратно.`
      },
      en: `REVOCATION OF A POWER OF ATTORNEY

I, [full name], under Art. 38 and 41 of the Obligations and Contracts Act, REVOKE the power of attorney reg. No. [...] of [date] certified by [notary], No. [...] of the Notary Chamber, by which I authorised [full name].

Endorsement as for a signature [and content] certification.`
    },
    {
      id: 'decl-25-8',
      group: DECL,
      title: { bg: 'Декларация за гражданство и гражданско състояние (чл. 25, ал. 8 ЗННД)', en: 'Declaration on citizenship and marital status (Art. 25(8) ЗННД)' },
      use: { en: 'Every party to a disposition signs it before the notary. Use the official form approved by the Minister of Justice; this text only shows the content.', bg: 'Всяка страна по разпоредителна сделка я подписва пред нотариуса. Използвайте официалния образец, утвърден от министъра на правосъдието; този текст само показва съдържанието.' },
      law: 'znnd:25:8, sk:18, sk:21',
      text: `ДЕКЛАРАЦИЯ
по чл. 25, ал. 8 от Закона за нотариусите и нотариалната дейност

Долуподписаният/ата [три имена], ЕГН [...], л.к. № [...],

ДЕКЛАРИРАМ, ЧЕ:

1. Гражданство: [българско / друго: ...].
2. Гражданско състояние: [неженен/неомъжена / женен/омъжена за [три имена], ЕГН [...], от [дата] / разведен/а / вдовец/вдовица].
3. Имуществен режим в брака: [законов режим на общност / законов режим на разделност / договорен режим по брачен договор от [дата]].
4. Имотът, предмет на сделката, е придобит [преди брака / по време на брака / по наследство / по дарение].

Известна ми е наказателната отговорност по чл. 313 от Наказателния кодекс за деклариране на неверни данни.

[Дата], гр. [...]                       ДЕКЛАРАТОР: ..................`,
      notes: {
        en: `- **Official form.** The law requires the form approved by the Minister of Justice ([[znnd:25:8]]). Keep the current form in the office and do not retype it.
- **Why it matters.** The answers show whether the property is common ([[sk:21]]) and which regime applies ([[sk:18]]), so whether the spouse must sign.
- **Declarations prove only who signed**, not that the facts are true ([[gpk:180]]); check the facts against the documents.`,
        bg: `- **Официален образец.** Законът изисква образеца, утвърден от министъра на правосъдието ([[znnd:25:8]]). Пазете актуалния образец в кантората и не го преписвайте.
- **Защо е важна.** Отговорите показват дали имотът е общ ([[sk:21]]) и какъв режим се прилага ([[sk:18]]), т.е. дали съпругът трябва да подпише.
- **Декларацията доказва само кой я е подписал**, а не че фактите са верни ([[gpk:180]]); проверявайте фактите по документите.`
      },
      en: `DECLARATION under Art. 25(8) of the Notaries Act

I, [full name], DECLARE THAT: 1. Citizenship: [...]. 2. Marital status: [single / married to [name] since [date] / divorced / widowed]. 3. Matrimonial regime: [community / separation / marriage contract of [date]]. 4. The property was acquired [before the marriage / during the marriage / by inheritance / by gift].

I know the criminal liability under Art. 313 of the Criminal Code for false declarations.`
    },
    {
      id: 'decl-264',
      group: DECL,
      title: { bg: 'Декларация по чл. 264, ал. 4 ДОПК', en: 'Declaration under Art. 264(4) ДОПК (public debts paid from the price)' },
      use: { en: 'The seller has public debts. The seller agrees that they are paid from the price, and the buyer pays them into the budget.', bg: 'Продавачът има публични задължения. Той се съгласява те да се погасят от цената, а купувачът ги внася в бюджета.' },
      law: 'dopk:264:4, dopk:264:5',
      text: `ДЕКЛАРАЦИЯ
по чл. 264, ал. 4 от Данъчно-осигурителния процесуален кодекс

Долуподписаният [три имена], ЕГН [...], в качеството си на продавач по сделка за [продажба] на [описание на имота / превозното средство] с купувач [три имена], ЕГН [...],

ДЕКЛАРИРАМ,

че съм съгласен публичните ми задължения в размер на [сума] евро, установени при проверката по чл. 264, ал. 1 ДОПК [по вид и орган], да бъдат погасени от сумата, която купувачът дължи по сделката, като купувачът внесе дължимата сума в съответния бюджет [по сметка IBAN [...]].

[Дата], гр. [...]                       ДЕКЛАРАТОР: ..................`,
      notes: {
        en: `- **Two options only.** Pay the debts first, or this declaration plus payment by the buyer into the budget ([[dopk:264:4]]).
- **Proof.** Keep the payment order in the case file before the deed.
- **Sanction.** A transfer in breach of the rule cannot be relied upon against the state and the municipality ([[dopk:264:5]]).`,
        bg: `- **Само две възможности.** Задълженията се плащат предварително или се подписва тази декларация и купувачът внася сумата в бюджета ([[dopk:264:4]]).
- **Доказателство.** Пазете платежното нареждане в делото преди акта.
- **Санкция.** Прехвърляне в нарушение на правилото не може да се противопостави на държавата и общината ([[dopk:264:5]]).`
      },
      en: `DECLARATION under Art. 264(4) of the Tax and Social Security Procedure Code

I, [full name], seller in a deal for [description] with buyer [name], DECLARE that I agree my public debts of [amount] euro, found in the check under Art. 264(1), to be paid from the sum the buyer owes under the deal, the buyer paying that sum into the relevant budget.`
    },
    {
      id: 'decl-funds',
      group: DECL,
      title: { bg: 'Декларация за произход на средствата (ЗМИП)', en: 'Declaration on the origin of funds (anti-money laundering)' },
      use: { en: 'The buyer declares where the money for the deal comes from. Use the form of the implementing regulation; this text only shows the content.', bg: 'Купувачът декларира откъде са средствата по сделката. Използвайте образеца от правилника за прилагане; този текст само показва съдържанието.' },
      law: 'zmip:66, zmip:10',
      text: `ДЕКЛАРАЦИЯ
за произход на средствата по чл. 66 от Закона за мерките срещу изпирането на пари

Долуподписаният [три имена], ЕГН [...], л.к. № [...],
[действащ лично / като представител на [дружество], ЕИК [...]],

ДЕКЛАРИРАМ,

че средствата в размер на [сума] евро, с които ще бъде платена цената по сделка за [описание], произхождат от:
[ ] трудови доходи
[ ] продажба на имущество – [описание]
[ ] спестявания
[ ] банков кредит от [банка], договор № [...]
[ ] дарение или наследство от [...]
[ ] друго: [...]

Известна ми е наказателната отговорност по чл. 313 от Наказателния кодекс за деклариране на неверни данни.

[Дата], гр. [...]                       ДЕКЛАРАТОР: ..................`,
      notes: {
        en: `- **Official form.** Use the current form of the regulation under the anti-money laundering law ([[zmip:66]]).
- **Not a formality.** The declaration is part of customer due diligence ([[zmip:10]]). If the answer does not match the client's profile, ask for documents and inform the notary.
- **Records.** Keep it with the AML file for five years (chapter 23).`,
        bg: `- **Официален образец.** Използвайте актуалния образец от правилника за прилагане на ЗМИП ([[zmip:66]]).
- **Не е формалност.** Декларацията е част от комплексната проверка ([[zmip:10]]). Ако отговорът не съответства на профила на клиента, поискайте документи и уведомете нотариуса.
- **Съхранение.** Пазете я в досието по ЗМИП пет години (глава 23).`
      },
      en: `DECLARATION on the origin of funds under Art. 66 of the anti-money laundering law

I, [full name], [acting personally / for [company]], DECLARE that the funds of [amount] euro for the price of [description] come from: [ ] income from work [ ] sale of property [ ] savings [ ] bank loan from [bank] [ ] gift or inheritance [ ] other.`
    },
    {
      id: 'travel-consent',
      group: DECL,
      title: { bg: 'Декларация-съгласие за пътуване на дете в чужбина', en: 'Consent for a child to travel abroad' },
      use: { en: 'A parent who does not travel with the child signs it. The notary certifies the signature.', bg: 'Подписва я родителят, който не пътува с детето. Нотариусът заверява подписа.' },
      law: 'zbld:76, sk:127а, gpk:589:2, tarifa:5',
      text: `ДЕКЛАРАЦИЯ-СЪГЛАСИЕ

Долуподписаният/ата [три имена], ЕГН [...], л.к. № [...], изд. на [дата] от МВР – [град], в качеството си на [майка/баща] на детето

[три имена на детето], ЕГН [...], паспорт № [...], изд. на [дата],

ДЕКЛАРИРАМ,

че давам съгласието си детето ми да пътува [до [държава] / до всички държави в света], [в периода от [дата] до [дата] / многократно до навършване на пълнолетие], [придружавано от [три имена], ЕГН [...] / придружавано от другия родител / самостоятелно].

Съгласен/на съм на детето да бъде издаден паспорт [при нужда].

[Дата], гр. [...]                       ДЕКЛАРАТОР: ..................

---
Удостоверявам подписа върху този документ, положен от [три имена], ЕГН [...].
Рег. № [...] / [дата]. Такса [...] евро.
НОТАРИУС: ..................   (печат)`,
      notes: {
        en: `- **Why.** A minor may be refused exit without the parents' consent ([[zbld:76]]). If the parents disagree, the district court decides ([[sk:127а]]).
- **Any notary.** The parent may sign at any notary or at a Bulgarian consulate ([[gpk:570:2]], [[znnd:84:1]]).
- **Check.** The passport data of the child; the identity of the parent; whether the period and companion are clear.
- **Fee.** Signature without material interest ([[tarifa:5]]).`,
        bg: `- **Защо.** Може да не бъде разрешено напускане на страната от дете без съгласието на родителите ([[zbld:76]]). При разногласие решава районният съд ([[sk:127а]]).
- **Всеки нотариус.** Родителят може да подпише при всеки нотариус или в българско консулство ([[gpk:570:2]], [[znnd:84:1]]).
- **Проверка.** Паспортните данни на детето; самоличността на родителя; ясни период и придружител.
- **Такса.** Подпис без материален интерес ([[tarifa:5]]).`
      },
      en: `CONSENT

I, [full name], [mother/father] of [child's full name], passport No. [...], DECLARE that I consent to my child travelling [to [country] / to all countries], [from [date] to [date] / repeatedly until the age of 18], [accompanied by [name] / by the other parent / alone].

Endorsement: I certify the signature on this document, made by [name]. Reg. No. [...]. NOTARY: ......`
    },
    {
      id: 'decl-pre-emption',
      group: DECL,
      title: { bg: 'Декларация по чл. 33 ЗС (никой съсобственик не прие предложението)', en: 'Declaration under Art. 33 ЗС (no co-owner accepted the offer)' },
      use: { en: 'A co-owner who sells a share of real estate to a third person signs it before the notary, with the proof of the offer.', bg: 'Съсобственик, който продава дела си от имот на трето лице, я подписва пред нотариуса, заедно с доказателството за предложението.' },
      law: 'zs:33',
      text: `ДЕКЛАРАЦИЯ
по чл. 33 от Закона за собствеността

Долуподписаният [три имена], ЕГН [...], съсобственик на [дроб] идеални части от [описание на имота],

ДЕКЛАРИРАМ,

че предложих на останалите съсобственици [три имена] да закупят моите [дроб] идеални части от имота при същите условия – цена [сума] евро, платима [начин], с нотариална покана, връчена на [дата] чрез нотариус [...], рег. № [...], и че никой от тях не прие предложението.

Известна ми е отговорността по чл. 33 ЗС и чл. 313 НК при неистинска декларация.

[Дата], гр. [...]                       ДЕКЛАРАТОР: ..................`,
      notes: {
        en: `- **Proof first.** The co-owner presents written proof of the offer to the notary and declares in writing that nobody accepted ([[zs:33]]).
- **Same terms.** The deed must have the same price and terms as the offer. Different terms in the deed reopen the right of the co-owners.
- **Risk.** If the declaration is false, a co-owner can buy the share out with a claim within two months of the sale ([[zs:33]]).`,
        bg: `- **Първо доказателство.** Съсобственикът представя на нотариуса писмено доказателство за предложението и декларира писмено, че никой не го е приел ([[zs:33]]).
- **Същите условия.** Актът трябва да е при същата цена и условия като предложението. Други условия в акта възстановяват правото на съсобствениците.
- **Риск.** Ако декларацията е неистинска, съсобственик може да изкупи дела с иск в двумесечен срок от продажбата ([[zs:33]]).`
      },
      en: `DECLARATION under Art. 33 of the Property Act

I, [full name], co-owner of [fraction] ideal parts of [property], DECLARE that I offered my share to the other co-owners [names] on the same terms – price [amount] euro, payable [method] – by a notarial invitation delivered on [date] through notary [...], and that none of them accepted the offer.`
    },
    {
      id: 'preliminary',
      group: CONTRACTS,
      title: { bg: 'Предварителен договор за покупко-продажба на недвижим имот', en: 'Preliminary contract for the sale of real estate' },
      use: { en: 'The parties agree the essential terms and a date for the final deed. Notaries often certify the signatures.', bg: 'Страните уговарят съществените условия и срок за окончателния акт. Нотариусите често заверяват подписите.' },
      law: 'zzd:19, zzd:93, zzd:92, tarifa:10',
      text: `ПРЕДВАРИТЕЛЕН ДОГОВОР
за покупко-продажба на недвижим имот

Днес, [дата], в гр. [...], между:
1. [Три имена], ЕГН [...], с адрес [...], наричан ПРОДАВАЧ, и
2. [Три имена], ЕГН [...], с адрес [...], наричан КУПУВАЧ,
се сключи настоящият договор:

1. ПРОДАВАЧЪТ се задължава да продаде на КУПУВАЧА, а КУПУВАЧЪТ се задължава да купи следния недвижим имот: [описание с идентификатор].
2. Цената е [сума] ([словом]) евро.
3. При подписването на договора КУПУВАЧЪТ заплаща на ПРОДАВАЧА задатък в размер на [сума] евро по банкова сметка IBAN [...]. Задатъкът се приспада от цената.
4. Остатъкът от цената в размер на [...] евро се плаща [при подписването на окончателния договор, по специалната сметка на нотариуса / с банков кредит].
5. Окончателният договор във форма на нотариален акт се сключва в срок до [дата] при нотариус [...].
6. ПРОДАВАЧЪТ декларира, че имотът е свободен от тежести, освен [...], и се задължава да не го обременява до сключването на окончателния договор.
7. При неизпълнение от страна на КУПУВАЧА задатъкът остава у ПРОДАВАЧА; при неизпълнение от страна на ПРОДАВАЧА той връща задатъка в двоен размер (чл. 93 ЗЗД).
8. Разноските по окончателния договор са за сметка на [...].

ПРОДАВАЧ: ..................          КУПУВАЧ: ..................`,
      notes: {
        en: `- **Form.** Written form; it must contain the essential terms of the final contract ([[zzd:19]]). Either party can sue for the final contract.
- **Deposit.** Earnest money: the party not at fault may keep it or claim double ([[zzd:93]]). Write the amount and the account.
- **Certified signatures.** Not required, but they prove who signed and when. Fee: item 10, 30% of item 8 ([[tarifa:10]]).
- **Cash.** 10,000 лв. or more only through an account ([[zopvb:3:1]]).`,
        bg: `- **Форма.** Писмена; договорът трябва да съдържа съществените условия на окончателния ([[zzd:19]]). Всяка страна може да предяви иск за сключване на окончателния договор.
- **Задатък.** Изправната страна може да го задържи или да поиска двойния размер ([[zzd:93]]). Посочете сумата и сметката.
- **Заверени подписи.** Не са задължителни, но доказват кой и кога е подписал. Такса: т. 10, 30% от т. 8 ([[tarifa:10]]).
- **В брой.** 10 000 лв. или повече само по сметка ([[zopvb:3:1]]).`
      },
      en: `PRELIMINARY CONTRACT for the sale of real estate

1. The SELLER undertakes to sell and the BUYER undertakes to buy: [property with identifier]. 2. Price: [amount] euro. 3. On signing, the BUYER pays earnest money of [amount] euro to IBAN [...], deducted from the price. 4. The rest is paid [at the final deed, through the notary's special account / by bank loan]. 5. The final contract by notarial deed is concluded by [date] before notary [...]. 6. The SELLER declares the property free of encumbrances except [...] and will not encumber it. 7. If the BUYER fails, the SELLER keeps the deposit; if the SELLER fails, the SELLER returns double (Art. 93 ZZD). 8. Costs of the final contract: [...].`
    },
    {
      id: 'vehicle',
      group: CONTRACTS,
      title: { bg: 'Договор за покупко-продажба на моторно превозно средство', en: 'Contract for the sale of a motor vehicle' },
      use: { en: 'The sale of a registered car. The signatures are notarially certified.', bg: 'Продажба на регистриран автомобил. Подписите се заверяват нотариално.' },
      law: 'zdvp:144, znnd:97:1, znnd:97:3, tarifa:11, dopk:264:2',
      text: `ДОГОВОР
за покупко-продажба на моторно превозно средство

Днес, [дата], в гр. [...], между:
1. [Три имена], ЕГН [...], л.к. № [...], с адрес [...], ПРОДАВАЧ, и
2. [Три имена], ЕГН [...], л.к. № [...], с адрес [...], КУПУВАЧ,
се сключи следният договор:

1. ПРОДАВАЧЪТ продава на КУПУВАЧА следното моторно превозно средство: вид [лек автомобил], марка [...], модел [...], рег. № [...], рама (VIN) № [...], двигател № [...], цвят [...], дата на първа регистрация [...], свидетелство за регистрация част I № [...].
2. Цената е [сума] ([словом]) евро, платена по банкова сметка IBAN [...] на [дата].
3. ПРОДАВАЧЪТ декларира, че автомобилът е негова собственост, не е обременен със залози и запори и не е обявен за издирване.
4. Автомобилът, ключовете и документите се предават на КУПУВАЧА при подписването на договора.
5. Разноските по договора и местният данък са за сметка на [КУПУВАЧА].

Договорът се състави в три еднообразни екземпляра.

ПРОДАВАЧ: ..................          КУПУВАЧ: ..................

---
Удостоверявам подписите върху този документ, положени от [три имена на продавача], ЕГН [...], и [три имена на купувача], ЕГН [...].
Рег. № [...] / [дата]. Такса [...] евро.
НОТАРИУС: ..................   (печат)`,
      notes: {
        en: `- **Certified signatures** are required for registered cars and the other listed vehicles ([[zdvp:144:2]]).
- **Checks.** Vehicle tax paid and no public debts of the seller ([[dopk:264:2]]); spouse's participation for a common car ([[sk:24:5]]).
- **Fee.** Item 11 = item 8 on the insured value, or the price if higher ([[tarifa:11]], [[znnd:97:1]], [[znnd:97:3]]).
- **After.** Scan into the information system ([[n32:9а]]); notice to the municipality within 7 days ([[zmdt:51:2]]); the buyer registers within one month ([[zdvp:145:2]]).`,
        bg: `- **Заверка на подписите** е задължителна за регистрираните автомобили и другите изброени превозни средства ([[zdvp:144:2]]).
- **Проверки.** Платен данък върху превозното средство и липса на публични задължения на продавача ([[dopk:264:2]]); участие на съпруга при общ автомобил ([[sk:24:5]]).
- **Такса.** Т. 11 = т. 8 върху застрахователната стойност или цената, ако е по-висока ([[tarifa:11]], [[znnd:97:1]], [[znnd:97:3]]).
- **След това.** Сканиране в информационната система ([[n32:9а]]); уведомяване на общината в 7-дневен срок ([[zmdt:51:2]]); купувачът регистрира в едномесечен срок ([[zdvp:145:2]]).`
      },
      en: `CONTRACT for the sale of a motor vehicle

1. The SELLER sells to the BUYER: [type, make, model, registration No., VIN, engine No., colour, first registration, registration certificate No.]. 2. Price: [amount] euro, paid to IBAN [...] on [date]. 3. The SELLER declares ownership, no pledges or attachments, not wanted by the police. 4. The car, keys and documents pass on signing. 5. Costs and local tax: [BUYER]. Three identical copies.

Endorsement: I certify the signatures made by [seller] and [buyer]. Reg. No. [...]. NOTARY: ......`
    },
    {
      id: 'share-transfer',
      group: COMPANY,
      title: { bg: 'Договор за прехвърляне на дружествени дялове', en: 'Contract for the transfer of company shares (OOD)' },
      use: { en: 'A partner transfers shares in an OOD. Signatures and content are certified at the same time.', bg: 'Съдружник прехвърля дялове в ООД. Подписите и съдържанието се удостоверяват едновременно.' },
      law: 'tz:129, tz:137:4, gpk:590:4, znnd:90:2',
      text: `ДОГОВОР
за прехвърляне на дружествени дялове

Днес, [дата], в гр. [...], между:
1. [Три имена], ЕГН [...], с адрес [...], ПРЕХВЪРЛИТЕЛ, и
2. [Три имена], ЕГН [...], с адрес [...], ПРИОБРЕТАТЕЛ,
се сключи следният договор:

1. ПРЕХВЪРЛИТЕЛЯТ прехвърля на ПРИОБРЕТАТЕЛЯ [брой] дружествени дяла с номинална стойност [...] евро всеки, общо [...] евро, представляващи [...] % от капитала на „[фирма]“ ООД, ЕИК [...], със седалище и адрес на управление [...].
2. Цената е [сума] евро, платена по банкова сметка IBAN [...].
3. Общото събрание на дружеството прие ПРИОБРЕТАТЕЛЯ за съдружник и даде съгласие за прехвърлянето с решение от [дата], обективирано в протокол с нотариално удостоверяване на подписите и съдържанието рег. № [...].
4. ПРИОБРЕТАТЕЛЯТ декларира, че приема дружествения договор.
5. Страните декларират, че дружеството няма неизплатени изискуеми трудови възнаграждения, обезщетения и задължителни осигурителни вноски по чл. 129, ал. 1 ТЗ.
6. Прехвърлянето има действие след вписването му в Търговския регистър.

Договорът се състави в [три] еднообразни екземпляра.

ПРЕХВЪРЛИТЕЛ: ..................       ПРИОБРЕТАТЕЛ: ..................

---
Удостоверявам подписите на [три имена], ЕГН [...], и [три имена], ЕГН [...], положени върху този документ, и съдържанието на документа.
Рег. № [...], том [...], № [...] / [дата]. Такса [...] евро.
НОТАРИУС: ..................   (печат)`,
      notes: {
        en: `- **Form.** Signatures and content certified at the same time ([[tz:129:2]]); one copy stays in the book ([[gpk:590:4]]). A mayor cannot certify it ([[znnd:83:2]]).
- **Consent.** For a third person: the general meeting admits the partner and consents, by more than three quarters ([[tz:137:3]]), in a certified protocol unless the articles allow written form ([[tz:137:4]]).
- **Wages.** No transfer to a third person while wages or contributions are unpaid; the manager and the transferor sign a declaration on the approved form ([[tz:129:1]], [[tz:129:2]]).
- **Fee.** Ordinary fee ([[znnd:90:2]]).`,
        bg: `- **Форма.** Едновременно удостоверяване на подписите и съдържанието ([[tz:129:2]]); един екземпляр остава в книгата ([[gpk:590:4]]). Кметът не може да го завери ([[znnd:83:2]]).
- **Съгласие.** При трето лице: общото събрание приема съдружника и дава съгласие с мнозинство над три четвърти ([[tz:137:3]]), в удостоверен протокол, освен ако договорът допуска писмена форма ([[tz:137:4]]).
- **Заплати.** Няма прехвърляне на трето лице при неизплатени заплати или вноски; управителят и прехвърлителят подписват декларация по образец ([[tz:129:1]], [[tz:129:2]]).
- **Такса.** Обикновена такса ([[znnd:90:2]]).`
      },
      en: `CONTRACT for the transfer of company shares

1. The TRANSFEROR transfers to the ACQUIRER [number] shares of [...] euro each, [...] % of the capital of "[firm]" OOD, UIC [...]. 2. Price: [amount] euro, paid to IBAN [...]. 3. The general meeting admitted the ACQUIRER and consented by decision of [date], in a protocol with certified signatures and content reg. No. [...]. 4. The ACQUIRER accepts the articles of association. 5. The parties declare that the company has no unpaid wages, compensations or social contributions under Art. 129(1) of the Commerce Act. 6. The transfer takes effect on entry in the Commercial Register.

Endorsement: I certify the signatures of [names] on this document and the content of the document. Reg. No. [...]. NOTARY: ......`
    },
    {
      id: 'manager-consent',
      group: COMPANY,
      title: { bg: 'Съгласие и образец от подписа на управител', en: 'Consent and specimen signature of a manager' },
      use: { en: 'A new manager of an OOD signs it before the notary for the Commercial Register.', bg: 'Нов управител на ООД го подписва пред нотариус за Търговския регистър.' },
      law: 'tz:141:3, tz:142',
      text: `СЪГЛАСИЕ
и образец от подписа

Долуподписаният [три имена], ЕГН [...], л.к. № [...], с адрес [...],

ДЕКЛАРИРАМ,

че съм съгласен да бъда вписан в Търговския регистър като управител на „[фирма]“ ООД, ЕИК [...].

Образец от подписа ми:

1. ..................
2. ..................
3. ..................

[Дата], гр. [...]                       ДЕКЛАРАТОР: ..................

---
Удостоверявам подписите, положени върху този документ от [три имена], ЕГН [...].
Рег. № [...] / [дата]. Такса [...] евро.
НОТАРИУС: ..................   (печат)`,
      notes: {
        en: `- **Legal basis.** The manager's name is entered on a notarially certified consent with a specimen signature ([[tz:141:3]]).
- **Non-compete.** Explain the limits on competing activity without the company's consent ([[tz:142]]).
- **Same pattern** for procurators and board members.`,
        bg: `- **Основание.** Името на управителя се вписва въз основа на нотариално заверено съгласие с образец от подписа ([[tz:141:3]]).
- **Конкуренция.** Разяснете ограниченията за конкурентна дейност без съгласие на дружеството ([[tz:142]]).
- **Същият модел** се използва за прокуристи и членове на съвети.`
      },
      en: `CONSENT and specimen signature

I, [full name], DECLARE that I agree to be entered in the Commercial Register as manager of "[firm]" OOD, UIC [...]. Specimen signature: 1. ...... 2. ...... 3. ......

Endorsement: I certify the signatures on this document made by [name]. Reg. No. [...]. NOTARY: ......`
    },
    {
      id: 'ood-protocol',
      group: COMPANY,
      title: { bg: 'Протокол от общо събрание на ООД', en: 'Protocol of the general meeting of an OOD' },
      use: { en: 'Admission of a new partner, consent to a share transfer and election of a manager. Signatures and content are certified at the same time.', bg: 'Приемане на нов съдружник, съгласие за прехвърляне на дялове и избор на управител. Подписите и съдържанието се удостоверяват едновременно.' },
      law: 'tz:137, tz:137:4, tz:137:5',
      text: `ПРОТОКОЛ
от заседание на общото събрание на съдружниците на „[фирма]“ ООД, ЕИК [...]

Днес, [дата], в гр. [...], се проведе заседание на общото събрание на съдружниците, на което присъстваха:
1. [Три имена], ЕГН [...], притежаващ [...] дяла ([...] % от капитала);
2. [Три имена], ЕГН [...], притежаващ [...] дяла ([...] % от капитала).
Представен е 100 % от капитала. Събранието е редовно.

Дневен ред:
1. Приемане на [три имена], ЕГН [...], за съдружник и съгласие за прехвърляне на [брой] дружествени дяла от [прехвърлител] на него.
2. Освобождаване на [три имена] като управител и избор на [три имена] за управител.
3. Изменение на дружествения договор.

Решения:
По т. 1: Общото събрание приема [три имена] за съдружник и дава съгласие за прехвърлянето. Гласували: „за“ – [...] % от капитала; „против“ – няма.
По т. 2: Общото събрание освобождава [три имена] като управител и избира [три имена] за управител. Гласували: „за“ – [...] %.
По т. 3: [...]

Поради изчерпване на дневния ред събранието беше закрито.

СЪДРУЖНИЦИ: ..................   ..................

---
Удостоверявам подписите на [имена] и съдържанието на този протокол.
Рег. № [...], том [...], № [...] / [дата].
НОТАРИУС: ..................   (печат)`,
      notes: {
        en: `- **Form.** Decisions on admission of partners, capital, election of the manager and real estate need a protocol with signatures and content certified at the same time, unless the articles provide written form ([[tz:137:4]]). Otherwise the decision is null ([[tz:137:5]]).
- **Majority.** Admission and amendments: more than three quarters of the capital ([[tz:137:3]]).
- **Proxies.** Partners vote through an agent only with an express written power ([[tz:137:6]]).`,
        bg: `- **Форма.** Решенията за приемане на съдружници, капитала, избора на управител и имотите изискват протокол с едновременно удостоверяване на подписите и съдържанието, освен ако договорът предвижда писмена форма ([[tz:137:4]]). Иначе решението е нищожно ([[tz:137:5]]).
- **Мнозинство.** Приемане и изменения: повече от три четвърти от капитала ([[tz:137:3]]).
- **Пълномощници.** Съдружниците гласуват чрез представител само с изрично писмено пълномощно ([[tz:137:6]]).`
      },
      en: `PROTOCOL of the general meeting of "[firm]" OOD, UIC [...]

Present: [partner 1, shares, %]; [partner 2, shares, %]. 100 % of the capital is represented.

Agenda and decisions: 1. Admission of [name] as partner and consent to the transfer of [number] shares from [transferor]: adopted with [...] % of the capital. 2. Release of [name] as manager and election of [name]: adopted with [...] %. 3. Amendment of the articles: [...].

Endorsement: I certify the signatures of [names] and the content of this protocol. NOTARY: ......`
    },
    {
      id: 'invitation',
      group: OTHER,
      title: { bg: 'Нотариална покана (предложение към съсобственици)', en: 'Notarial invitation (offer to co-owners)' },
      use: { en: 'A co-owner offers a share to the other co-owners before selling it to a third person. The notary delivers it and records the delivery.', bg: 'Съсобственик предлага дела си на другите съсобственици преди да го продаде на трето лице. Нотариусът я връчва и удостоверява връчването.' },
      law: 'gpk:592, zs:33, znnd:50',
      text: `НОТАРИАЛНА ПОКАНА

ОТ: [три имена], ЕГН [...], с адрес [...]

ДО: [три имена], с адрес за връчване [...]

Уважаеми/а [...],

На основание чл. 33 от Закона за собствеността Ви уведомявам, че желая да продам притежаваните от мен [дроб] идеални части от следния недвижим имот: [описание с идентификатор].

Предлагам Ви да закупите моите идеални части при следните условия:
– цена: [сума] ([словом]) евро;
– начин на плащане: [по банкова сметка при подписване на нотариалния акт];
– срок за сключване на сделката: [...].

Моля, в срок до [дата] да ми отговорите писмено на адреса по-горе дали приемате предложението. Ако не получа отговор в този срок, ще смятам, че не го приемате.

[Дата], гр. [...]                       С уважение: ..................

---
[Отбелязване на нотариуса за връчването:]
Поканата е връчена на [име / лице по чл. 46 ГПК] на [дата] в [час] на адрес [...] чрез [връчител].
НОТАРИУС: ..................`,
      notes: {
        en: `- **Three copies.** The applicant presents the invitation in three identical copies; the notary records the delivery on each ([[gpk:592]]).
- **Delivery.** The notary's employee delivers it ([[znnd:50]]) and records it in the delivery book ([[n32:4:1]]).
- **Term.** Article 33 ЗС sets no term for the answer. Give a reasonable term and write it in the invitation.
- **Same terms.** The later deed with a third person must have the same price and terms ([[zs:33]]).`,
        bg: `- **Три екземпляра.** Молителят представя поканата в три еднообразни екземпляра; нотариусът отбелязва връчването върху всеки ([[gpk:592]]).
- **Връчване.** Връчва служител на нотариуса ([[znnd:50]]), който отбелязва връчването в разносната книга ([[n32:4:1]]).
- **Срок.** Чл. 33 ЗС не определя срок за отговор. Дайте разумен срок и го посочете в поканата.
- **Същите условия.** По-късният акт с трето лице трябва да е при същата цена и условия ([[zs:33]]).`
      },
      en: `NOTARIAL INVITATION

FROM: [name, address]. TO: [name, address for delivery].

Under Art. 33 of the Property Act, I inform you that I wish to sell my [fraction] ideal parts of [property]. I offer them to you on these terms: price [amount] euro; payment [method]; date of the deal [...]. Please answer in writing by [date]. Without an answer by that date, I will consider that you do not accept.

[Notary's record of delivery: delivered to [name] on [date] at [time] at [address] by [server].]`
    },
    {
      id: 'mortgage-deletion',
      group: OTHER,
      title: { bg: 'Съгласие за заличаване на ипотека', en: 'Consent to delete a mortgage' },
      use: { en: 'The creditor bank consents to the deletion of a mortgage after the loan is repaid. The notary certifies the signature.', bg: 'Банката кредитор дава съгласие за заличаване на ипотека след погасяване на кредита. Нотариусът заверява подписа.' },
      law: 'zzd:179, tarifa:12',
      text: `СЪГЛАСИЕ
за заличаване на ипотека

[Банка] АД, ЕИК [...], със седалище и адрес на управление [...], представлявано от [три имена], ЕГН [...], в качеството на [пълномощник съгласно пълномощно рег. № [...]],

в качеството си на кредитор по договорна ипотека, учредена с нотариален акт № [...], том [...], рег. № [...], дело № [...] от [дата] на нотариус [...], вписан в Служба по вписванията – [град] с вх. рег. № [...] от [дата], акт № [...], том [...], дело № [...], върху следния недвижим имот: [описание], за обезпечаване на вземане в размер на [...] евро,

ДАВА СЪГЛАСИЕТО СИ

вписаната ипотека да бъде заличена, тъй като обезпеченото вземане е изцяло погасено.

[Дата], гр. [...]                       ЗА БАНКАТА: ..................

---
Удостоверявам подписа върху този документ, положен от [три имена], ЕГН [...], в качеството на [...] на [банка] АД.
Рег. № [...] / [дата]. Такса [...] евро.
НОТАРИУС: ..................   (печат)`,
      notes: {
        en: `- **Form.** The creditor's consent must be in notarially certified form; the deletion is made on a request with the consent attached ([[zzd:179]]).
- **Representation.** Check the bank's representative and power in the Commercial Register and the power of attorney.
- **Fee.** Item 12: half of item 10, at least 25 лв. ([[tarifa:12]]). The registry office charges half of the entry fee.`,
        bg: `- **Форма.** Съгласието на кредитора трябва да е с нотариална заверка; заличаването се извършва по молба с приложено съгласие ([[zzd:179]]).
- **Представителство.** Проверете представителя на банката и пълномощното в Търговския регистър.
- **Такса.** Т. 12: половината от т. 10, но не по-малко от 25 лв. ([[tarifa:12]]). Службата по вписванията събира половината от таксата за вписване.`
      },
      en: `CONSENT to delete a mortgage

[Bank], UIC [...], represented by [name], as creditor under the contractual mortgage created by notarial deed No. [...] of [date], entered in the registry office of [town] under No. [...], over [property], securing [amount] euro, CONSENTS to the deletion of the entered mortgage, because the secured claim is fully repaid.

Endorsement: I certify the signature of [name], as [...] of [bank]. NOTARY: ......`
    },
    {
      id: 'will-envelope',
      group: WILLS,
      title: { bg: 'Протокол върху плик със саморъчно завещание', en: 'Protocol on the envelope of a deposited holographic will' },
      use: { en: 'A testator hands a holographic will to the notary in a closed envelope. The notary writes the protocol on the envelope itself.', bg: 'Завещател предава саморъчно завещание на нотариуса в затворен плик. Нотариусът съставя протокола върху самия плик.' },
      law: 'zn:25:2, n32:9:1, n32:21:3, n32:9а, tarifa:1',
      text: `ПРОТОКОЛ

Днес, [дата], аз, [име на нотариуса], нотариус с рег. № [...] на Нотариалната камара, с район на действие Районен съд – [град], приех за пазене от [три имена], ЕГН [...], л.к. № [...], изд. на [дата] от МВР – [град], настоящия затворен плик, за който лицето заяви, че съдържа неговото саморъчно завещание.

Пликът е [запечатан / залепен], без видими повреди.

Предаването е записано в регистъра за саморъчните завещания под № [...], нотариално дело № [...], общ регистър рег. № [...].

ПРЕДАЛ: ..................             НОТАРИУС: ..................`,
      notes: {
        en: `- **On the envelope.** The protocol is written on the envelope itself and signed by the person who presented it and by the notary ([[zn:25:2]]).
- **Do not open.** The notary does not read the will or check its validity.
- **Deadlines.** Register entry ([[n32:9:1]]); written notice of the testator's name to the registration judge within 3 days ([[n32:21:3]]); name and personal number into the information system ([[n32:9а]]).
- **Return.** Only to the testator personally, with two witnesses ([[zn:26]]).`,
        bg: `- **Върху плика.** Протоколът се съставя върху самия плик и се подписва от лицето, което го е представило, и от нотариуса ([[zn:25:2]]).
- **Не се отваря.** Нотариусът не чете завещанието и не проверява валидността му.
- **Срокове.** Запис в регистъра ([[n32:9:1]]); писмено уведомяване на съдията по вписванията за името на завещателя в 3-дневен срок ([[n32:21:3]]); име и ЕГН в информационната система ([[n32:9а]]).
- **Връщане.** Само лично на завещателя, с двама свидетели ([[zn:26]]).`
      },
      en: `PROTOCOL

Today, [date], I, [notary], No. [...] of the Notary Chamber, accepted for safekeeping from [name, personal No., ID] this closed envelope, which the person stated contains the person's holographic will. The envelope is [sealed / glued], without visible damage. Entered in the register of holographic wills under No. [...], case file No. [...].

HANDED OVER: ......  NOTARY: ......`
    },
    {
      id: 'will-announcement',
      group: WILLS,
      title: { bg: 'Протокол за обявяване на саморъчно завещание', en: 'Protocol of announcement of a holographic will' },
      use: { en: 'After the testator\'s death, the notary opens and announces the will.', bg: 'След смъртта на завещателя нотариусът разпечатва и обявява завещанието.' },
      law: 'zn:27, n32:9:1, tarifa:2, tarifa:9',
      text: `ПРОТОКОЛ
за обявяване на саморъчно завещание

Днес, [дата], аз, [име на нотариуса], нотариус с рег. № [...] на Нотариалната камара, по молба на [три имена], ЕГН [...], който/която представи [препис-извлечение от акт за смърт № [...] от [дата]] на [три имена на завещателя], ЕГН [...], починал/а на [дата],

ОБЯВЯВАМ

саморъчното завещание на [три имена на завещателя], [предадено за пазене при мен на [дата] / представено от молителя].

Състояние на завещанието: [пликът е запечатан, без повреди; завещанието е написано на [брой] листа, със син химикал, без зачерквания и добавки / описание на особеностите]. Пликът беше разпечатан в присъствието на молителя.

Завещанието се прилага към този протокол и се приподписва на всяка страница от молителя и от нотариуса.

Обявяването е отбелязано в регистъра за саморъчните завещания под № [...].

МОЛИТЕЛ: ..................             НОТАРИУС: ..................`,
      notes: {
        en: `- **Who.** The notary who keeps the deposited will announces it ([[zn:27:4]]). A person who holds a will must ask for its announcement as soon as he learns of the death ([[zn:27:1]]).
- **Content.** The protocol describes the condition of the will and records its opening; the will is attached and countersigned on every page ([[zn:27:3]]).
- **Register.** Record the date of the announcement and of each copy ([[n32:9:1]]).
- **Fees.** Item 2 for the announcement; item 1 too if the notary did not keep the will ([[tarifa:2]]); the first copy under item 9 ([[tarifa:9]]).`,
        bg: `- **Кой.** Обявява нотариусът, при когото е предадено завещанието ([[zn:27:4]]). Лицето, у което се намира завещание, трябва да поиска обявяването му веднага след като узнае за смъртта ([[zn:27:1]]).
- **Съдържание.** Протоколът описва състоянието на завещанието и отбелязва разпечатването; завещанието се прилага и се приподписва на всяка страница ([[zn:27:3]]).
- **Регистър.** Отбележете датата на обявяването и на всеки препис ([[n32:9:1]]).
- **Такси.** Т. 2 за обявяването; и т. 1, ако нотариусът не е пазил завещанието ([[tarifa:2]]); първият препис по т. 9 ([[tarifa:9]]).`
      },
      en: `PROTOCOL of announcement of a holographic will

Today, [date], I, [notary], at the request of [name], who presented [the death certificate of [testator], died on [date]], ANNOUNCE the holographic will of [testator], [deposited with me on [date] / presented by the applicant]. Condition: [envelope sealed and undamaged; [number] sheets, blue pen, no deletions / peculiarities]. The envelope was opened in the applicant's presence. The will is attached and countersigned on every page. Recorded in the register under No. [...].

APPLICANT: ......  NOTARY: ......`
    },
    {
      id: 'deposit-protocol',
      group: OTHER,
      title: { bg: 'Приемателен протокол за документи, предадени за съхранение', en: 'Protocol of acceptance of documents for safekeeping' },
      use: { en: 'A client leaves documents or papers with the notary for safekeeping.', bg: 'Клиент оставя документи или книжа на съхранение при нотариуса.' },
      law: 'gpk:594, n32:9:2, tarifa:1, tarifa:2',
      text: `ПРИЕМАТЕЛЕН ПРОТОКОЛ

Днес, [дата], аз, [име на нотариуса], нотариус с рег. № [...] на Нотариалната камара, приех на съхранение от [три имена], ЕГН [...], л.к. № [...], следните документи и книжа:

1. [описание: вид, дата, брой листа, оригинал/препис];
2. [...].

Документите [ще бъдат върнати на молителя / ще бъдат предадени на [три имена], ЕГН [...]] [при следните условия: ...].

Протоколът се състави в два еднообразни екземпляра – един за молителя и един за нотариуса.

Записано в регистъра под № [...], нотариално дело № [...].

МОЛИТЕЛ: ..................             НОТАРИУС: ..................`,
      notes: {
        en: `- **Two copies.** The protocol is made in two identical copies signed by the applicant and the notary; one stays with the notary ([[gpk:594]]).
- **Register.** The acceptance and the return are recorded with the case file and register numbers, and to whom the documents were returned ([[n32:9:2]]).
- **Fees.** Acceptance under item 1; return under item 2 ([[tarifa:1]], [[tarifa:2]]).`,
        bg: `- **Два екземпляра.** Протоколът се съставя в два еднообразни екземпляра, подписани от молителя и нотариуса; единият остава при нотариуса ([[gpk:594]]).
- **Регистър.** Приемането и връщането се записват с номерата на делото и регистъра и с данни на кого са върнати документите ([[n32:9:2]]).
- **Такси.** Приемане по т. 1; връщане по т. 2 ([[tarifa:1]], [[tarifa:2]]).`
      },
      en: `PROTOCOL OF ACCEPTANCE

Today, [date], I, [notary], accepted for safekeeping from [name, personal No., ID] the following documents: 1. [description]; 2. [...]. The documents [will be returned to the applicant / handed to [name]] [on these conditions: ...]. Two identical copies. Recorded under No. [...].

APPLICANT: ......  NOTARY: ......`
    }
  ]);
})();
