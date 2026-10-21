/* Course structure: volumes (parts) and chapters. Chapter texts live in content/en and content/bg. */
(function () {
  const C = 'clerk';
  const A = 'assistant';
  const N = 'notary';
  NC.setManifest({
    parts: [
      { id: 'start', title: { en: 'First steps', bg: 'Първи стъпки' }, chapters: ['welcome', 'careers', 'legal-system'] },
      { id: 'office', title: { en: 'The notary and the office', bg: 'Нотариусът и кантората' }, chapters: ['profession', 'deputies', 'office'] },
      { id: 'civil', title: { en: 'Civil law for daily work', bg: 'Гражданското право в кантората' }, chapters: ['persons', 'contracts', 'property', 'family', 'inheritance', 'commercial'] },
      { id: 'procedure', title: { en: 'Notarial procedure', bg: 'Нотариалното производство' }, chapters: ['procedure', 'deeds', 'certifications', 'other-acts'] },
      { id: 'deals', title: { en: 'Transactions step by step', bg: 'Сделките стъпка по стъпка' }, chapters: ['sale', 'property-deals', 'vehicles', 'poa', 'company', 'succession'] },
      { id: 'compliance', title: { en: 'Compliance, money and institutions', bg: 'Контрол, пари и институции' }, chapters: ['aml', 'fees', 'institutions', 'records'] },
      { id: 'practice', title: { en: 'Professional practice', bg: 'Професионална практика' }, chapters: ['ethics', 'cases'] }
    ],
    chapters: {
      welcome: {
        n: 1, file: '01-welcome', minutes: 20, roles: [C, A, N],
        title: { en: 'How the course and the office work', bg: 'Как работят курсът и кантората' },
        summary: { en: 'What a notary office does, who works there, and how to use this course, its law library and its tests.', bg: 'Какво прави нотариалната кантора, кой работи в нея и как да използвате курса, законодателството и тестовете.' }
      },
      careers: {
        n: 2, file: '02-careers', minutes: 30, roles: [C, A, N],
        title: { en: 'Jobs in a notary office and the way in', bg: 'Професиите в кантората и пътят към тях' },
        summary: { en: 'Clerk, legal assistant, assistant notary, substitute and notary: the requirements, the exams and how to get hired.', bg: 'Служител, юрист, помощник-нотариус, заместник и нотариус: изисквания, изпити и как да ви наемат.' }
      },
      'legal-system': {
        n: 3, file: '03-legal-system', minutes: 35, roles: [C, A, N],
        title: { en: 'The Bulgarian legal system for notary staff', bg: 'Правната система за служителите в кантората' },
        summary: { en: 'Sources of law, the State Gazette, the courts, how to read a citation, and the basic legal ideas every task depends on.', bg: 'Източници на правото, „Държавен вестник“, съдилищата, как се чете цитат и основните понятия, от които зависи всяка задача.' }
      },
      profession: {
        n: 4, file: '04-profession', minutes: 40, roles: [A, N],
        title: { en: 'The notary: status, duties and liability', bg: 'Нотариусът: статут, задължения и отговорност' },
        summary: { en: 'The notary as a holder of state functions: district, Notary Chamber, independence, secrecy, insurance, control and discipline.', bg: 'Нотариусът като носител на държавни функции: район, Нотариална камара, независимост, тайна, застраховка, контрол и дисциплина.' }
      },
      deputies: {
        n: 5, file: '05-deputies', minutes: 25, roles: [A, N],
        title: { en: 'Assistant notaries, substitutes and other officials', bg: 'Помощник-нотариуси, заместници и други длъжностни лица' },
        summary: { en: 'Who else may perform notarial acts, and where the limits are: assistants, substitutes, registration judges, mayors and consuls.', bg: 'Кой друг може да извършва нотариални действия и къде са границите: помощници, заместници, съдии по вписванията, кметове и консули.' }
      },
      office: {
        n: 6, file: '06-office', minutes: 40, roles: [C, A, N],
        title: { en: 'Inside the office: people, workflow and the archive', bg: 'Кантората отвътре: хора, работа и архив' },
        summary: { en: 'The premises, the roles, a working day, the registers and books, the case files, the seal and the information systems.', bg: 'Помещенията, ролите, работният ден, регистрите и книгите, нотариалните дела, печатът и информационните системи.' }
      },
      persons: {
        n: 7, file: '07-persons', minutes: 40, roles: [C, A, N],
        title: { en: 'Persons, capacity, identity and representation', bg: 'Лица, дееспособност, самоличност и представителство' },
        summary: { en: 'Who can sign what: adults, minors, persons under guardianship, foreigners and companies, and how the office proves identity.', bg: 'Кой какво може да подпише: пълнолетни, непълнолетни, поставени под запрещение, чужденци и дружества, и как кантората установява самоличността.' }
      },
      contracts: {
        n: 8, file: '08-contracts', minutes: 45, roles: [A, N],
        title: { en: 'Obligations and contracts', bg: 'Задължения и договори' },
        summary: { en: 'How contracts arise, the forms the law requires, when a contract is void or voidable, representation and the main contracts.', bg: 'Как възникват договорите, изискуемите форми, кога договорът е нищожен или унищожаем, представителство и основните договори.' }
      },
      property: {
        n: 9, file: '09-property', minutes: 45, roles: [A, N],
        title: { en: 'Property and real rights', bg: 'Собственост и вещни права' },
        summary: { en: 'Ownership, co-ownership, building rights, usufruct, servitudes, prescription, pre-emption and condominiums.', bg: 'Собственост, съсобственост, право на строеж, право на ползване, сервитути, давност, право на изкупуване и етажна собственост.' }
      },
      family: {
        n: 10, file: '10-family', minutes: 40, roles: [C, A, N],
        title: { en: 'Family property and children', bg: 'Семейно имущество и деца' },
        summary: { en: 'Matrimonial property regimes, the community of spouses, marriage contracts, the property of children and travel consent.', bg: 'Имуществени режими между съпрузите, съпружеска имуществена общност, брачен договор, имущество на децата и съгласие за пътуване.' }
      },
      inheritance: {
        n: 11, file: '11-inheritance', minutes: 45, roles: [A, N],
        title: { en: 'Inheritance law', bg: 'Наследствено право' },
        summary: { en: 'Legal heirs and their shares, the reserved portion, wills, acceptance and renunciation, the certificate of heirs and partition.', bg: 'Наследници по закон и техните дялове, запазена част, завещания, приемане и отказ, удостоверение за наследници и делба.' }
      },
      commercial: {
        n: 12, file: '12-commercial', minutes: 35, roles: [A, N],
        title: { en: 'Commercial law for the notary office', bg: 'Търговско право за нотариалната кантора' },
        summary: { en: 'Merchants and companies, the Commercial Register, representation, transfer of shares and of an enterprise, bills of exchange.', bg: 'Търговци и дружества, Търговски регистър, представителство, прехвърляне на дялове и на предприятие, менителници.' }
      },
      procedure: {
        n: 13, file: '13-procedure', minutes: 35, roles: [A, N],
        title: { en: 'General rules of notarial proceedings', bg: 'Общи правила на нотариалното производство' },
        summary: { en: 'What counts as a notarial act, which notary is competent, how a case starts, recusal, nullity, refusal and appeal.', bg: 'Кои са нотариалните производства, кой нотариус е компетентен, как започва производството, отвод, нищожност, отказ и обжалване.' }
      },
      deeds: {
        n: 14, file: '14-deeds', minutes: 50, roles: [A, N],
        title: { en: 'Notarial deeds step by step', bg: 'Нотариалният акт стъпка по стъпка' },
        summary: { en: 'From the draft to the notarial book: checks, reading, signing, interpreters and witnesses, content, entry and declaratory deeds.', bg: 'От проекта до нотариалната книга: проверки, прочитане, подписване, преводачи и свидетели, съдържание, вписване и констативни актове.' }
      },
      certifications: {
        n: 15, file: '15-certifications', minutes: 40, roles: [C, A, N],
        title: { en: 'Certifying signatures, content, dates and copies', bg: 'Удостоверяване на подписи, съдържание, дата и преписи' },
        summary: { en: 'The most frequent work of every office: how each certification is done, what the endorsement says and where it is recorded.', bg: 'Най-честата работа на всяка кантора: как се извършва всяко удостоверяване, какво съдържа надписът и къде се отбелязва.' }
      },
      'other-acts': {
        n: 16, file: '16-other-acts', minutes: 35, roles: [C, A, N],
        title: { en: 'Invitations, service at addresses, protocols and safekeeping', bg: 'Покани, връчване на адрес, протоколи и съхранение' },
        summary: { en: 'Notarial invitations and how staff serve them at an address, declaratory protocols, deposits, protests and inquiries.', bg: 'Нотариални покани и как служителят ги връчва на адрес, констативни протоколи, съхранение, протести и справки.' }
      },
      sale: {
        n: 17, file: '17-sale', minutes: 55, roles: [C, A, N],
        title: { en: 'Sale of real estate from the first call to entry', bg: 'Продажба на имот от първото обаждане до вписването' },
        summary: { en: 'The core transaction of the office: documents, checks, declarations, money, the deed, the signing and what happens after it.', bg: 'Основната сделка в кантората: документи, проверки, декларации, плащане, актът, подписването и какво следва след него.' }
      },
      'property-deals': {
        n: 18, file: '18-property-deals', minutes: 45, roles: [A, N],
        title: { en: 'Gifts, exchange, care contracts, building rights, partition and mortgages', bg: 'Дарение, замяна, издръжка и гледане, право на строеж, делба и ипотека' },
        summary: { en: 'The other real estate deeds: what is different in each one, and the checks that matter most.', bg: 'Останалите актове за имоти: с какво се различава всеки от тях и кои проверки са най-важни.' }
      },
      vehicles: {
        n: 19, file: '19-vehicles', minutes: 30, roles: [C, A, N],
        title: { en: 'Sale of motor vehicles', bg: 'Продажба на моторни превозни средства' },
        summary: { en: 'The form of the contract, the checks before signing, the fee, the tax and the registration of the new owner.', bg: 'Формата на договора, проверките преди подписването, таксата, данъкът и регистрацията на новия собственик.' }
      },
      poa: {
        n: 20, file: '20-poa', minutes: 40, roles: [C, A, N],
        title: { en: 'Powers of attorney and declarations', bg: 'Пълномощни и декларации' },
        summary: { en: 'Types and forms of powers of attorney, the register of powers, revocation, documents from abroad and common declarations.', bg: 'Видове и форма на пълномощните, регистърът на пълномощните, оттегляне, документи от чужбина и чести декларации.' }
      },
      company: {
        n: 21, file: '21-company', minutes: 35, roles: [A, N],
        title: { en: 'Company transactions at the notary', bg: 'Сделки с дружества при нотариуса' },
        summary: { en: 'Transfers of company shares and enterprises, specimen signatures, decisions of owners and the checks on companies.', bg: 'Прехвърляне на дялове и предприятия, образци от подписи, решения на собствениците и проверките на дружествата.' }
      },
      succession: {
        n: 22, file: '22-succession', minutes: 40, roles: [A, N],
        title: { en: 'Wills and inheritance work in the office', bg: 'Завещания и наследствени дела в кантората' },
        summary: { en: 'Notarial wills, deposit and announcement of holographic wills, renunciations, and deals with inherited property.', bg: 'Нотариални завещания, съхранение и обявяване на саморъчни завещания, откази и сделки с наследени имоти.' }
      },
      aml: {
        n: 23, file: '23-aml', minutes: 40, roles: [C, A, N],
        title: { en: 'Money laundering prevention', bg: 'Мерки срещу изпирането на пари' },
        summary: { en: 'The notary as an obliged person: customer due diligence, beneficial owners, politically exposed persons, records and reports.', bg: 'Нотариусът като задължено лице: комплексна проверка, действителни собственици, видни политически личности, документиране и докладване.' }
      },
      fees: {
        n: 24, file: '24-fees', minutes: 40, roles: [C, A, N],
        title: { en: 'Fees, taxes and payments', bg: 'Такси, данъци и плащания' },
        summary: { en: 'How to calculate notarial fees, entry fees and the local tax, the bill, VAT, cash limits and the special bank account.', bg: 'Как се изчисляват нотариалните такси, таксата за вписване и местният данък, сметката, ДДС, ограниченията за плащане в брой и специалната сметка.' }
      },
      institutions: {
        n: 25, file: '25-institutions', minutes: 45, roles: [C, A, N],
        title: { en: 'Working with institutions and registers', bg: 'Работа с институции и регистри' },
        summary: { en: 'The Registry Agency, the cadastre, municipalities, the tax agency, civil registration, the police, courts and banks: what to ask and how.', bg: 'Агенцията по вписванията, кадастърът, общините, НАП, гражданската регистрация, МВР, съдилищата и банките: какво да поискате и как.' }
      },
      records: {
        n: 26, file: '26-records', minutes: 30, roles: [C, A, N],
        title: { en: 'Registers, archive and data protection', bg: 'Регистри, архив и защита на данните' },
        summary: { en: 'How the official archive is kept, numbered, stored and inspected, and how the office protects personal data and secrecy.', bg: 'Как се води, номерира, съхранява и проверява служебният архив и как кантората опазва личните данни и тайната.' }
      },
      ethics: {
        n: 27, file: '27-ethics', minutes: 35, roles: [C, A, N],
        title: { en: 'Ethics, client service and fraud prevention', bg: 'Етика, обслужване и защита от измами' },
        summary: { en: 'Impartiality and explanation duties, vulnerable clients, doubts about capacity, the red flags of property fraud and how to refuse.', bg: 'Безпристрастност и задължение за разясняване, уязвими клиенти, съмнения за дееспособност, сигнали за имотни измами и как се отказва.' }
      },
      cases: {
        n: 28, file: '28-cases', minutes: 60, roles: [C, A, N],
        title: { en: 'Case studies: full simulations', bg: 'Казуси: пълни симулации' },
        summary: { en: 'Eight realistic files from intake to archive. Decide at each step, then compare with the model solution.', bg: 'Осем реалистични преписки от приемането до архива. Решете всяка стъпка и сравнете с примерното решение.' }
      }
    }
  });
})();
