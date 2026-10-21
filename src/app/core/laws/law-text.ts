/*
 * Helpers for displaying the text of an article.
 * Lines look like "Чл. 25. (1) Нотариусът ... (Изм. - ДВ, бр. 18 от 2003 г.)".
 * The English translations use the same shape: "Art. 25. (1) The notary ...".
 */

/** Amendment notes such as "(Изм. - ДВ, бр. 18 от 2003 г.)", which may contain nested brackets. */
const AMENDMENT_NOTE =
  /\((?:Нов|Нова|Ново|Нови|Изм|Доп|Отм|Предишн|Попр|Загл|Обявен|изм|доп|отм|нова|нов|предишн)[^()]*?(?:\([^()]*\)[^()]*?)*\)/g;

/** The article or provision number at the start of a line: "Чл. 25а.", "Art. 25a.", "§ 1.". */
const LINE_NUMBER = /^(?:(?:Чл|Art)\.\s*\d+[а-яa-z]?\.|§\s*\d+[а-яa-z]?\.)/;

/** "(9)" at the start of a paragraph, after the line number if there is one. */
const PARAGRAPH_NUMBER = /^(\s*)\((\d+[а-яa-z]?)\)/;

/** An item of a list inside a paragraph: "1. ...", "2а. ...", "а) ..." or "a) ...". */
const ITEM = /^(?:\d+[а-яa-z]?\.|[а-яa-z]\))\s/;

export interface TextSegment {
  readonly kind: 'number' | 'paragraph' | 'text' | 'amendment';
  readonly text: string;
}

export interface LawLine {
  readonly segments: readonly TextSegment[];
  /** True for an item of a list ("1. ...") inside a paragraph. */
  readonly item: boolean;
}

/** Consecutive lines of one paragraph. */
export interface LawParagraph {
  /** "9" for paragraph (9). Undefined for text before the first numbered paragraph. */
  readonly number?: string;
  readonly lines: readonly LawLine[];
}

/** Split a line into its article number, paragraph number, plain text and amendment notes. */
export function segmentLine(line: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let rest = line;
  const number = LINE_NUMBER.exec(rest);
  if (number) {
    segments.push({ kind: 'number', text: number[0] });
    rest = rest.slice(number[0].length);
  }
  const paragraph = PARAGRAPH_NUMBER.exec(rest);
  if (paragraph) {
    if (paragraph[1]) segments.push({ kind: 'text', text: paragraph[1] });
    segments.push({ kind: 'paragraph', text: `(${paragraph[2]})` });
    rest = rest.slice(paragraph[0].length);
  }
  let last = 0;
  for (const match of rest.matchAll(AMENDMENT_NOTE)) {
    const start = match.index;
    if (start > last) segments.push({ kind: 'text', text: rest.slice(last, start) });
    segments.push({ kind: 'amendment', text: match[0] });
    last = start + match[0].length;
  }
  if (last < rest.length) segments.push({ kind: 'text', text: rest.slice(last) });
  return segments;
}

/** The explicit paragraph number of a line, for example "9" for "(9) ...", or undefined. */
export function ownParagraphNumber(line: string): string | undefined {
  return PARAGRAPH_NUMBER.exec(line.replace(LINE_NUMBER, ''))?.[2];
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

/** The lines of an article, grouped into paragraphs and split into segments. */
export function groupParagraphs(lines: readonly string[]): LawParagraph[] {
  const numbers = paragraphOfLines(lines);
  const paragraphs: { number?: string; lines: LawLine[] }[] = [];
  lines.forEach((line, index) => {
    const lawLine = { segments: segmentLine(line), item: isItem(line, index) };
    const last = paragraphs.at(-1);
    if (last && index > 0 && last.number === numbers[index]) {
      last.lines.push(lawLine);
    } else {
      paragraphs.push({ number: numbers[index], lines: [lawLine] });
    }
  });
  return paragraphs;
}

/** The first line holds the article number, so it is never an item. */
const isItem = (line: string, index: number) => index > 0 && ITEM.test(line);
