/**
 * Check the course data in public/data.
 *
 * Problems (exit code 1):
 *   - a citation or a reference points to an act, an article, a paragraph or an item that the
 *     library does not have;
 *   - an article number uses a Latin letter instead of the Cyrillic one (25a instead of 25а);
 *   - a chapter link (chapter: '...') names a chapter that the manifest does not have;
 *   - a chapter is missing in one language, or the two languages have different numbers of cards or questions;
 *   - a card has no id, repeats an id of its chapter, or has another id in the other language
 *     (the saved flashcard boxes use the id);
 *   - a quiz question has fewer than two options or an answer index outside the options;
 *   - in a chapter, the right answer is the longest option in more than a third of the questions
 *     (a reader can pass such a test without knowledge);
 *   - a translation key names an article that its act does not have.
 * Warnings: a cited article has no English translation; a right answer is at least twice as long
 * as the mean of the wrong options; a lesson, card, explanation or template note names a library
 * article in plain text instead of a citation.
 *
 * Usage: bun run check:content   (or: node tools/check-content.ts)
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import type {
  ChapterData,
  Checklist,
  GlossaryTerm,
  Manifest,
  TemplateLibrary,
} from '../src/app/core/content/content.models.ts';
import type { Language } from '../src/app/core/i18n/language.ts';
import { findCitations, parseReference } from '../src/app/core/laws/citation.ts';
import { groupParagraphs } from '../src/app/core/laws/law-text.ts';
import type { ActTranslation, LawAct, LawCatalogEntry } from '../src/app/core/laws/law.models.ts';

const DATA = join(import.meta.dirname, '..', 'public', 'data');
const LANGUAGES: readonly Language[] = ['bg', 'en'];
const LATIN_TO_CYRILLIC: Readonly<Record<string, string>> = {
  a: 'а',
  e: 'е',
  o: 'о',
  p: 'р',
  c: 'с',
  x: 'х',
  y: 'у',
  A: 'А',
  B: 'В',
  E: 'Е',
  K: 'К',
  M: 'М',
  H: 'Н',
  O: 'О',
  P: 'Р',
  C: 'С',
  T: 'Т',
  X: 'Х',
};

const problems: string[] = [];
const warnings: string[] = [];
const readJson = <T>(...path: string[]): T =>
  JSON.parse(readFileSync(join(DATA, ...path), 'utf8')) as T;
const readText = (...path: string[]) => readFileSync(join(DATA, ...path), 'utf8');

// ---- Law library -------------------------------------------------------------------------------

/** A part of an HTML tag that the importer left in a law text, such as "./span>." */
const HTML_REMNANT = /<\/?[a-z]+|\/span>/i;

const catalog = readJson<LawCatalogEntry[]>('laws', 'catalog.json');
const articlesByAct = new Map<string, Set<string>>();
/** "znnd:25" → paragraph number → item numbers ("1", "2а", "а"), as the law views group them. */
const paragraphsByArticle = new Map<string, Map<string | undefined, Set<string>>>();
for (const entry of catalog) {
  const act = readJson<LawAct>('laws', 'acts', `${entry.id}.json`);
  const numbers = act.items.flatMap((item) => ('number' in item ? [item.number] : []));
  articlesByAct.set(entry.id, new Set(numbers));
  for (const item of act.items) {
    if (!('number' in item)) continue;
    const paragraphs = new Map<string | undefined, Set<string>>();
    for (const group of groupParagraphs(item.paragraphs)) {
      const items = paragraphs.get(group.number) ?? new Set<string>();
      group.lines.forEach((line) => line.marker && items.add(line.marker.replace(/[.)]$/, '')));
      paragraphs.set(group.number, items);
    }
    paragraphsByArticle.set(`${entry.id}:${item.number}`, paragraphs);
  }
  for (const item of act.items) {
    const texts = 'paragraphs' in item ? item.paragraphs : 'text' in item ? [item.text] : [];
    if (texts.some((text) => HTML_REMNANT.test(text))) {
      problems.push(
        `laws/acts/${entry.id}.json: HTML left in ${'number' in item ? item.number : 'a heading'}`,
      );
    }
  }
}

const translations = new Map<string, Set<string>>();
for (const file of readdirSync(join(DATA, 'laws', 'en'))) {
  const act = file.replace(/\.json$/, '');
  const keys = Object.keys(readJson<ActTranslation>('laws', 'en', file));
  translations.set(act, new Set(keys));
  for (const key of keys) {
    if (!articlesByAct.get(act)?.has(key))
      problems.push(`laws/en/${file}: ${act} has no article "${key}"`);
  }
}

const untranslated = new Set<string>();

