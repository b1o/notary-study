import type { Localized } from '../i18n/language';

/** Shapes of the JSON files in public/data. Keep them in sync with tools/check-content.ts. */

export interface Part {
  readonly id: string;
  readonly title: Localized;
  /** Chapter ids in reading order. */
  readonly chapters: readonly string[];
}

export interface ChapterMeta {
  readonly id: string;
  readonly number: number;
  readonly part: string;
  /** File name without extension in public/data/chapters/<lang>/. */
  readonly file: string;
  readonly minutes: number;
  readonly title: Localized;
  readonly summary: Localized;
}

/** public/data/manifest.json */
export interface Manifest {
  readonly parts: readonly Part[];
  readonly chapters: readonly ChapterMeta[];
}

export interface Flashcard {
  readonly front: string;
  readonly back: string;
}

export interface QuizQuestion {
  readonly question: string;
  readonly options: readonly string[];
  /** Index of the correct option. Options are shuffled when shown. */
  readonly answer: number;
  readonly explanation: string;
  /** Law references, for example "znnd:25:9". */
  readonly refs: readonly string[];
}

/** public/data/chapters/<lang>/<file>.json. The chapter text is in the .md file next to it. */
export interface ChapterData {
  readonly id: string;
  readonly objectives: readonly string[];
  readonly cards: readonly Flashcard[];
  readonly quiz: readonly QuizQuestion[];
}

/** One entry of public/data/glossary.json. */
export interface GlossaryTerm {
  readonly bg: string;
  readonly en: string;
  readonly definition: Localized;
  readonly refs: readonly string[];
  readonly chapter?: string;
}

export interface TemplateGroup {
  readonly id: string;
  readonly title: Localized;
}

/** A box at the top of a printed form, such as the fee box and the entry box of a deed. */
export interface FormBox {
  readonly title: string;
  /** Lines with blanks "[...]" (see core/reference/document-layout.ts). */
  readonly lines: readonly string[];
}

/** The fixed parts of a printed form, the same for each document on it. */
export interface DocumentForm {
  readonly id: string;
  readonly boxes: readonly FormBox[];
}

export interface DocumentTemplate {
  readonly id: string;
  readonly group: string;
  /** The form that the document is printed on, if it has one. */
  readonly form?: string;
  readonly title: Localized;
  readonly use: Localized;
  readonly refs: readonly string[];
  /** The Bulgarian working text. */
  readonly text: string;
  /** English working translation of the text. */
  readonly translation: string;
  /** Notes in Markdown. */
  readonly notes: Localized;
}

/** public/data/templates.json */
export interface TemplateLibrary {
  readonly groups: readonly TemplateGroup[];
  readonly forms: readonly DocumentForm[];
  readonly templates: readonly DocumentTemplate[];
}

export interface ChecklistSection {
  readonly title: Localized;
  /** Items in Markdown (inline only). */
  readonly items: readonly Localized[];
}

/** One entry of public/data/checklists.json. */
export interface Checklist {
  readonly id: string;
  readonly chapter?: string;
  readonly title: Localized;
  readonly when: Localized;
  readonly sections: readonly ChecklistSection[];
}
