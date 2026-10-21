import type { Language } from './language';
import type { LawGroup } from '../laws/law.models';
import type {
  LineSpacing,
  MotionChoice,
  ReadingFont,
  TextSize,
  TextWidth,
  ThemeChoice,
} from '../settings/reading-settings';

/**
 * Every text of the interface. Each language file implements the whole interface,
 * so a missing translation is a compile error. Course content has its own files in public/data.
 */
export interface UiText {
  readonly app: {
    readonly name: string;
    readonly skipToContent: string;
  };
  readonly nav: {
    readonly label: string;
    readonly home: string;
    readonly course: string;
    readonly laws: string;
    readonly tests: string;
    readonly flashcards: string;
    readonly glossary: string;
    readonly templates: string;
    readonly checklists: string;
    readonly fees: string;
    readonly study: string;
    readonly reference: string;
    readonly contents: string;
    readonly openMenu: string;
    readonly closeMenu: string;
  };
  readonly search: {
    readonly placeholder: string;
    readonly label: string;
    readonly submit: string;
    /** The name of the search field on the results page, beside the one in the navigation. */
    readonly refine: string;
    readonly title: string;
    readonly resultsFor: (query: string) => string;
    readonly searching: string;
    readonly noResults: string;
    readonly openProvision: (label: string) => string;
    readonly inGlossary: string;
    readonly inCourse: (count: number) => string;
    readonly inLaws: (count: number) => string;
    readonly moreResults: (count: number) => string;
  };
  readonly language: {
    readonly label: string;
    readonly bg: string;
    readonly en: string;
  };
  readonly settings: {
    readonly open: string;
    readonly title: string;
    readonly theme: string;
    readonly themes: Readonly<Record<ThemeChoice, string>>;
    readonly textSize: string;
    readonly textSizes: Readonly<Record<TextSize, string>>;
    readonly lineSpacing: string;
    readonly lineSpacings: Readonly<Record<LineSpacing, string>>;
    readonly textWidth: string;
    readonly textWidths: Readonly<Record<TextWidth, string>>;
    readonly readingFont: string;
    readonly readingFonts: Readonly<Record<ReadingFont, string>>;
    readonly motion: string;
    readonly motions: Readonly<Record<MotionChoice, string>>;
    readonly reset: string;
    readonly storedLocally: string;
  };
  readonly home: {
    readonly title: string;
    readonly intro: string;
    readonly continueReading: string;
    readonly startReading: string;
    readonly progress: (read: number, total: number) => string;
    readonly libraryAndTools: string;
    readonly lawsHint: string;
    readonly glossaryHint: string;
    readonly templatesHint: string;
    readonly checklistsHint: string;
    readonly feesHint: string;
    readonly testsHint: string;
    readonly flashcardsHint: string;
    readonly contents: string;
  };
  readonly chapter: {
    readonly number: (n: number) => string;
    readonly part: (n: number) => string;
    readonly minutes: (n: number) => string;
    readonly objectives: string;
    readonly onThisPage: string;
    readonly markRead: string;
    readonly read: string;
    readonly test: string;
    readonly flashcards: string;
    readonly previous: string;
    readonly next: string;
    readonly citedLaw: string;
    readonly calloutTitles: Readonly<
      Record<'law' | 'tip' | 'warn' | 'example' | 'note' | 'task' | 'reform' | 'solution', string>
    >;
  };
  readonly law: {
    readonly library: string;
    readonly libraryIntro: string;
    readonly jumpLabel: string;
    readonly jumpPlaceholder: string;
    readonly jump: string;
    readonly jumpError: string;
    readonly articles: (n: number) => string;
    readonly extract: string;
    readonly withTranslation: string;
    readonly groups: Readonly<Record<LawGroup, string>>;
    readonly officialNote: string;
    readonly euroNote: string;
    readonly inForce: string;
    readonly published: string;
    readonly lastChange: string;
    /** An issue of the State Gazette: "ДВ, бр. 84 от 6 октомври 2023 г.". */
    readonly gazette: (issue: string, date: string) => string;
    readonly retrieved: string;
    readonly source: string;
    readonly contents: string;
    readonly filterLabel: string;
    readonly filterPlaceholder: string;
    readonly hideAmendments: string;
    readonly textLanguage: string;
    readonly textLanguages: Readonly<Record<Language, string>>;
    readonly translation: string;
    readonly noTranslation: string;
    readonly notFound: string;
  };
  readonly panel: {
    readonly label: string;
    readonly close: string;
    readonly back: string;
    readonly forward: string;
    readonly openInLibrary: string;
    readonly previousArticle: string;
    readonly nextArticle: string;
    readonly sameSection: string;
    readonly wholeAct: string;
    readonly citedInCourse: string;
    readonly citedNowhere: string;
    readonly glossary: string;
    readonly resize: string;
    readonly resizeHint: string;
  };
  readonly glossary: {
    readonly lead: (count: number) => string;
    readonly filterLabel: string;
    readonly filterPlaceholder: string;
    readonly letters: string;
    readonly noMatch: string;
  };
  readonly templates: {
    readonly lead: string;
    readonly note: string;
    readonly translation: string;
    readonly notes: string;
  };
  readonly checklists: {
    readonly lead: string;
    readonly clear: string;
    readonly progress: (ticked: number, total: number) => string;
  };
  readonly flashcards: {
    readonly lead: string;
    readonly due: string;
    readonly all: string;
    readonly glossaryDeck: string;
    readonly byChapter: string;
    readonly dueCount: (count: number) => string;
    readonly learned: (count: number) => string;
    readonly hint: string;
    readonly showAnswer: string;
    /** The name of the space bar on a key cap. */
    readonly spaceKey: string;
    readonly again: string;
    readonly knewIt: string;
    readonly position: (index: number, total: number) => string;
    readonly newCard: string;
    readonly box: (box: number) => string;
    readonly boxes: string;
    /** When a graded card comes back: 1 day is "tomorrow". */
    readonly comesBack: (days: number) => string;
    readonly deckDone: (known: number, again: number) => string;
    readonly deckEmpty: string;
    readonly restart: string;
  };
  readonly tests: {
    readonly lead: string;
    readonly finalExam: string;
    readonly examIntro: (size: number, passMark: number) => string;
    readonly startExam: string;
    readonly history: string;
    readonly chapterTests: string;
    readonly chapterTest: string;
    readonly chapterTestIntro: (count: number, passMark: number) => string;
    readonly question: (index: number, total: number) => string;
    readonly previous: string;
    readonly next: string;
    readonly finish: string;
    /** The marks of an answer in the review at the end. */
    readonly correct: string;
    readonly wrong: string;
    readonly score: (right: number, total: number) => string;
    readonly passed: string;
    readonly failed: string;
    readonly examPassed: string;
    readonly examFailed: string;
    readonly retry: string;
    readonly backToChapter: string;
    readonly review: string;
    readonly allAnswers: (count: number) => string;
    readonly wrongAnswers: (count: number) => string;
    readonly yourAnswer: string;
    readonly rightAnswer: string;
    readonly bestScore: (score: number) => string;
    readonly notTaken: string;
  };
  readonly fees: {
    readonly lead: string;
    /** Titles of the parts of the form. The title of the last part, the local tax, is `tax`. */
    readonly actionSection: string;
    readonly costsSection: string;
    readonly action: string;
    readonly placeAndTime: string;
    readonly vat: string;
    readonly entryFee: string;
    readonly tax: string;
    readonly taxKind: string;
    readonly taxRate: string;
    readonly rateOutside: (min: string, max: string) => string;
    readonly price: string;
    readonly assessment: string;
    readonly buildingHint: string;
    readonly securedAmount: string;
    readonly insuredValue: string;
    readonly agreedPrice: string;
    readonly vehicleHint: string;
    readonly marketValue: string;
    readonly materialInterestInput: string;
    readonly signatures: string;
    readonly propertySignatures: string;
    readonly redelegation: string;
    readonly pages: string;
    readonly copies: string;
    readonly bill: string;
    readonly materialInterest: string;
    readonly notarialFee: string;
    readonly additionalFee: string;
    readonly vatLine: string;
    readonly entryFeeLine: string;
    readonly entryFeeSource: string;
    readonly localTax: (rate: string) => string;
    readonly total: string;
    readonly whoPays: string;
    readonly howItWorks: string;
  };
  readonly common: {
    readonly loading: string;
    readonly loadError: string;
    readonly retry: string;
    readonly close: string;
    readonly notFound: string;
    readonly goHome: string;
    readonly print: string;
    readonly copy: string;
    readonly copied: string;
  };
}
