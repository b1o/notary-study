/**
 * The layout of a document template. A template is plain text, as it is typed; this file finds its
 * parts, so that the page can set it like the paper document:
 *
 *   НОТАРИАЛЕН АКТ                        title: the first block; its next lines are the subtitle
 *   за покупко-продажба на недвижим имот
 *   № [...], том [...], рег. № [...]      register line: a line that starts with "№"
 *   УПЪЛНОМОЩАВАМ                         heading: a block of one short line in capitals
 *   Днес, [дата] г., пред мен, ...        text: every other line; a blank line ends a block
 *   ПРОДАВАЧ: ..........  (име)           signatures: a line with a run of dots
 *   ---                                   a certification of the notary (a stamp) follows;
 *                                         each "---" starts one more stamp
 *
 * In a line, "[...]" is a blank to fill in (blanks can hold blanks) and "[ ]" is a box to tick.
 */

export type TextPart =
  | { readonly kind: 'text'; readonly text: string }
  | { readonly kind: 'blank'; readonly parts: Line }
  | { readonly kind: 'tick' };

export type Line = readonly TextPart[];

/** One person who signs: "ПРОДАВАЧ: ..........". */
export interface Signer {
  /** The role before the line as written ("ПРОДАВАЧ:", "1."); null for a line without a role. */
  readonly role: Line | null;
  /** The number of signature lines: two spouses who donate together sign twice. */
  readonly lines: number;
  /** The text in brackets after the line, such as "(собственоръчно изписани три имена)". */
  readonly note: Line | null;
  /** The notary signs with the seal (Art. 19(1) of Ordinance No. 32). */
  readonly seal: boolean;
}

/** One line of signatures: the place and the date at the start, the signers at the end. */
export interface SignatureRow {
  readonly place: Line | null;
  readonly signers: readonly Signer[];
}

type BlockContent =
  | { readonly kind: 'title'; readonly title: Line; readonly subtitle: readonly Line[] }
  | { readonly kind: 'register'; readonly line: Line }
  | { readonly kind: 'heading'; readonly line: Line }
  | { readonly kind: 'text'; readonly lines: readonly Line[] }
  | { readonly kind: 'signatures'; readonly rows: readonly SignatureRow[] };

/** A block of the document. `gap` is true when a blank line comes before it in the text. */
export type DocumentBlock = BlockContent & { readonly gap: boolean };

export interface DocumentLayout {
  readonly body: readonly DocumentBlock[];
  /** The certifications under the document (each after a line "---"), set as stamps. */
  readonly stamps: readonly (readonly DocumentBlock[])[];
}

/** The role of the notary, who signs with the seal. */
const NOTARY_ROLE = 'НОТАРИУС';
/** A run of dots or ellipses: the line on which a person signs. */
const SIGNATURE_LINE = /[.…]{6,}/;
/** A text followed by a signature line, in one segment: "ПРОДАВАЧ: ..........". */
const LABELLED_LINE = /^(.*?)\s*[.…]{6,}$/;
/** A heading is a short line in capitals, such as "ДЕКЛАРИРАМ, ЧЕ:". */
const HEADING_MAX_LENGTH = 40;

export function documentLayout(text: string): DocumentLayout {
  const [bodyLines, ...stampLines] = sections(text.replace(/\r\n?/g, '\n').split('\n'));
  return {
    body: blocks(paragraphs(bodyLines), true),
    stamps: stampLines
      .map((lines) => blocks(paragraphs(lines), false))
      .filter((stamp) => stamp.length > 0),
  };
}

/** The lines before the first "---", and the lines after each "---". */
function sections(lines: readonly string[]): string[][] {
  const result: string[][] = [[]];
  for (const line of lines) {
    if (line.trim() === '---') {
      result.push([]);
    } else {
      result[result.length - 1].push(line);
    }
  }
  return result;
}

/** The groups of lines between blank lines. */
function paragraphs(lines: readonly string[]): string[][] {
  const groups: string[][] = [];
  let current: string[] = [];
  for (const line of lines) {
    if (line.trim() === '') {
      if (current.length) groups.push(current);
      current = [];
    } else {
      current.push(line);
    }
  }
  if (current.length) groups.push(current);
  return groups;
}

function blocks(groups: readonly string[][], withTitle: boolean): DocumentBlock[] {
  const result: DocumentBlock[] = [];
  groups.forEach((group, index) => {
    const gap = index > 0;
    if (withTitle && index === 0) {
      result.push(...titleBlocks(group));
    } else if (group.length === 1 && isRegister(group[0])) {
      result.push({ kind: 'register', line: parseLine(group[0].trim()), gap });
    } else if (group.length === 1 && isHeading(group[0])) {
      result.push({ kind: 'heading', line: parseLine(group[0].trim()), gap });
    } else {
      // Only the first block of a group follows a blank line.
      result.push(
        ...textAndSignatures(group).map((block, at) => ({ ...block, gap: gap && at === 0 })),
      );
    }
  });
  return result;
}

