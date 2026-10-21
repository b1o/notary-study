import { citationSites, mergeSites } from './citation-sites';

const CHAPTER = [
  'Intro cites [[znnd:25]].',
  '## The draft',
  'Rule [[gpk:578:1]] and [[gpk:578:2]].',
  '```doc Sample',
  '## Not a heading [[zzd:19]]',
  '```',
  '## The draft',
  'Again [[gpk:578:3]].',
].join('\n');

describe('citationSites', () => {
  const sites = citationSites('deeds', CHAPTER);

  it('records a citation before the first heading without a section', () => {
    expect(sites.get('znnd:25')).toEqual([{ chapterId: 'deeds' }]);
  });

  it('records one entry per section, with heading ids like the renderer', () => {
    expect(sites.get('gpk:578')).toEqual([
      { chapterId: 'deeds', sectionTitle: 'The draft', sectionId: 'the-draft' },
      { chapterId: 'deeds', sectionTitle: 'The draft', sectionId: 'the-draft-2' },
    ]);
  });

  it('ignores code blocks, where citations show as plain text', () => {
    expect(sites.has('zzd:19')).toBe(false);
  });
});

describe('mergeSites', () => {
  it('keeps the chapter order', () => {
    const merged = mergeSites([citationSites('a', '[[znnd:1]]'), citationSites('b', '[[znnd:1]]')]);
    expect(merged.get('znnd:1')?.map((site) => site.chapterId)).toEqual(['a', 'b']);
  });
});
