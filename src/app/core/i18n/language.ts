/** The two languages of the course. Bulgarian is the language of every legal text. */
export type Language = 'bg' | 'en';

export const LANGUAGES: readonly Language[] = ['bg', 'en'];

/** A value that exists in both languages, for example a title. */
export type Localized<T = string> = Readonly<Record<Language, T>>;

export function isLanguage(value: unknown): value is Language {
  return value === 'bg' || value === 'en';
}
