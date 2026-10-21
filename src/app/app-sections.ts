import type { UiText } from './core/i18n/ui-text';
import type { IconName } from './shared/ui/icon';

/**
 * The sections of the app besides the course itself. The side navigation and the home page
 * both list them from here, so a new section needs one entry, plus its route in app.routes.ts.
 */
export interface AppSection {
  readonly label: keyof UiText['nav'];
  /** One line about the section on the home page. */
  readonly hint: keyof UiText['home'];
  readonly icon: IconName;
  readonly group: 'reference' | 'study';
  /** Sections without a path are not in the Angular version yet. */
  readonly path?: string;
}

export const APP_SECTIONS: readonly AppSection[] = [
  { label: 'laws', hint: 'lawsHint', icon: 'law', group: 'reference', path: '/laws' },
  { label: 'glossary', hint: 'glossaryHint', icon: 'glossary', group: 'reference' },
  { label: 'templates', hint: 'templatesHint', icon: 'template', group: 'reference' },
  { label: 'checklists', hint: 'checklistsHint', icon: 'checklist', group: 'reference' },
  { label: 'fees', hint: 'feesHint', icon: 'calculator', group: 'reference' },
  { label: 'tests', hint: 'testsHint', icon: 'test', group: 'study' },
  { label: 'flashcards', hint: 'flashcardsHint', icon: 'cards', group: 'study' },
];