/** The first block: the title, the lines under it, and the register line if it is there. */
function titleBlocks(group: readonly string[]): DocumentBlock[] {
  const [title, ...rest] = group.map((line) => line.trim());
  const subtitle = rest.filter((line) => !isRegister(line)).map(parseLine);
  const register = rest.filter(isRegister).map((line) => parseLine(line));
  return [
    { kind: 'title', title: parseLine(title), subtitle, gap: false },
    ...register.map((line): DocumentBlock => ({ kind: 'register', line, gap: false })),
  ];
}

/** A block can mix text lines and signature lines, as a certification does. */
function textAndSignatures(group: readonly string[]): BlockContent[] {
  const result: BlockContent[] = [];
  let text: Line[] = [];
  let rows: SignatureRow[] = [];
  const flushText = () => {
    if (text.length) result.push({ kind: 'text', lines: text });
    text = [];
  };
  const flushRows = () => {
    if (rows.length) result.push({ kind: 'signatures', rows });
    rows = [];
  };
  for (const line of group) {
    if (SIGNATURE_LINE.test(line)) {
      flushText();
      rows.push(signatureRow(line));
    } else if (rows.length && isNote(line)) {
      rows = [...rows.slice(0, -1), withNote(rows[rows.length - 1], line.trim())];
    } else {
      flushRows();
      text.push(parseLine(line.trim()));
    }
  }
  flushText();
  flushRows();
  return result;
}

/**
 * The segments of a signature line are apart by two or more spaces:
 * "[Дата], гр. [...]   УПЪЛНОМОЩИТЕЛ: ..........   (печат)".
 */
function signatureRow(line: string): SignatureRow {
  let place: Line | null = null;
  let pendingRole: string | null = null;
  let signers: Signer[] = [];
  for (const segment of line.trim().split(/\s{2,}/)) {
    const labelled = LABELLED_LINE.exec(segment);
    if (labelled) {
      const label = labelled[1] || pendingRole;
      pendingRole = null;
      if (!label && signers.length) {
        const last = signers[signers.length - 1];
        signers = [...signers.slice(0, -1), { ...last, lines: last.lines + 1 }];
      } else {
        signers.push(signer(label));
      }
    } else if (segment.endsWith(':')) {
      pendingRole = segment;
    } else if (isNote(segment) && signers.length) {
      signers = [...signers.slice(0, -1), noted(signers[signers.length - 1], segment)];
    } else {
      place = parseLine(segment);
    }
  }
  return { place, signers };
}

function signer(label: string | null): Signer {
  const role = label?.trim() || null;
  const seal = role?.replace(/:$/, '') === NOTARY_ROLE;
  return { role: role ? parseLine(role) : null, lines: 1, note: null, seal };
}

/** A note in brackets: "(печат)" asks for the seal; any other note goes under the line. */
function noted(person: Signer, note: string): Signer {
  const inner = note.slice(1, -1).trim();
  return inner === 'печат' ? { ...person, seal: true } : { ...person, note: parseLine(inner) };
}

/** A note on a line of its own belongs to the last signer of the row above. */
function withNote(row: SignatureRow, note: string): SignatureRow {
  const signers = row.signers;
  if (!signers.length) return row;
  return { ...row, signers: [...signers.slice(0, -1), noted(signers[signers.length - 1], note)] };
}

function isNote(text: string): boolean {
  return /^\(.*\)$/.test(text.trim());
}

function isRegister(line: string): boolean {
  return /^№\s/.test(line.trim());
}

function isHeading(line: string): boolean {
  const text = line.trim();
  return (
    text.length <= HEADING_MAX_LENGTH &&
    /\p{Lu}/u.test(text) &&
    text === text.toLocaleUpperCase('bg') &&
    !SIGNATURE_LINE.test(text) &&
    !isRegister(text)
  );
}

/** The parts of a line: text, blanks "[...]" (also inside blanks) and boxes to tick "[ ]". */
export function parseLine(text: string): Line {
  const root: TextPart[] = [];
  const open: TextPart[][] = [root];
  let buffer = '';
  const current = () => open[open.length - 1];
  const flush = () => {
    if (buffer) current().push({ kind: 'text', text: buffer });
    buffer = '';
  };
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (text.startsWith('[ ]', index)) {
      flush();
      current().push({ kind: 'tick' });
      index += 2;
    } else if (char === '[') {
      flush();
      const parts: TextPart[] = [];
      current().push({ kind: 'blank', parts });
      open.push(parts);
    } else if (char === ']' && open.length > 1) {
      flush();
      open.pop();
    } else {
      buffer += char;
    }
  }
  flush();
  return root;
}

/** The text of a line without its marks, for a test or a label. */
export function lineText(line: Line): string {
  return line
    .map((part) => {
      if (part.kind === 'text') return part.text;
      if (part.kind === 'tick') return '[ ]';
      return `[${lineText(part.parts)}]`;
    })
    .join('');
}