/** Check one reference ("znnd:25:9"). `where` names the file for the report. */
function checkReference(ref: string, where: string, english: boolean): void {
  const { act, article, paragraph, point } = parseReference(ref);
  const articles = articlesByAct.get(act);
  if (!articles) {
    problems.push(`${where}: unknown act "${act}" in "${ref}"`);
    return;
  }
  if (!article) return;
  const cyrillic = [...article].map((ch) => LATIN_TO_CYRILLIC[ch] ?? ch).join('');
  if (cyrillic !== article) {
    problems.push(`${where}: Latin letter in article "${article}" (write "${cyrillic}")`);
  }
  if (!articles.has(cyrillic)) {
    problems.push(`${where}: ${act} has no article "${article}"`);
    return;
  }
  if (english && !translations.get(act)?.has(cyrillic)) {
    untranslated.add(`${act}:${cyrillic}`);
  }
  const paragraphs = paragraphsByArticle.get(`${act}:${cyrillic}`);
  if (!paragraphs) return;
  if (paragraph && !paragraphs.has(paragraph)) {
    problems.push(`${where}: ${act}:${article} has no paragraph "${paragraph}" in "${ref}"`);
    return;
  }
  const items = paragraph
    ? paragraphs.get(paragraph)
    : new Set([...paragraphs.values()].flatMap((set) => [...set]));
  if (point && !items?.has(point)) {
    problems.push(`${where}: ${act}:${article} has no item "${point}" in "${ref}"`);
  }
}

const checkMarkdown = (markdown: string, where: string, english: boolean) =>
  findCitations(markdown).forEach(({ ref }) => checkReference(ref, where, english));

// ---- Plain references --------------------------------------------------------------------------

const actByAbbr = new Map(catalog.map((entry) => [entry.abbr, entry.id]));
const abbrPattern = [...actByAbbr.keys()]
  .sort((a, b) => b.length - a.length)
  .map((abbr) => abbr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .join('|');
/** "Art. 25(9) ЗННД" or "чл. 25, ал. 9 ЗННД": an article and the abbreviation of a library act. */
const PLAIN_REFERENCE: Readonly<Record<Language, RegExp>> = {
  en: new RegExp(
    String.raw`\bArts?\.\s*(\d+[а-я]?)(?:\(\d+[а-я]?\))*(?:,?\s+items?\s+\d+)?\s+(${abbrPattern})(?![А-Яа-я])`,
    'g',
  ),
  bg: new RegExp(
    String.raw`[Чч]л\.\s*(\d+[а-я]?)(?:,\s*ал\.\s*\d+)?(?:,\s*т\.\s*\d+)?\s+(${abbrPattern})(?![А-Яа-я])`,
    'g',
  ),
};

/**
 * Warn about a reference in plain text to an article that the library has, so that the reader
 * gets a link: write [[znnd:25:9]]. Each line is checked on its own. Citations, code blocks and
 * quoted text („...“, a search example) are left out, and so is a line that cites the article.
 */
function checkPlainReferences(text: string, where: string, language: Language): void {
  const visible = text.replace(/```[\s\S]*?```/g, '').replace(/„[^“]*“/g, '');
  for (const line of visible.split('\n')) {
    const cited = new Set(
      findCitations(line).map(({ ref }) => {
        const { act, article } = parseReference(ref);
        return `${act}:${article}`;
      }),
    );
    const plain = line.replace(/\[\[[^\]]*\]\]/g, '');
    for (const [match, article, abbr] of plain.matchAll(PLAIN_REFERENCE[language])) {
      const act = actByAbbr.get(abbr);
      if (act && articlesByAct.get(act)?.has(article) && !cited.has(`${act}:${article}`)) {
        warnings.push(`${where}: plain reference "${match}" (write [[${act}:${article}...]])`);
      }
    }
  }
}

// ---- Test quality ------------------------------------------------------------------------------

/** The length of an option in characters, without the bold marks. */
const optionLength = (option: string) => [...option.replace(/\*\*/g, '')].length;

/**
 * Report a quiz whose right answers stand out by their length. The chapter fails when the right
 * answer is the unique longest option in more than a third of its questions. A question whose
 * right answer is at least twice as long as the mean of the wrong options gets a warning.
 */
function checkLengthBias(quiz: ChapterData['quiz'], where: string): void {
  let longest = 0;
  quiz.forEach((question, index) => {
    const lengths = question.options.map(optionLength);
    const right = lengths[question.answer];
    const others = lengths.filter((_, option) => option !== question.answer);
    if (others.every((length) => length < right)) longest++;
    const mean = others.reduce((sum, length) => sum + length, 0) / others.length;
    if (right >= 2 * mean) {
      warnings.push(
        `${where}: question ${index + 1}: the right answer is twice as long as the others`,
      );
    }
  });
  if (longest * 3 > quiz.length) {
    problems.push(
      `${where}: the right answer is the longest option in ${longest} of ${quiz.length} questions (limit: a third)`,
    );
  }
}

// ---- Course content ----------------------------------------------------------------------------

