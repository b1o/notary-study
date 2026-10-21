/* Core: namespace, settings and progress store, script loader, interface texts, helpers. */
(function () {
  'use strict';

  const NC = (window.NC = {});

  /* ---------- Interface texts ---------- */
  NC.T = {
    brand: { en: 'Notary Office Course', bg: 'Курс по нотариално дело' },
    searchPlaceholder: { en: 'Search the course and the laws…', bg: 'Търсене в курса и законите…' },
    theme: { en: 'Switch light or dark theme', bg: 'Светла или тъмна тема' },
    home: { en: 'Home', bg: 'Начало' },
    course: { en: 'Course', bg: 'Курс' },
    laws: { en: 'Law library', bg: 'Законодателство' },
    cards: { en: 'Flashcards', bg: 'Флашкарти' },
    tests: { en: 'Tests', bg: 'Тестове' },
    glossary: { en: 'Glossary', bg: 'Речник' },
    templates: { en: 'Document templates', bg: 'Образци на документи' },
    feeCalc: { en: 'Fee calculator', bg: 'Калкулатор на такси' },
    checklists: { en: 'Document checklists', bg: 'Списъци с документи' },
    tools: { en: 'Tools', bg: 'Инструменти' },
    volume: { en: 'Volume', bg: 'Том' },
    act: { en: 'Act', bg: 'Акт' },
    chapter: { en: 'Chapter', bg: 'Глава' },
    minutes: { en: 'min', bg: 'мин.' },
    continue: { en: 'Continue', bg: 'Продължи' },
    startCourse: { en: 'Start the course', bg: 'Започни курса' },
    objectives: { en: 'After this chapter you can', bg: 'След тази глава ще можете' },
    keyLaw: { en: 'Key law for this chapter', bg: 'Основни разпоредби в главата' },
    markRead: { en: 'Mark the chapter as read', bg: 'Отбележи главата като прочетена' },
    read: { en: 'Read', bg: 'Прочетена' },
    takeQuiz: { en: 'Take the chapter test', bg: 'Направи теста към главата' },
    studyCards: { en: 'Study the flashcards', bg: 'Учи с флашкартите' },
    prev: { en: 'Previous', bg: 'Предишна' },
    next: { en: 'Next', bg: 'Следваща' },
    certified: { en: 'Certified', bg: 'Удостоверено' },
    notStarted: { en: 'Not started', bg: 'Не е започната' },
    inProgress: { en: 'Read, test pending', bg: 'Прочетена, без тест' },
    bestScore: { en: 'Best test score', bg: 'Най-добър резултат' },
    progressLabel: { en: 'chapters certified', bg: 'удостоверени глави' },
    register: { en: 'Course register', bg: 'Регистър на курса' },
    registerHint: {
      en: 'A chapter is certified when you read it and score 80% or more in its test.',
      bg: 'Главата се удостоверява, когато я прочетете и получите поне 80% на теста към нея.'
    },
    yourPath: { en: 'Your path', bg: 'Вашият път' },
    pathAll: { en: 'All chapters', bg: 'Всички глави' },
    roleClerk: { en: 'Office clerk', bg: 'Служител в кантора' },
    roleAssistant: { en: 'Assistant notary', bg: 'Помощник-нотариус' },
    roleNotary: { en: 'Notary', bg: 'Нотариус' },
    essential: { en: 'Essential for your path', bg: 'Задължителна за вашия път' },
    openInLibrary: { en: 'Open in the law library', bg: 'Отвори в законодателството' },
    close: { en: 'Close', bg: 'Затвори' },
    lawMargin: { en: 'Law margin', bg: 'Текст на закона' },
    lawNotFound: { en: 'This provision is not in the library.', bg: 'Тази разпоредба липсва в библиотеката.' },
    loading: { en: 'Loading…', bg: 'Зареждане…' },
    source: { en: 'Source', bg: 'Източник' },
    retrieved: { en: 'Text retrieved on', bg: 'Текстът е изтеглен на' },
    lastChange: { en: 'Last amendment in the source', bg: 'Последно изменение в източника' },
    extract: { en: 'Extract: only the provisions the course needs', bg: 'Извадка: само разпоредбите, нужни за курса' },
    officialNote: {
      en: 'Unofficial consolidated text from lex.bg. Always check the official text in the State Gazette (Държавен вестник) before you rely on it.',
      bg: 'Неофициален консолидиран текст от lex.bg. Преди да разчитате на него, проверете официалния текст в „Държавен вестник“.'
    },
    articles: { en: 'articles', bg: 'члена' },
    contents: { en: 'Contents', bg: 'Съдържание' },
    showTranslation: { en: 'Show the English translation', bg: 'Покажи английския превод' },
    unofficialTranslation: { en: 'Unofficial English translation', bg: 'Неофициален превод на английски' },
    noTranslation: { en: 'No English translation yet. The Bulgarian original is shown.', bg: 'Няма превод.' },
    filterLaw: { en: 'Find an article or a word in this act', bg: 'Търсене на член или дума в акта' },
    lawGroups: {
      notary: { en: 'Notaries and notarial procedure', bg: 'Нотариуси и нотариално производство' },
      civil: { en: 'Civil, family and inheritance law', bg: 'Гражданско, семейно и наследствено право' },
      commercial: { en: 'Commercial law', bg: 'Търговско право' },
      registers: { en: 'Property, cadastre and registers', bg: 'Имоти, кадастър и регистри' },
      tax: { en: 'Fees, taxes and payments', bg: 'Такси, данъци и плащания' },
      aml: { en: 'Money laundering prevention', bg: 'Мерки срещу изпирането на пари' },
      other: { en: 'Other acts', bg: 'Други актове' }
    },
    searchResults: { en: 'Search results', bg: 'Резултати от търсенето' },
    inCourse: { en: 'In the course', bg: 'В курса' },
    inLaws: { en: 'In the laws', bg: 'В законите' },
    inGlossary: { en: 'In the glossary', bg: 'В речника' },
    noResults: {
      en: 'Nothing matches. Try a shorter word, or the Bulgarian term.',
      bg: 'Няма съвпадения. Опитайте с по-кратка дума или с друга форма на думата.'
    },
    searching: { en: 'Searching all chapters and laws…', bg: 'Търсене във всички глави и закони…' },
    jumpTo: { en: 'Go to', bg: 'Към' },
    question: { en: 'Question', bg: 'Въпрос' },
    of: { en: 'of', bg: 'от' },
    check: { en: 'Check the answer', bg: 'Провери отговора' },
    correct: { en: 'Correct.', bg: 'Вярно.' },
    wrong: { en: 'Not correct.', bg: 'Грешно.' },
    nextQuestion: { en: 'Next question', bg: 'Следващ въпрос' },
    finish: { en: 'See the result', bg: 'Виж резултата' },
    result: { en: 'Result', bg: 'Резултат' },
    passed: { en: 'Passed. The chapter is certified.', bg: 'Издържан. Главата е удостоверена.' },
    passedNoRead: {
      en: 'Passed. Mark the chapter as read to certify it.',
      bg: 'Издържан. Отбележете главата като прочетена, за да я удостоверите.'
    },
    failed: { en: 'Not passed. Read the chapter again and repeat the test.', bg: 'Не е издържан. Прочетете главата отново и повторете теста.' },
    retry: { en: 'Repeat the test', bg: 'Повтори теста' },
    backToChapter: { en: 'Back to the chapter', bg: 'Обратно към главата' },
    reviewMistakes: { en: 'Your mistakes', bg: 'Вашите грешки' },
    yourAnswer: { en: 'Your answer', bg: 'Вашият отговор' },
    rightAnswer: { en: 'Right answer', bg: 'Верен отговор' },
    chapterTests: { en: 'Chapter tests', bg: 'Тестове по глави' },
    finalExam: { en: 'Final exam', bg: 'Финален изпит' },
    finalExamIntro: {
      en: '40 random questions from all chapters. You pass with 75% or more. The exam does not show the answers until the end.',
      bg: '40 случайни въпроса от всички глави. Изпитът се издържа с поне 75%. Отговорите се показват едва в края.'
    },
    startExam: { en: 'Start the final exam', bg: 'Започни финалния изпит' },
    examHistory: { en: 'Earlier attempts', bg: 'Предишни опити' },
    examPassed: { en: 'You passed the final exam.', bg: 'Издържахте финалния изпит.' },
    examFailed: { en: 'You did not pass this time.', bg: 'Този път не издържахте.' },
    decks: { en: 'Decks', bg: 'Тестета' },
    allChapters: { en: 'All chapters', bg: 'Всички глави' },
    dueToday: { en: 'Due for review today', bg: 'За преговор днес' },
    glossaryDeck: { en: 'Glossary terms', bg: 'Термини от речника' },
    cardsIn: { en: 'cards', bg: 'карти' },
    showAnswer: { en: 'Show the answer', bg: 'Покажи отговора' },
    knewIt: { en: 'I knew it', bg: 'Знаех го' },
    again: { en: 'Again', bg: 'Отново' },
    deckDone: { en: 'You went through the whole deck.', bg: 'Минахте през цялото тесте.' },
    deckEmpty: { en: 'No cards are due. Come back tomorrow or pick another deck.', bg: 'Няма карти за преговор. Върнете се утре или изберете друго тесте.' },
    boxes: { en: 'Leitner boxes: a card moves one box up when you know it and back to box 1 when you miss it.', bg: 'Кутии по Лайтнер: картата отива в следващата кутия, когато я знаете, и се връща в кутия 1, когато я сбъркате.' },
    box: { en: 'Box', bg: 'Кутия' },
    restartDeck: { en: 'Study this deck again', bg: 'Учи тестето отново' },
    flip: { en: 'Click the card or press Space to turn it.', bg: 'Щракнете върху картата или натиснете интервал, за да я обърнете.' },
    term: { en: 'Term', bg: 'Термин' },
    filterGlossary: { en: 'Filter the terms', bg: 'Филтър на термините' },
    seeChapter: { en: 'Chapter', bg: 'Глава' },
    copy: { en: 'Copy the text', bg: 'Копирай текста' },
    copied: { en: 'Copied', bg: 'Копирано' },
    print: { en: 'Print', bg: 'Печат' },
    templateNote: {
      en: 'Templates are learning aids. The notary decides the final wording of every document.',
      bg: 'Образците са учебни. Окончателния текст на всеки документ определя нотариусът.'
    },
    translationOfTemplate: { en: 'English working translation', bg: 'Работен превод на английски' },
    euroNote: {
      en: 'Since 1 January 2026 the euro is the currency of Bulgaria. Amounts that laws state in leva count as euro at 1.95583 leva per euro (Art. 11–13 ЗВЕРБ).',
      bg: 'От 1 януари 2026 г. валутата на България е еврото. Сумите в левове в нормативните актове се смятат в евро по курс 1,95583 лв. за 1 евро (чл. 11–13 ЗВЕРБ).'
    },
    resetProgress: { en: 'Reset all progress', bg: 'Изтрий целия напредък' },
    resetConfirm: { en: 'Delete all progress, test results and flashcard boxes on this device?', bg: 'Да се изтрие ли целият напредък, резултатите и кутиите на флашкартите на това устройство?' },
    storageNote: {
      en: 'Your progress stays in this browser only.',
      bg: 'Напредъкът се пази само в този браузър.'
    },
    notFound: { en: 'This page does not exist.', bg: 'Тази страница не съществува.' },
    goHome: { en: 'Go to the home page', bg: 'Към началната страница' },
    pendingTranslation: {
      en: 'This chapter is not available in English yet. The Bulgarian version is shown.',
      bg: 'Тази глава още не е налична на български. Показана е английската версия.'
    }
  };

  NC.lang = 'en';
  NC.t = function (key) {
    const entry = typeof key === 'string' ? NC.T[key] : key;
    if (!entry) return key;
    return entry[NC.lang] || entry.en || entry.bg || '';
  };
  /* Pick the current language from a {bg, en} object. */
  NC.L = function (obj) {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    return obj[NC.lang] || obj.en || obj.bg || '';
  };

  /* ---------- Settings and progress store ---------- */
  const KEY = 'nc.v1';
  const defaults = () => ({ lang: null, theme: 'auto', role: 'all', progress: {}, cards: {}, exams: [], last: null });
  let state = defaults();
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && typeof saved === 'object') state = Object.assign(defaults(), saved);
  } catch (e) { /* Storage is not available: keep the defaults in memory. */ }

  NC.store = {
    get: (k) => state[k],
    set(k, v) { state[k] = v; this.save(); },
    save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } },
    reset() { const lang = state.lang; const theme = state.theme; state = defaults(); state.lang = lang; state.theme = theme; this.save(); },
    chapter(id) { return state.progress[id] || {}; },
    updateChapter(id, patch) {
      const cur = Object.assign({}, state.progress[id] || {}, patch);
      if (cur.read && (cur.best || 0) >= 80 && !cur.certifiedAt) cur.certifiedAt = new Date().toISOString();
      state.progress[id] = cur;
      this.save();
      return cur;
    }
  };
  NC.isCertified = (id) => !!NC.store.chapter(id).certifiedAt;

  /* ---------- Registries filled by content files ---------- */
  NC.manifest = null;
  NC.chapters = { en: {}, bg: {} };
  NC.glossary = null;
  NC.templates = null;
  NC.checklists = null;
  NC.setManifest = (m) => { NC.manifest = m; };
  NC.registerChapter = (lang, data) => { NC.chapters[lang][data.id] = data; };
  NC.setGlossary = (g) => { NC.glossary = g; };
  NC.setTemplates = (t) => { NC.templates = t; };
  NC.setChecklists = (c) => { NC.checklists = c; };

  /* ---------- Script loader (works from file:// as well as from a server) ---------- */
  const loading = {};
  NC.loadScript = function (src) {
    if (!loading[src]) {
      loading[src] = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => resolve();
        s.onerror = () => { delete loading[src]; reject(new Error('Cannot load ' + src)); };
        document.head.appendChild(s);
      });
    }
    return loading[src];
  };

  /* Load one chapter in a language. Falls back to the other language if the file is missing. */
  NC.loadChapter = async function (id, lang) {
    lang = lang || NC.lang;
    const meta = NC.manifest.chapters[id];
    if (!meta) return null;
    if (NC.chapters[lang][id]) return { data: NC.chapters[lang][id], lang };
    try {
      await NC.loadScript(`content/${lang}/${meta.file}.js`);
    } catch (e) { /* fall through to the other language */ }
    if (NC.chapters[lang][id]) return { data: NC.chapters[lang][id], lang };
    const other = lang === 'en' ? 'bg' : 'en';
    try { await NC.loadScript(`content/${other}/${meta.file}.js`); } catch (e) { return null; }
    return NC.chapters[other][id] ? { data: NC.chapters[other][id], lang: other } : null;
  };

  NC.loadAllChapters = async function (lang) {
    const ids = NC.chapterOrder();
    const out = [];
    for (const id of ids) {
      const res = await NC.loadChapter(id, lang);
      if (res) out.push(res.data);
    }
    return out;
  };

  NC.chapterOrder = function () {
    const ids = [];
    NC.manifest.parts.forEach((p) => p.chapters.forEach((c) => ids.push(c)));
    return ids;
  };

  NC.partOf = function (chapterId) {
    return NC.manifest.parts.find((p) => p.chapters.includes(chapterId));
  };

  /* ---------- DOM and text helpers ---------- */
  NC.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  NC.h = function (html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };

  NC.roman = function (n) {
    const map = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    let out = '';
    for (const [v, s] of map) { while (n >= v) { out += s; n -= v; } }
    return out;
  };

  /* Lower-case, strip accents and unify Cyrillic/Latin look-alikes for search. */
  NC.norm = function (s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ѝ/g, 'и');
  };

  NC.shuffle = function (arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  NC.formatDate = function (iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString(NC.lang === 'bg' ? 'bg-BG' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  NC.money = function (n, currency) {
    const v = Number(n || 0);
    const s = v.toLocaleString(NC.lang === 'bg' ? 'bg-BG' : 'en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return currency === 'BGN' ? `${s} лв.` : `${s} €`;
  };
})();
