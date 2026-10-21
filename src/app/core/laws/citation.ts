import type { Language, Localized } from '../i18n/language';

/*
 * Law references and citations.
 *
 * A reference names a provision: "znnd:25:9:2" is act "znnd", article 25, paragraph 9, item 2.
 * Course texts cite a provision as [[znnd:25:9]] or [[znnd:25:9|custom label]].
 *
 * This file has no Angular imports, so that tools/check-content.ts can use it too.
 */

export interface LawReference {
  readonly act: string;
  /** Article number ("25", "25а") or provision number ("§1"). Empty for the act itself. */
  readonly article: string;
  readonly paragraph?: string;
  readonly point?: string;
}

export interface Citation {
  readonly ref: string;
  readonly label?: string;
}

/** Matches a citation in Markdown: [[ref]] or [[ref|label]]. */
export const CITATION_PATTERN = /\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g;

export function parseReference(ref: string): LawReference {
  const [act = '', article = '', paragraph, point] = ref.trim().split(':');
  return { act, article, paragraph: paragraph || undefined, point: point || undefined };
}

export function toReferenceString(reference: LawReference): string {
  return [reference.act, reference.article, reference.paragraph, reference.point]
    .filter(Boolean)
    .join(':');
}

/** "znnd:25" for any paragraph of article 25 of the act. */
export function articleKey(reference: LawReference): string {
  return `${reference.act}:${reference.article}`;
}

/** All citations in a Markdown text, in order. */
export function findCitations(markdown: string): Citation[] {
  return [...markdown.matchAll(CITATION_PATTERN)].map(([, ref, label]) => ({
    ref: ref.trim(),
    label: label || undefined,
  }));
}

/** The parts of a catalog entry that a label needs. */
export interface LabelSource {
  readonly abbr: string;
  readonly unit?: Localized;
}

/** Human label of a reference: "чл. 25, ал. 9 ЗННД" in Bulgarian, "Art. 25(9) ЗННД" in English. */
export function formatReference(
  reference: LawReference,
  source: LabelSource | undefined,
  language: Language,
): string {
  const abbr = source?.abbr ?? reference.act;
  const { article, paragraph, point } = reference;
  if (!article) {
    return abbr;
  }
  if (article.startsWith('§')) {
    const number = article.slice(1);
    const paragraphPart = paragraph
      ? language === 'bg'
        ? `, ал. ${paragraph}`
        : `(${paragraph})`
      : '';
    return `§ ${number}${paragraphPart} ${abbr}`;
  }
  const unit = source?.unit?.[language] ?? (language === 'bg' ? 'чл.' : 'Art.');
  if (language === 'bg') {
    const paragraphPart = paragraph ? `, ал. ${paragraph}` : '';
    const pointPart = point ? `, т. ${point}` : '';
    return `${unit} ${article}${paragraphPart}${pointPart} ${abbr}`;
  }
  const paragraphPart = paragraph ? `(${paragraph})` : '';
  const pointPart = point ? `, item ${point}` : '';
  return `${unit} ${article}${paragraphPart}${pointPart} ${abbr}`;
}

const escapeForRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Latin letters for the Cyrillic letter after an article number ("28a" for "28а"), as the
 * official transliteration writes them, for a reader with a Latin keyboard.
 */
const LATIN_LETTERS: Readonly<Record<string, string>> = {
  a: 'а',
  b: 'б',
  v: 'в',
  g: 'г',
  d: 'д',
  e: 'е',
  z: 'з',
  i: 'и',
  k: 'к',
  l: 'л',
  m: 'м',
  n: 'н',
  o: 'о',
  p: 'п',
  r: 'р',
  s: 'с',
  t: 'т',
  u: 'у',
  f: 'ф',
  h: 'х',
};

/** A number, and a letter right after it that does not start a word: "25", "28а", "28a". */
const NUMBER = /(\d+)([a-zа-я](?![a-zа-я]))?/.source;
const ARTICLE_MARK = /(?:чл\.?|член|art\.?|article|т\.|item)\s*/.source;
const PROVISION_MARK = /(?:§|пар\.|параграф)\s*/.source;
const PARAGRAPH = /(?:ал\.?|алинея|para\.?|paragraph|\()\s*(\d+)/;

/** An article number as the act writes it: the digits and a Cyrillic letter. */
function articleNumber(digits: string, letter = ''): string {
  return digits + (LATIN_LETTERS[letter] ?? letter);
}

/**
 * The article or provision that a text names when it is only a number: "25", "чл. 25", "28a"
 * (article "28а"), "§ 1" or "пар. 1" (provision "§1"). Undefined for any other text.
 */
export function typedArticle(text: string): string | undefined {
  const lower = text.trim().toLowerCase();
  const provision = lower.match(new RegExp(`^${PROVISION_MARK}${NUMBER}$`));
  if (provision) return `§${articleNumber(provision[1], provision[2])}`;
  const article = lower.match(new RegExp(`^(?:${ARTICLE_MARK})?${NUMBER}$`));
  return article ? articleNumber(article[1], article[2]) : undefined;
}

/** An act name as a person types it: lower case, without "№", with single spaces. */
const simplifyName = (text: string) => text.toLowerCase().replace(/№/g, ' ').replace(/\s+/g, ' ');

/**
 * Parse a citation typed by a person, for example "чл. 25, ал. 9 ЗННД", "ЗННД 25",
 * "Art. 28a(1) ZNND" or "§ 1 ЗННД". The act is its abbreviation or its id; the article can come
 * before or after the paragraph. Returns undefined when no act of the catalog is named.
 */
export function parseCitationText(
  text: string,
  catalog: readonly { readonly id: string; readonly abbr: string }[],
): LawReference | undefined {
  const lower = simplifyName(text).trim();
  if (!lower) {
    return undefined;
  }
  let match:
    { readonly entry: { readonly id: string; readonly abbr: string }; name: string } | undefined;
  for (const entry of catalog) {
    for (const name of [simplifyName(entry.abbr).trim(), entry.id]) {
      const named = new RegExp(`(^|[^а-яa-z])${escapeForRegExp(name)}([^а-яa-z]|$)`).test(lower);
      // Prefer the longest abbreviation, so that "ЗЗДет" is not read as "ЗЗД".
      if (named && (!match || name.length > match.name.length)) {
        match = { entry, name };
      }
    }
  }
  if (!match) {
    return undefined;
  }
  const act = match.entry.id;
  const rest = ` ${lower.replace(match.name, ' ')} `;
  const provision = rest.match(new RegExp(PROVISION_MARK + NUMBER));
  if (provision) {
    return { act, article: `§${articleNumber(provision[1], provision[2])}` };
  }
  // A marked number first ("чл. 25"), so that "ал. 9 чл. 25" reads article 25; else a bare number.
  const article =
    rest.match(new RegExp(ARTICLE_MARK + NUMBER)) ?? rest.match(new RegExp(`\\s${NUMBER}`));
  if (!article) {
    return { act, article: '' };
  }
  const withoutArticle = rest.replace(article[0], ' ');
  return {
    act,
    article: articleNumber(article[1], article[2]),
    paragraph: withoutArticle.match(PARAGRAPH)?.[1],
  };
}
