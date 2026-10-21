import { renderMarkdown, type MarkdownContext } from './render-markdown';

const CONTEXT: MarkdownContext = {
  citationLabel: (ref) => `label:${ref}`,
  citationHref: (ref) => `/laws/${ref}`,
  calloutTitle: (kind) => `title:${kind}`,
};

const render = (source: string) => renderMarkdown(source, CONTEXT);

describe('renderMarkdown', () => {
  it('turns a citation into a link with its label', () => {
    expect(render('See [[znnd:25:9]].').html).toContain(
      '<a class="cite" href="/laws/znnd:25:9" data-ref="znnd:25:9">label:znnd:25:9</a>',
    );
  });

  it('keeps a custom citation label', () => {
    expect(render('[[gpk:578|the form rule]]').html).toContain('>the form rule</a>');
  });

  it('marks a Bulgarian term', () => {
    expect(render('A {{нотариален акт}}.').html).toContain(
      '<span class="term" lang="bg">нотариален акт</span>',
    );
  });

  it('renders a callout with its own title', () => {
    const { html } = render('> [!tip] Check twice\n> Read the deed **aloud**.');
    expect(html).toContain(
      '<aside class="callout callout--tip"><p class="callout__title">Check twice</p>',
    );
    expect(html).toContain('<strong>aloud</strong>');
  });

  it('gives a callout without a title the default title', () => {
    expect(render('> [!warn]\n> Careful.').html).toContain(
      '<p class="callout__title">title:warn</p>',
    );
  });

  it('shows an unknown callout kind as a note', () => {
    expect(render('> [!unknown] X\n> Text.').html).toContain('callout--note');
  });

  it('renders a solution as a closed disclosure', () => {
    expect(render('> [!solution]\n> The answer.').html).toContain(
      '<details class="callout callout--solution"><summary class="callout__title">title:solution</summary>',
    );
  });

  it('renders a document block as a sheet', () => {
    const { html } = render('```doc Нотариален акт\nДнес, <дата>\n```');
    expect(html).toContain('<figcaption class="document__title">Нотариален акт</figcaption>');
    expect(html).toContain('Днес, &lt;дата&gt;');
  });

  it('shows raw HTML as text', () => {
    expect(render('<script>alert(1)</script>').html).not.toContain('<script>');
  });

  it('collects the contents from level 2 and 3 headings', () => {
    const { html, toc } = render('# Title\n## The draft\n### Rules\n## The draft');
    expect(toc).toEqual([
      { id: 'the-draft', text: 'The draft', level: 2 },
      { id: 'rules', text: 'Rules', level: 3 },
      { id: 'the-draft-2', text: 'The draft', level: 2 },
    ]);
    expect(html).toContain('<h2 id="the-draft-2">');
  });

  it('wraps tables, so that wide tables scroll', () => {
    expect(render('| a | b |\n|---|---|\n| 1 | 2 |').html).toContain(
      '<div class="table-scroll"><table>',
    );
  });
});
