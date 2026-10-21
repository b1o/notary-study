/*
 * Helpers for displaying the text of an article.
 * Lines look like "Чл. 25. (1) Нотариусът ... (Изм. - ДВ, бр. 18 от 2003 г.)".
 * The English translations use the same shape: "Art. 25. (1) The notary ...".
 */

/**
 * Amendment and publication notes such as "(Изм. - ДВ, бр. 18 от 2003 г.)", "(НОВА - ДВ ...)"
 * or "(Ал. 2 отм. - ДВ, бр. 12 от 1993 г.)". They may contain nested brackets.
 */
const AMENDMENT_NOTE =
  /\((?:Нов|Изм|Доп|Отм|Предиш|Попр|Загл|Обявен|Обн|(?:Ал|Т)\.\s*\d+[а-я]?\s+(?:отм|изм|доп))[^()]*?(?:\([^()]*\)[^()]*?)*\)/gi;

/** One amendment note at the start of a text, with the space around it. */
const NOTE_AT_START = new RegExp(String.raw`^\s*` + AMENDMENT_NOTE.source + String.raw`\s*`, 'i');

/** The article or provision number at the start of a line: "Чл. 25а.", "Art. 25a.", "§ 1.". */
const LINE_NUMBER = /^(?:(?:Чл|Art)\.\s*\d+[а-яa-z]?\.|§\s*\d+[а-яa-z]?\.)/;

/** "(9)" at the start of a paragraph, after the line number if there is one. */
const PARAGRAPH_NUMBER = /^\s*\((\d+[а-яa-z]?)\)/;

/** The marker of a list item inside a paragraph: "1.", "2а.", "а)" or "a)". */
const ITEM = /^(\d+[а-яa-z]?\.|[а-яa-z]\))\s/;

/** "Глава първа.", "Раздел I.", "Част втора." at the start of a heading. */
const HEADING_LABEL = /^((?:Глава|Раздел|Подраздел|Част|Дял)\s+[^.]+)\.\s*/;

export interface TextSegment {
  readonly kind: 'text' | 'amendment';
  readonly text: string;
}

export interface LawLine {
  /** The item marker ("1.", "а)"), shown in the margin. Undefined for a line that is not an item. */
  readonly marker?: string;
  /** Amendment notes before the text of the line. They show on their own, smaller line. */
  readonly notes: readonly string[];
  /** The text of the line. Notes inside the text stay in place as "amendment" segments. */
  readonly segments: readonly TextSegment[];
}

/** Consecutive lines of one paragraph. */
export interface LawParagraph {
  /** "9" for paragraph (9). Undefined for text before the first numbered paragraph. */
  readonly number?: string;
  /** "(9)" when the text writes the number, shown in the margin. */
  readonly marker?: string;
  readonly lines: readonly LawLine[];
}

export interface HeadingParts {
  /** "Глава първа", without the final dot, when the heading starts with such a label. */
  readonly label?: string;
  readonly title: string;
  readonly notes: readonly string[];
  /** True when the title is in capital letters, as many chapter titles are in the source. */
  readonly caps: boolean;
}

/** Split text into plain parts and amendment notes. */
export function segmentText(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let last = 0;
  for (const match of text.matchAll(AMENDMENT_NOTE)) {
    if (match.index > last) segments.push({ kind: 'text', text: text.slice(last, match.index) });
    segments.push({ kind: 'amendment', text: match[0] });
    last = match.index + match[0].length;
  }
  if (last < text.length) segments.push({ kind: 'text', text: text.slice(last) });
  return segments;
}

/**
 * The explicit paragraph number of a line, for example "9" for "(9) ...", or undefined.
 * An amendment note of the article can stand before it: "Чл. 3. (Изм. - ДВ ...) (1) ...".
 */
export function ownParagraphNumber(line: string): string | undefined {
  return PARAGRAPH_NUMBER.exec(leadingNotes(line.replace(LINE_NUMBER, '')).rest)?.[1];
}

/**
 * The paragraph that each line belongs to.
 * Items ("1. ...", "а) ...") always belong to the paragraph above them.
 * Acts with numbered paragraphs use the number "(9)". Acts without numbers (for example the
 * Obligations and Contracts Act) count the lines that are not items: the second such line is paragraph 2.
 */
export function paragraphOfLines(lines: readonly string[]): (string | undefined)[] {
  const own = lines.map(ownParagraphNumber);
  if (own.some((number) => number !== undefined)) {
    let current: string | undefined;
    return own.map((number) => (current = number ?? current));
  }
  let count = 0;
  return lines.map((line, index) => String(isItem(line, index) ? Math.max(count, 1) : ++count));
}

/**
 * The lines of an article, grouped into paragraphs. The article number ("Чл. 25.") is left out:
 * the views show it in the article header. Paragraph numbers and item markers are split off,
 * so that the views can set them in the margin.
 */
export function groupParagraphs(lines: readonly string[]): LawParagraph[] {
  const numbers = paragraphOfLines(lines);
  const paragraphs: { number?: string; marker?: string; lines: LawLine[] }[] = [];
  lines.forEach((line, index) => {
    let rest = line.replace(LINE_NUMBER, '').trim();
    // The notes of the article can stand before the paragraph number; they stay notes of the line.
    const before = leadingNotes(rest);
    const paragraph = PARAGRAPH_NUMBER.exec(before.rest);
    if (paragraph) rest = before.rest.slice(paragraph[0].length).trim();
    const item = !paragraph && isItem(line, index) ? ITEM.exec(rest) : null;
    if (item) rest = rest.slice(item[0].length).trim();
    const { notes, rest: text } = leadingNotes(rest);
    const lawLine: LawLine = {
      marker: item?.[1],
      notes: paragraph ? [...before.notes, ...notes] : notes,
      segments: segmentText(text),
    };

    const last = paragraphs.at(-1);
    if (last && index > 0 && last.number === numbers[index]) {
      last.lines.push(lawLine);
    } else {
      const marker = paragraph ? `(${paragraph[1]})` : undefined;
      paragraphs.push({ number: numbers[index], marker, lines: [lawLine] });
    }
  });
  return paragraphs;
}

/** Split a heading such as "Глава втора. НОТАРИУС (Изм. - ДВ ...)" into label, title and notes. */
export function splitHeading(text: string): HeadingParts {
  const label = HEADING_LABEL.exec(text);
  const rest = label ? text.slice(label[0].length) : text;
  const notes = rest.match(AMENDMENT_NOTE) ?? [];
  const title = rest.replace(AMENDMENT_NOTE, '').replace(/\s+/g, ' ').trim() || rest.trim();
  const letters = title.replace(/[^\p{L}]/gu, '');
  return {
    label: label?.[1],
    title,
    notes,
    caps: letters.length > 1 && letters === letters.toUpperCase(),
  };
}

/** The first line holds the article number, so it is never an item. */
const isItem = (line: string, index: number) => index > 0 && ITEM.test(line);

/** The amendment notes at the very start of a text, and the text after them. */
function leadingNotes(text: string): { notes: string[]; rest: string } {
  const notes: string[] = [];
  let rest = text;
  for (let match = NOTE_AT_START.exec(rest); match; match = NOTE_AT_START.exec(rest)) {
    notes.push(match[0].trim());
    rest = rest.slice(match[0].length);
  }
  return { notes, rest: rest.trim() };
}
