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
    const paragraphPart = paragraph ? (language === 'bg' ? `, ал. ${paragraph}` : `(${paragraph})`) : '';
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
 * Parse a citation typed by a person, for example "чл. 25, ал. 9 ЗННД", "ЗННД 25" or "Art. 586 ГПК".
 * Returns undefined when no act of the catalog is named.
 */
export function parseCitationText(
  text: string,
  catalog: readonly { readonly id: string; readonly abbr: string }[],
): LawReference | undefined {
  const lower = text.trim().toLowerCase();
  if (!lower) {
    return undefined;
  }
  let match: { readonly id: string; readonly abbr: string } | undefined;
  for (const entry of catalog) {
    const names = [entry.abbr.toLowerCase(), entry.id];
    const named = names.some((name) =>
      new RegExp(`(^|[^а-яa-z])${escapeForRegExp(name)}([^а-яa-z]|$)`, 'i').test(lower),
    );
    // Prefer the longest abbreviation, so that "ЗЗДет" is not read as "ЗЗД".
    if (named && (!match || entry.abbr.length > match.abbr.length)) {
      match = entry;
    }
  }
  if (!match) {
    return undefined;
  }
  const rest = lower.replace(match.abbr.toLowerCase(), ' ');
  const provision = rest.match(/§\s*(\d+[а-я]?)/);
  if (provision) {
    return { act: match.id, article: `§${provision[1]}` };
  }
  const article = rest.match(/(?:чл\.?|art\.?|т\.|item|^|\s)\s*(\d+[а-я]?)/i);
  if (!article) {
    return { act: match.id, article: '' };
  }
  const paragraph = rest.match(/(?:ал\.?\s*|\()(\d+)/i);
  return { act: match.id, article: article[1], paragraph: paragraph?.[1] };
}
