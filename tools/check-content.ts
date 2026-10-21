/**
 * Check the course data in public/data.
 *
 * Problems (exit code 1):
 *   - a citation or a reference points to an act or an article that the library does not have;
 *   - an article number uses a Latin letter instead of the Cyrillic one (25a instead of 25а);
 *   - a chapter link (chapter: '...') names a chapter that the manifest does not have;
 *   - a chapter is missing in one language, or the two languages have different numbers of cards or questions;
 *   - a quiz question has fewer than two options or an answer index outside the options;
 *   - a translation key names an article that its act does not have.
 * Warnings: a cited article has no English translation.
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
import type { ActTranslation, LawAct, LawCatalogEntry } from '../src/app/core/laws/law.models.ts';

const DATA = join(import.meta.dirname, '..', 'public', 'data');
const LANGUAGES: readonly Language[] = ['bg', 'en'];
const LATIN_TO_CYRILLIC: Readonly<Record<string, string>> = {
  a: 'а', e: 'е', o: 'о', p: 'р', c: 'с', x: 'х', y: 'у',
  A: 'А', B: 'В', E: 'Е', K: 'К', M: 'М', H: 'Н', O: 'О', P: 'Р', C: 'С', T: 'Т', X: 'Х',
};

const problems: string[] = [];
const warnings: string[] = [];
const readJson = <T>(...path: string[]): T => JSON.parse(readFileSync(join(DATA, ...path), 'utf8')) as T;
const readText = (...path: string[]) => readFileSync(join(DATA, ...path), 'utf8');

// ---- Law library -------------------------------------------------------------------------------

const catalog = readJson<LawCatalogEntry[]>('laws', 'catalog.json');
const articlesByAct = new Map<string, Set<string>>();
for (const entry of catalog) {
  const act = readJson<LawAct>('laws', 'acts', `${entry.id}.json`);
  const numbers = act.items.flatMap((item) => ('number' in item ? [item.number] : []));
  articlesByAct.set(entry.id, new Set(numbers));
}

const translations = new Map<string, Set<string>>();
for (const file of readdirSync(join(DATA, 'laws', 'en'))) {
  const act = file.replace(/\.json$/, '');
  const keys = Object.keys(readJson<ActTranslation>('laws', 'en', file));
  translations.set(act, new Set(keys));
  for (const key of keys) {
    if (!articlesByAct.get(act)?.has(key)) problems.push(`laws/en/${file}: ${act} has no article "${key}"`);
  }
}

const untranslated = new Set<string>();

/** Check one reference ("znnd:25:9"). `where` names the file for the report. */
function checkReference(ref: string, where: string, english: boolean): void {
  const { act, article } = parseReference(ref);
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
  } else if (english && !translations.get(act)?.has(cyrillic)) {
    untranslated.add(`${act}:${cyrillic}`);
  }
}

const checkMarkdown = (markdown: string, where: string, english: boolean) =>
  findCitations(markdown).forEach(({ ref }) => checkReference(ref, where, english));

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
  for (const language of LANGUAGES) {
    const where = `chapters/${language}/${meta.file}`;
    if (!existsSync(join(DATA, 'chapters', language, `${meta.file}.md`))) {
      problems.push(`${where}.md: missing`);
      continue;
    }
    checkMarkdown(readText('chapters', language, `${meta.file}.md`), `${where}.md`, language === 'en');
    const data = readJson<ChapterData>('chapters', language, `${meta.file}.json`);
    if (data.id !== meta.id) problems.push(`${where}.json: id "${data.id}" should be "${meta.id}"`);
    data.cards.forEach((card) => checkMarkdown(`${card.front}\n${card.back}`, `${where}.json`, language === 'en'));
    data.quiz.forEach((question, index) => {
      if (question.options.length < 2 || question.answer < 0 || question.answer >= question.options.length) {
        problems.push(`${where}.json: question ${index + 1} has an invalid answer or too few options`);
      }
      question.refs.forEach((ref) => checkReference(ref, `${where}.json`, language === 'en'));
    });
    counts.push(`${data.cards.length}/${data.quiz.length}`);
  }
  if (counts.length === 2 && counts[0] !== counts[1]) {
    problems.push(`chapters/*/${meta.file}.json: cards/questions differ between languages (${counts.join(' vs ')})`);
  }
}

for (const term of readJson<GlossaryTerm[]>('glossary.json')) {
  const where = `glossary.json "${term.bg}"`;
  term.refs.forEach((ref) => checkReference(ref, where, true));
  checkChapterLink(term.chapter, where);
}

const library = readJson<TemplateLibrary>('templates.json');
const groupIds = new Set(library.groups.map((group) => group.id));
for (const template of library.templates) {
  const where = `templates.json "${template.id}"`;
  if (!groupIds.has(template.group)) problems.push(`${where}: unknown group "${template.group}"`);
  template.refs.forEach((ref) => checkReference(ref, where, true));
  checkMarkdown(template.notes.en, where, true);
  checkMarkdown(template.notes.bg, where, false);
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
  warnings.push(`${untranslated.size} cited article(s) have no English translation: ${[...untranslated].slice(0, 30).join(', ')}`);
}
warnings.forEach((warning) => console.log(`Warning: ${warning}`));
if (problems.length) {
  console.log(`${problems.length} problem(s):`);
  problems.forEach((problem) => console.log(` - ${problem}`));
  process.exit(1);
}
console.log(`OK: ${manifest.chapters.length} chapters in ${LANGUAGES.length} languages, ${catalog.length} acts.`);
