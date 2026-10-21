import type { LawAct } from '../laws/law.models';
import { courseSections, glossaryDocuments, lawDocuments } from './search-index';

describe('courseSections', () => {
  const chapter = [
    '## Costs',
    'The parties pay **equally** ([[zzd:186]]).',
    '## Costs',
    '> [!tip] Ask first',
    '> Check {{данъчна оценка}}.',
  ].join('\n');
  const sections = courseSections('sale', chapter, 'en', (ref) => `label of ${ref}`);

  it('gives one section per heading, with the fragment ids of the rendered chapter', () => {
    expect(sections.map((section) => section.fragment)).toEqual(['costs', 'costs-2']);
  });

  it('searches the plain text, with citation labels and terms', () => {
    expect(sections[0].texts[0].text).toBe('The parties pay equally (label of zzd:186).');
    expect(sections[1].texts[0].text).toBe('Ask first Check данъчна оценка.');
  });
});

describe('lawDocuments', () => {
  const act = {
    id: 'znnd',
    items: [
      { kind: 'heading', level: 1, text: 'Глава първа' },
      { kind: 'article', number: '1', title: 'Предмет', paragraphs: ['Законът урежда.'] },
      { kind: 'provision', number: '§1', paragraphs: ['Законът влиза в сила.'] },
    ],
  } as unknown as LawAct;

  it('gives one document per article and provision, with the translation', () => {
    const documents = lawDocuments(act, { '1': { paragraphs: ['The act governs.'] } });
    expect(documents.map((document) => document.reference.article)).toEqual(['1', '§1']);
    expect(documents[0].texts.map((text) => text.language)).toEqual(['bg', 'en']);
    expect(documents[1].texts.length).toBe(1);
  });
});

describe('glossaryDocuments', () => {
  it('searches the definition in the course language under both forms of the term', () => {
    const [document] = glossaryDocuments(
      [
        {
          bg: 'ипотека',
          en: 'mortgage',
          definition: { bg: 'Обезпечение.', en: 'Security.' },
          refs: [],
        },
      ],
      'en',
    );
    expect(document.texts[0]).toMatchObject({ text: 'Security.', title: 'ипотека mortgage' });
  });
});
