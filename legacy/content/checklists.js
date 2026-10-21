/* Document checklists: what to ask the client for and what the office checks, for each common file. */
(function () {
  const S = (en, bg) => ({ en, bg });

  NC.setChecklists([
    {
      id: 'sale-flat',
      chapter: 'sale',
      title: S('Sale of an apartment', 'Продажба на апартамент'),
      when: S('A notarial deed of sale of a flat or another separate object in a building.', 'Нотариален акт за продажба на апартамент или друг самостоятелен обект в сграда.'),
      sections: [
        { title: S('First call', 'Първо обаждане'), items: [
          S('The flat is in the district of this notary ([[gpk:570:1]]).', 'Апартаментът е в района на този нотариус ([[gpk:570:1]]).'),
          S('How and when the seller acquired it; during a marriage?', 'Как и кога продавачът го е придобил; по време на брак?'),
          S('All sellers and buyers: married, minors, companies, foreigners, agents?', 'Всички продавачи и купувачи: в брак, непълнолетни, дружества, чужденци, пълномощници?'),
          S('Mortgage on the flat? Will the buyer use a bank loan?', 'Има ли ипотека? Ще ползва ли купувачът банков кредит?'),
          S('Price and payment method agreed; preliminary contract?', 'Уговорени цена и начин на плащане; има ли предварителен договор?')
        ] },
        { title: S('Documents from the seller', 'Документи от продавача'), items: [
          S('Identity document of each seller.', 'Документ за самоличност на всеки продавач.'),
          S('Document of ownership, **entered** in the property register ([[gpk:586:4]]).', 'Документ за собственост, **вписан** в имотния регистър ([[gpk:586:4]]).'),
          S('Certificate of tax assessment under [[dopk:264:1]].', 'Удостоверение за данъчна оценка по [[dopk:264:1]].'),
          S('Scheme of the flat from the cadastre ([[zkir:77]]).', 'Схема на самостоятелния обект от кадастъра ([[zkir:77]]).'),
          S('For inherited property: certificate of heirs, deed of the deceased, any will.', 'За наследен имот: удостоверение за наследници, акт на наследодателя, завещание.'),
          S('For a share sold to a third person: proof of the offer to the co-owners ([[zs:33]]).', 'При продажба на дял на трето лице: доказателство за предложението до съсобствениците ([[zs:33]]).'),
          S('For a minor\'s property: final court permission ([[sk:130:3]]).', 'За имот на дете: влязло в сила разрешение на съда ([[sk:130:3]]).'),
          S('For an agent: power with signature and content certified at the same time ([[zzd:37]]).', 'За пълномощник: пълномощно с едновременно удостоверяване на подписа и съдържанието ([[zzd:37]]).'),
          S('For a company: current status and decision of the general meeting or the owner.', 'За дружество: актуално състояние и решение на общото събрание или собственика.')
        ] },
        { title: S('Documents from the buyer', 'Документи от купувача'), items: [
          S('Identity document.', 'Документ за самоличност.'),
          S('Anti-money laundering declarations: origin of funds, political exposure ([[zmip:66]]).', 'Декларации по ЗМИП: произход на средствата, видна политическа личност ([[zmip:66]]).'),
          S('Bank documents and the mortgage draft, if there is a loan.', 'Документите на банката и проектът за ипотека, ако има кредит.'),
          S('Proof that the local tax is paid ([[zmdt:50:1]]).', 'Документ за платен местен данък ([[zmdt:50:1]]).')
        ] },
        { title: S('Checks by the office', 'Проверки от кантората'), items: [
          S('Security measures under the law on illegally acquired assets ([[znnd:25:2]]).', 'Обезпечителни мерки по закона за отнемане на незаконно придобито имущество ([[znnd:25:2]]).'),
          S('Identity registers: population database and identity documents (notary or assistant) ([[znnd:25:3]]).', 'Регистрите за самоличност: НБД „Население“ и личните документи (нотариус или помощник) ([[znnd:25:3]]).'),
          S('Public debts of each seller at the National Revenue Agency ([[dopk:264:1]]).', 'Публичните задължения на всеки продавач в НАП ([[dopk:264:1]]).'),
          S('Property register: mortgages, distraints, claims, the chain of ownership.', 'Имотния регистър: ипотеки, възбрани, искови молби, веригата на собствеността.'),
          S('Information system: powers of attorney and revocations ([[n32:9а]]).', 'Информационната система: пълномощни и оттегляния ([[n32:9а]]).'),
          S('Marital status: common property means both spouses sign ([[sk:24:3]]).', 'Гражданското състояние: общото имущество означава, че подписват двамата съпрузи ([[sk:24:3]]).')
        ] },
        { title: S('Signing day', 'Денят на подписването'), items: [
          S('Draft checked against the identity documents and the scheme; numbers in words ([[gpk:578:3]]).', 'Проектът е сверен с документите за самоличност и схемата; числата са словом ([[gpk:578:3]]).'),
          S('Declarations on citizenship and marital status signed ([[znnd:25:8]]).', 'Подписани декларации за гражданство и гражданско състояние ([[znnd:25:8]]).'),
          S('Actual price declared in the deed ([[znnd:25:9]]).', 'Декларирана в акта действителна цена ([[znnd:25:9]]).'),
          S('Payment through the special account or a bank account above 10,000 лв. ([[znnd:25:10]]).', 'Плащане по специалната сметка или по банкова сметка над 10 000 лв. ([[znnd:25:10]]).'),
          S('Bill issued ([[znnd:89]]).', 'Издадена сметка ([[znnd:89]]).')
        ] },
        { title: S('After the signing', 'След подписването'), items: [
          S('Deed presented for entry the same day: four copies, request in two copies, entry fee ([[znnd:25:5]], [[n32:21:1]]).', 'Актът е представен за вписване в същия ден: четири екземпляра, молба в два екземпляра, такса ([[znnd:25:5]], [[n32:21:1]]).'),
          S('Copies to the parties only after the entry.', 'Преписи на страните само след вписването.'),
          S('Notice to the municipality within 7 days ([[zmdt:51:2]]).', 'Уведомление до общината в 7-дневен срок ([[zmdt:51:2]]).'),
          S('Payment from the special account under the agreement.', 'Плащане от специалната сметка според споразумението.'),
          S('Case file complete: request, declarations, proof of representation, bill ([[n32:11]]).', 'Пълно дело: молба, декларации, документи за представителство, сметка ([[n32:11]]).')
        ] }
      ]
    },
    {
      id: 'gift',
      chapter: 'property-deals',
      title: S('Gift of real estate', 'Дарение на имот'),
      when: S('A notarial deed of gift, with or without a reserved right of use.', 'Нотариален акт за дарение със или без запазено право на ползване.'),
      sections: [
        { title: S('Before the appointment', 'Преди срещата'), items: [
          S('Relationship between donor and recipient: it decides the tax ([[zmdt:44:6]], [[zmdt:47:1]]).', 'Отношението между дарителя и надарения: то определя данъка ([[zmdt:44:6]], [[zmdt:47:1]]).'),
          S('Is the property common? Both spouses donate ([[sk:24:3]]).', 'Общ ли е имотът? Даряват двамата съпрузи ([[sk:24:3]]).'),
          S('Is the recipient a minor? Who accepts ([[zzd:38]], [[sk:129:2]])?', 'Непълнолетен ли е надареният? Кой приема ([[zzd:38]], [[sk:129:2]])?'),
          S('Reserved right of use: for whom, and after the first death?', 'Запазено право на ползване: за кого и какво след първата смърт?')
        ] },
        { title: S('Documents', 'Документи'), items: [
          S('Identity documents of all parties.', 'Документи за самоличност на всички страни.'),
          S('Entered document of ownership.', 'Вписан документ за собственост.'),
          S('Tax assessment ([[dopk:264:1]]) and sketch or scheme ([[zkir:77]]).', 'Данъчна оценка ([[dopk:264:1]]) и скица или схема ([[zkir:77]]).'),
          S('Proof of kinship if the tax exemption applies (for example birth certificate).', 'Доказателство за родство, ако се прилага освобождаване от данък (например удостоверение за раждане).'),
          S('Declarations under [[znnd:25:8]].', 'Декларации по [[znnd:25:8]].')
        ] },
        { title: S('On the day', 'В деня на акта'), items: [
          S('Elderly donors met alone ([[znnd:20]]).', 'Възрастните дарители са изслушани насаме ([[znnd:20]]).'),
          S('Consequences explained: immediate transfer, limited revocation ([[zzd:227]]), reduction risk ([[zn:30]]).', 'Разяснени последици: незабавно прехвърляне, ограничена отмяна ([[zzd:227]]), риск от намаляване ([[zn:30]]).'),
          S('Public-debt check of the donors ([[dopk:264:1]]).', 'Проверка за публични задължения на дарителите ([[dopk:264:1]]).'),
          S('Entry the same day; notice to the municipality within 7 days.', 'Вписване в същия ден; уведомление до общината в 7-дневен срок.')
        ] }
      ]
    },
    {
      id: 'mortgage',
      chapter: 'property-deals',
      title: S('Mortgage for a bank loan', 'Ипотека за банков кредит'),
      when: S('A notarial deed of contractual mortgage, often on the same day as a sale.', 'Нотариален акт за договорна ипотека, често в деня на продажбата.'),
      sections: [
        { title: S('From the bank', 'От банката'), items: [
          S('Draft deed and the loan agreement number and terms.', 'Проект на акта и номер и условия на договора за кредит.'),
          S('Power of attorney of the bank\'s representative; check it in the information system ([[n32:9а]]).', 'Пълномощно на представителя на банката; проверка в информационната система ([[n32:9а]]).'),
          S('For an old mortgage: the consent to delete it in certified form ([[zzd:179]]).', 'За стара ипотека: съгласие за заличаване с нотариална заверка ([[zzd:179]]).')
        ] },
        { title: S('Content of the deed', 'Съдържание на акта'), items: [
          S('Creditor, debtor, owner if different, property, claim, maturity, interest ([[zzd:167]]).', 'Кредитор, длъжник, собственик, ако е различен, имот, вземане, падеж, лихви ([[zzd:167]]).'),
          S('No clause making the bank owner on default ([[zzd:152]]).', 'Няма клауза банката да става собственик при неплащане ([[zzd:152]]).'),
          S('Owner is the person who creates the mortgage at the date of the deed ([[zzd:167]]).', 'Ипотекарният длъжник е собственик към датата на акта ([[zzd:167]]).')
        ] },
        { title: S('Entry', 'Вписване'), items: [
          S('Order on the day: deletion of the old mortgage, sale, new mortgage ([[zzd:169]]).', 'Ред в деня: заличаване на старата ипотека, продажба, нова ипотека ([[zzd:169]]).'),
          S('Public-debt check of the mortgage debtor ([[dopk:264:1]]).', 'Проверка за публични задължения на ипотекарния длъжник ([[dopk:264:1]]).'),
          S('Fee on the secured amount ([[znnd:97:1]]).', 'Такса върху обезпечената сума ([[znnd:97:1]]).')
        ] }
      ]
    },
    {
      id: 'vehicle',
      chapter: 'vehicles',
      title: S('Sale of a car', 'Продажба на автомобил'),
      when: S('Certification of signatures on a contract for a registered car or other listed vehicle.', 'Заверка на подписите по договор за регистриран автомобил или друго изброено МПС.'),
      sections: [
        { title: S('Documents', 'Документи'), items: [
          S('Identity documents of seller and buyer.', 'Документи за самоличност на продавача и купувача.'),
          S('Registration certificate, parts I and II.', 'Свидетелство за регистрация, части I и II.'),
          S('The other spouse\'s participation or power for a common car ([[sk:24:5]]).', 'Участие или пълномощно на другия съпруг при общ автомобил ([[sk:24:5]]).'),
          S('Insured value of the vehicle ([[znnd:97:1]]).', 'Застрахователна стойност на автомобила ([[znnd:97:1]]).'),
          S('Contract in three identical copies.', 'Договор в три еднообразни екземпляра.')
        ] },
        { title: S('Checks', 'Проверки'), items: [
          S('Vehicle tax paid and no public debts of the seller ([[dopk:264:2]]).', 'Платен данък върху МПС и липса на публични задължения на продавача ([[dopk:264:2]]).'),
          S('VIN and data match the registration certificate.', 'Номерът на рамата и данните съвпадат със свидетелството за регистрация.'),
          S('Buyer without a Bulgarian address: registration terminated first ([[zdvp:144:3]]).', 'Купувач без адрес в България: първо се прекратява регистрацията ([[zdvp:144:3]]).'),
          S('Price of 10,000 лв. or more paid through an account ([[zopvb:3:1]]).', 'Цена от 10 000 лв. или повече се плаща по сметка ([[zopvb:3:1]]).')
        ] },
        { title: S('After the certification', 'След заверката'), items: [
          S('Scan into the information system; copy kept two years ([[n32:9а]]).', 'Сканиране в информационната система; копие се пази две години ([[n32:9а]]).'),
          S('Notice to the municipality within 7 days ([[zmdt:51:2]]).', 'Уведомление до общината в 7-дневен срок ([[zmdt:51:2]]).'),
          S('Tell the buyer: registration within one month ([[zdvp:145:2]]) and civil liability insurance.', 'Кажете на купувача: регистрация в едномесечен срок ([[zdvp:145:2]]) и застраховка „Гражданска отговорност“.')
        ] }
      ]
    },
    {
      id: 'poa',
      chapter: 'poa',
      title: S('Power of attorney', 'Пълномощно'),
      when: S('Certification of a power of attorney, from a simple bank power to a power to sell real estate.', 'Заверка на пълномощно – от обикновено пълномощно за банка до пълномощно за продажба на имот.'),
      sections: [
        { title: S('Form', 'Форма'), items: [
          S('What deal does the power serve? Same form as the deal ([[zzd:37]]).', 'За каква сделка е пълномощното? Същата форма като сделката ([[zzd:37]]).'),
          S('Real estate deed: signature and content at the same time, two or more copies ([[gpk:590:4]]).', 'Нотариален акт за имот: едновременно удостоверяване на подписа и съдържанието, два или повече екземпляра ([[gpk:590:4]]).'),
          S('Not allowed for a marriage contract or a will ([[sk:39:1]], [[zn:24]]).', 'Не се допуска за брачен договор и завещание ([[sk:39:1]], [[zn:24]]).')
        ] },
        { title: S('Content', 'Съдържание'), items: [
          S('Full identity data of principal and agent.', 'Пълни данни на упълномощителя и пълномощника.'),
          S('Property by identifier; type of deal; minimum price; account for the price.', 'Имот с идентификатор; вид сделка; минимална цена; сметка за цената.'),
          S('Self-contracting and re-delegation only if intended ([[zzd:38]], [[zzd:43]]).', 'Договаряне със себе си и преупълномощаване само ако са желани ([[zzd:38]], [[zzd:43]]).'),
          S('Term, if any.', 'Срок, ако има.')
        ] },
        { title: S('Procedure', 'Процедура'), items: [
          S('Principal appears personally; writes the full name for real estate ([[gpk:589:2]]).', 'Упълномощителят се явява лично; за имоти изписва пълното си име ([[gpk:589:2]]).'),
          S('Capacity and free will checked; meet alone if needed ([[znnd:20]]).', 'Проверени дееспособност и свободна воля; среща насаме при нужда ([[znnd:20]]).'),
          S('Extract entered in the information system at once ([[n32:9а]]).', 'Извлечението е въведено веднага в информационната система ([[n32:9а]]).'),
          S('Fee: signature ([[tarifa:5]]) plus content ([[tarifa:4]]).', 'Такса: подпис ([[tarifa:5]]) плюс съдържание ([[tarifa:4]]).')
        ] }
      ]
    },
    {
      id: 'share-transfer',
      chapter: 'company',
      title: S('Transfer of OOD shares', 'Прехвърляне на дялове в ООД'),
      when: S('A partner sells shares to another partner or to a third person.', 'Съдружник продава дялове на друг съдружник или на трето лице.'),
      sections: [
        { title: S('Before', 'Преди'), items: [
          S('Current status and articles of association read ([[ztr:11:1]]).', 'Прочетени актуално състояние и дружествен договор ([[ztr:11:1]]).'),
          S('Third person: general meeting admits and consents, more than 3/4 ([[tz:137:3]]).', 'Трето лице: общото събрание приема и дава съгласие с над 3/4 ([[tz:137:3]]).'),
          S('Protocol with signatures and content certified, unless the articles allow written form ([[tz:137:4]]).', 'Протокол с удостоверени подписи и съдържание, освен ако договорът допуска писмена форма ([[tz:137:4]]).'),
          S('No unpaid wages or contributions; declaration on the form ([[tz:129:1]], [[tz:129:2]]).', 'Няма неизплатени заплати и вноски; декларация по образец ([[tz:129:1]], [[tz:129:2]]).')
        ] },
        { title: S('The contract', 'Договорът'), items: [
          S('Signatures and content at the same time, two or more copies ([[tz:129:2]]).', 'Едновременно удостоверяване на подписите и съдържанието, два или повече екземпляра ([[tz:129:2]]).'),
          S('Beneficial owners and origin of funds ([[zmip:59]], [[zmip:66]]).', 'Действителни собственици и произход на средствата ([[zmip:59]], [[zmip:66]]).'),
          S('Price of 10,000 лв. or more through an account ([[zopvb:3:1]]).', 'Цена от 10 000 лв. или повече по сметка ([[zopvb:3:1]]).'),
          S('Ordinary fee ([[znnd:90:2]]).', 'Обикновена такса ([[znnd:90:2]]).')
        ] },
        { title: S('After', 'След това'), items: [
          S('Extract in the information system ([[n32:9а]]).', 'Извлечение в информационната система ([[n32:9а]]).'),
          S('Filing to the Commercial Register within 7 days ([[ztr:6]]).', 'Заявление до Търговския регистър в 7-дневен срок ([[ztr:6]]).'),
          S('New manager: certified consent with specimen signature ([[tz:141:3]]).', 'Нов управител: заверено съгласие с образец от подписа ([[tz:141:3]]).')
        ] }
      ]
    },
    {
      id: 'inherited-sale',
      chapter: 'succession',
      title: S('Sale of inherited property', 'Продажба на наследен имот'),
      when: S('Heirs sell real estate of a deceased person.', 'Наследници продават имот на починал.'),
      sections: [
        { title: S('Who owns what', 'Кой какво притежава'), items: [
          S('Certificate of heirs from the municipality of the last address.', 'Удостоверение за наследници от общината по последния адрес.'),
          S('Was the property common with a surviving spouse? Half is the spouse\'s already ([[sk:21]]).', 'Общ ли е бил имотът с преживелия съпруг? Половината вече е негова ([[sk:21]]).'),
          S('Shares: children equally, spouse like a child ([[zn:5]], [[zn:9]]).', 'Дялове: децата по равно, съпругът като дете ([[zn:5]], [[zn:9]]).'),
          S('Any will: announced, and entered if it concerns real estate ([[pv:4]]).', 'Завещание: обявено и вписано, ако се отнася до имот ([[pv:4]]).'),
          S('Renunciations: certificate from the district court.', 'Откази: удостоверение от районния съд.')
        ] },
        { title: S('Special cases', 'Особени случаи'), items: [
          S('Minor heir: consent of a parent and court permission ([[sk:129:1]], [[sk:130:3]]).', 'Непълнолетен наследник: съгласие на родител и разрешение от съда ([[sk:129:1]], [[sk:130:3]]).'),
          S('Heir abroad: power with signature and content at the same time ([[zzd:37]]).', 'Наследник в чужбина: пълномощно с едновременно удостоверяване ([[zzd:37]]).'),
          S('One heir sells a share alone: offer to co-owners ([[zs:33]]) and the risk of [[zn:76]] explained.', 'Един наследник продава дела си сам: предложение до съсобствениците ([[zs:33]]) и разяснен риск по [[zn:76]].')
        ] },
        { title: S('Documents and checks', 'Документи и проверки'), items: [
          S('Deed of the deceased and death certificate.', 'Акт за собственост на наследодателя и смъртен акт.'),
          S('Inheritance declaration filed in 6 months ([[zmdt:32:1]]).', 'Подадена декларация за наследството в 6-месечен срок ([[zmdt:32:1]]).'),
          S('Tax assessment, sketch or scheme, declarations of every seller.', 'Данъчна оценка, скица или схема, декларации на всеки продавач.'),
          S('Public debts of every seller ([[dopk:264:1]]).', 'Публични задължения на всеки продавач ([[dopk:264:1]]).')
        ] }
      ]
    },
    {
      id: 'holographic-will',
      chapter: 'succession',
      title: S('Holographic will: deposit and announcement', 'Саморъчно завещание: предаване и обявяване'),
      when: S('A testator deposits a holographic will, or an heir asks for its announcement after the death.', 'Завещател предава саморъчно завещание или наследник иска обявяването му след смъртта.'),
      sections: [
        { title: S('Deposit', 'Предаване за пазене'), items: [
          S('Testator identified; envelope closed; nobody opens it.', 'Завещателят е идентифициран; пликът е затворен; никой не го отваря.'),
          S('Protocol on the envelope signed by the testator and the notary ([[zn:25:2]]).', 'Протокол върху плика, подписан от завещателя и нотариуса ([[zn:25:2]]).'),
          S('Entry in the register of holographic wills; case file opened ([[n32:9:1]], [[n32:10:1]]).', 'Запис в регистъра на саморъчните завещания; образувано дело ([[n32:9:1]], [[n32:10:1]]).'),
          S('Registration judge informed of the name within 3 days ([[n32:21:3]]).', 'Съдията по вписванията е уведомен за името в 3-дневен срок ([[n32:21:3]]).'),
          S('Name and personal number in the information system ([[n32:9а]]).', 'Име и ЕГН в информационната система ([[n32:9а]]).')
        ] },
        { title: S('Announcement', 'Обявяване'), items: [
          S('Proof of death presented.', 'Представено доказателство за смъртта.'),
          S('Protocol describing the condition and the opening, signed by the applicant and the notary ([[zn:27:3]]).', 'Протокол, описващ състоянието и разпечатването, подписан от молителя и нотариуса ([[zn:27:3]]).'),
          S('Will attached and countersigned on every page ([[zn:27:3]]).', 'Завещанието е приложено и приподписано на всяка страница ([[zn:27:3]]).'),
          S('Date recorded in the register; copies recorded too ([[n32:9:1]]).', 'Датата е отбелязана в регистъра; отбелязани са и преписите ([[n32:9:1]]).'),
          S('Copies concerning real estate sent for entry ([[pv:4]]).', 'Преписите, които се отнасят до имоти, са изпратени за вписване ([[pv:4]]).')
        ] }
      ]
    },
    {
      id: 'circumstantial',
      chapter: 'deeds',
      title: S('Circumstantial verification', 'Обстоятелствена проверка'),
      when: S('An owner without documents asks for a declaratory deed based on prescription.', 'Собственик без документи иска констативен акт въз основа на давност.'),
      sections: [
        { title: S('Filing', 'Подаване'), items: [
          S('Property in the notary\'s district ([[gpk:570:1]]).', 'Имотът е в района на нотариуса ([[gpk:570:1]]).'),
          S('Request-declaration ([[gpk:571]]), sketch, tax assessment.', 'Молба-декларация ([[gpk:571]]), скица, данъчна оценка.'),
          S('Evidence of possession: tax declarations and receipts, contracts, photos.', 'Доказателства за владението: данъчни декларации и квитанции, договори, снимки.'),
          S('Fee paid on filing; not returned on refusal ([[tarifa:11]]).', 'Таксата е платена при подаването; не се връща при отказ ([[tarifa:11]]).')
        ] },
        { title: S('Witnesses', 'Свидетели'), items: [
          S('Three witnesses named by the mayor, neighbours if possible ([[gpk:587:2]]).', 'Трима свидетели, посочени от кмета, по възможност съседи ([[gpk:587:2]]).'),
          S('No relatives, beneficiaries or office staff ([[gpk:584]]).', 'Без роднини, облагодетелствани или служители на кантората ([[gpk:584]]).'),
          S('Protocol of the questioning in the case file ([[n32:11:3]]).', 'Протокол от разпита в делото ([[n32:11:3]]).'),
          S('Warning signs reported to the notary (chapter 27).', 'Предупредителните знаци са докладвани на нотариуса (глава 27).')
        ] },
        { title: S('Decision and after', 'Решение и след това'), items: [
          S('Reasoned decision ([[gpk:587:3]]).', 'Мотивирано постановление ([[gpk:587:3]]).'),
          S('Deed with exact description and boundaries ([[gpk:588:1]]).', 'Акт с точно описание и граници ([[gpk:588:1]]).'),
          S('Local tax per the municipal ordinance ([[zmdt:44:3]]).', 'Местен данък по наредбата на общината ([[zmdt:44:3]]).'),
          S('Entry the same day ([[pv:4]], [[znnd:25:5]]).', 'Вписване в същия ден ([[pv:4]], [[znnd:25:5]]).')
        ] }
      ]
    },
    {
      id: 'office-day',
      chapter: 'office',
      title: S('The office day', 'Работният ден в кантората'),
      when: S('The routine of a clerk from opening to closing.', 'Рутината на служителя от отварянето до затварянето.'),
      sections: [
        { title: S('Opening', 'Отваряне'), items: [
          S('Office open in the hours of the district court ([[n32:27:1]]).', 'Кантората работи в работното време на районния съд ([[n32:27:1]]).'),
          S('Appointments of the day; drafts and documents ready.', 'Срещите за деня; готови проекти и документи.'),
          S('Information systems and registers accessible; personal accounts only.', 'Достъп до информационните системи и регистрите; само лични профили.')
        ] },
        { title: S('During the day', 'През деня'), items: [
          S('Every act entered in the general register in time order ([[n32:7]]).', 'Всяко действие е записано в общия регистър по хронологичен ред ([[n32:7]]).'),
          S('Deeds for entry taken to the registry office the same day ([[znnd:25:5]]).', 'Актовете за вписване са занесени в службата по вписванията в същия ден ([[znnd:25:5]]).'),
          S('Extracts entered in the information system at once ([[n32:9а]]).', 'Извлеченията са въведени веднага в информационната система ([[n32:9а]]).'),
          S('A bill for every charged act ([[znnd:89]]).', 'Сметка за всяко таксувано действие ([[znnd:89]]).'),
          S('Clean desk; no documents left at reception.', 'Чисто бюро; няма оставени документи на рецепцията.')
        ] },
        { title: S('Closing', 'Затваряне'), items: [
          S('Entries of the day closed with the notary\'s signature and seal ([[n32:5:1]]).', 'Записванията за деня са приключени с подписа и печата на нотариуса ([[n32:5:1]]).'),
          S('Volumes of 200 documents closed when full ([[n32:6:1]]).', 'Томовете от 200 документа са приключени, когато са пълни ([[n32:6:1]]).'),
          S('Wills: copy to the registration judge within 3 days ([[n32:21:2]]).', 'Завещания: екземпляр до съдията по вписванията в 3-дневен срок ([[n32:21:2]]).'),
          S('Notices to the municipality sent within 7 days ([[zmdt:51:2]]).', 'Уведомленията до общината са изпратени в 7-дневен срок ([[zmdt:51:2]]).'),
          S('Archive and safe locked ([[znnd:21]]).', 'Архивът и сейфът са заключени ([[znnd:21]]).')
        ] }
      ]
    }
  ]);
})();