const manifest = readJson<Manifest>('manifest.json');
const chapterIds = new Set(manifest.chapters.map((chapter) => chapter.id));
const checkChapterLink = (chapter: string | undefined, where: string) => {
  if (chapter && !chapterIds.has(chapter)) problems.push(`${where}: unknown chapter "${chapter}"`);
};

for (const part of manifest.parts) {
  part.chapters.forEach((id) => checkChapterLink(id, `manifest.json part ${part.id}`));
}

for (const meta of manifest.chapters) {
  const counts: string[] = [];
  const cardIds: string[] = [];
  for (const language of LANGUAGES) {
    const where = `chapters/${language}/${meta.file}`;
    if (!existsSync(join(DATA, 'chapters', language, `${meta.file}.md`))) {
      problems.push(`${where}.md: missing`);
      continue;
    }
    const lesson = readText('chapters', language, `${meta.file}.md`);
    checkMarkdown(lesson, `${where}.md`, language === 'en');
    checkPlainReferences(lesson, `${where}.md`, language);
    const data = readJson<ChapterData>('chapters', language, `${meta.file}.json`);
    if (data.id !== meta.id) problems.push(`${where}.json: id "${data.id}" should be "${meta.id}"`);
    const ids = new Set<number>();
    data.cards.forEach((card, index) => {
      if (!Number.isInteger(card.id) || card.id < 0) {
        problems.push(`${where}.json: card ${index + 1} has no id (a whole number from 0)`);
      } else if (ids.has(card.id)) {
        problems.push(`${where}.json: card ${index + 1} repeats the id ${card.id}`);
      }
      ids.add(card.id);
      const text = `${card.front}\n${card.back}`;
      checkMarkdown(text, `${where}.json`, language === 'en');
      checkPlainReferences(text, `${where}.json card ${index + 1}`, language);
    });
    data.quiz.forEach((question, index) => {
      if (
        question.options.length < 2 ||
        question.answer < 0 ||
        question.answer >= question.options.length
      ) {
        problems.push(
          `${where}.json: question ${index + 1} has an invalid answer or too few options`,
        );
      }
      question.refs.forEach((ref) => checkReference(ref, `${where}.json`, language === 'en'));
      checkMarkdown(question.explanation, `${where}.json`, language === 'en');
      checkPlainReferences(question.explanation, `${where}.json question ${index + 1}`, language);
    });
    checkLengthBias(data.quiz, `${where}.json`);
    counts.push(`${data.cards.length}/${data.quiz.length}`);
    cardIds.push(data.cards.map((card) => card.id).join(','));
  }
  if (counts.length === 2 && counts[0] !== counts[1]) {
    problems.push(
      `chapters/*/${meta.file}.json: cards/questions differ between languages (${counts.join(' vs ')})`,
    );
  } else if (cardIds.length === 2 && cardIds[0] !== cardIds[1]) {
    problems.push(`chapters/*/${meta.file}.json: the card ids differ between languages`);
  }
}

for (const term of readJson<GlossaryTerm[]>('glossary.json')) {
  const where = `glossary.json "${term.bg}"`;
  term.refs.forEach((ref) => checkReference(ref, where, true));
  checkChapterLink(term.chapter, where);
}

const library = readJson<TemplateLibrary>('templates.json');
const groupIds = new Set(library.groups.map((group) => group.id));
const formIds = new Set(library.forms.map((form) => form.id));
for (const template of library.templates) {
  const where = `templates.json "${template.id}"`;
  if (!groupIds.has(template.group)) problems.push(`${where}: unknown group "${template.group}"`);
  if (template.form && !formIds.has(template.form)) {
    problems.push(`${where}: unknown form "${template.form}"`);
  }
  template.refs.forEach((ref) => checkReference(ref, where, true));
  checkMarkdown(template.notes.en, where, true);
  checkMarkdown(template.notes.bg, where, false);
  checkPlainReferences(template.notes.en, where, 'en');
  checkPlainReferences(template.notes.bg, where, 'bg');
}

for (const checklist of readJson<Checklist[]>('checklists.json')) {
  const where = `checklists.json "${checklist.id}"`;
  checkChapterLink(checklist.chapter, where);
  for (const item of checklist.sections.flatMap((section) => section.items)) {
    checkMarkdown(item.en, where, true);
    checkMarkdown(item.bg, where, false);
  }
}

// ---- Report ------------------------------------------------------------------------------------

if (untranslated.size) {
  warnings.push(
    `${untranslated.size} cited article(s) have no English translation: ${[...untranslated].slice(0, 30).join(', ')}`,
  );
}
warnings.forEach((warning) => console.log(`Warning: ${warning}`));
if (problems.length) {
  console.log(`${problems.length} problem(s):`);
  problems.forEach((problem) => console.log(` - ${problem}`));
  process.exit(1);
}
console.log(
  `OK: ${manifest.chapters.length} chapters in ${LANGUAGES.length} languages, ${catalog.length} acts.`,
);
