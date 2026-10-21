import type { Role } from '../content/content.models';
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
    readonly notAvailableYet: string;
    readonly openMenu: string;
    readonly closeMenu: string;
  };
  readonly search: {
    readonly placeholder: string;
    readonly label: string;
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
  readonly roles: Readonly<Record<Role, string>> & {
    readonly filterLabel: string;
    readonly all: string;
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
    readonly retrieved: string;
    readonly source: string;
    readonly contents: string;
    readonly filterLabel: string;
    readonly filterPlaceholder: string;
    readonly hideAmendments: string;
    readonly textLanguage: string;
    readonly textLanguages: Readonly<Record<'bg' | 'en' | 'both', string>>;
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
  readonly common: {
    readonly loading: string;
    readonly loadError: string;
    readonly retry: string;
    readonly close: string;
    readonly notFound: string;
    readonly goHome: string;
  };
}
