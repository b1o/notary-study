import { Marked, Renderer, type TokenizerAndRendererExtension, type Tokens } from 'marked';

import { CITATION_PATTERN } from '../laws/citation';
import { escapeHtml } from '../text/html';
import { plainHeading, SlugRegistry } from '../text/slug';

/*
 * Markdown of the course texts: standard Markdown with GitHub tables, plus
 *   [[znnd:25:9]] or [[znnd:25:9|label]]   a law citation (link that opens the law panel)
 *   {{нотариален акт}}                     a Bulgarian term inside English text
 *   > [!tip] Title                         a callout; kinds are listed in CALLOUT_KINDS
 *   > [!solution] Title                    a callout that stays closed until the reader opens it
 *   ```doc Title                           the text of a document, shown like a sheet of paper
 * Raw HTML in the source is shown as text, so the output contains only markup made here.
 */

export const CALLOUT_KINDS = [
  'law',
  'tip',
  'warn',
  'example',
  'note',
  'task',
  'reform',
  'solution',
] as const;
export type CalloutKind = (typeof CALLOUT_KINDS)[number];

export interface TocEntry {
  readonly id: string;
  readonly text: string;
  readonly level: 2 | 3;
}

export interface RenderedMarkdown {
  readonly html: string;
  readonly toc: readonly TocEntry[];
}

/** What the renderer needs from the app: labels and links in the current language. */
export interface MarkdownContext {
  citationLabel(ref: string): string;
  citationHref(ref: string): string;
  calloutTitle(kind: CalloutKind): string;
}

const CITATION_AT_START = new RegExp(`^${CITATION_PATTERN.source}`);
const TERM_AT_START = /^\{\{([^}]+)\}\}/;
const CALLOUT_AT_START = /^> \[!(\w+)\][ \t]*([^\n]*)\n?((?:>[^\n]*(?:\n|$))*)/;

export function renderMarkdown(source: string, context: MarkdownContext): RenderedMarkdown {
  const toc: TocEntry[] = [];
  const html = createMarked(context, toc).parse(source, { async: false });
  return { html, toc };
}

/** Markdown inside one line, for example a test question: emphasis, citations and terms. */
export function renderInlineMarkdown(source: string, context: MarkdownContext): string {
  return createMarked(context, []).parseInline(source, { async: false });
}

/** A marked instance with the course extensions. Level 2 and 3 headings are added to `toc`. */
function createMarked(context: MarkdownContext, toc: TocEntry[]): Marked {
  const slugs = new SlugRegistry();
  return new Marked({
    gfm: true,
    extensions: [citationExtension(context), termExtension, calloutExtension(context)],
    renderer: {
      heading({ tokens, depth, text }) {
        const id = slugs.next(text);
        if (depth === 2 || depth === 3) {
          toc.push({ id, text: plainHeading(text), level: depth });
        }
        return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
      },
      code({ text, lang }) {
        const [kind = '', ...title] = (lang ?? '').trim().split(/\s+/);
        if (kind !== 'doc') {
          return false;
        }
        const caption = title.length
          ? `<figcaption class="document__title">${escapeHtml(title.join(' '))}</figcaption>`
          : '';
        return `<figure class="document">${caption}<pre class="document__text" lang="bg">${escapeHtml(text)}</pre></figure>\n`;
      },
      table(token) {
        return `<div class="table-scroll">${Renderer.prototype.table.call(this, token)}</div>\n`;
      },
      html({ text }) {
        return escapeHtml(text);
      },
    },
  });
}

function citationExtension(context: MarkdownContext): TokenizerAndRendererExtension {
  return {
    name: 'citation',
    level: 'inline',
    start: (src) => {
      const index = src.indexOf('[[');
      return index < 0 ? undefined : index;
    },
    tokenizer(src) {
      const match = CITATION_AT_START.exec(src);
      return match
        ? { type: 'citation', raw: match[0], ref: match[1].trim(), label: match[2] }
        : undefined;
    },
    renderer(token) {
      const ref = token['ref'] as string;
      const label = (token['label'] as string | undefined) ?? context.citationLabel(ref);
      return `<a class="cite" href="${escapeHtml(context.citationHref(ref))}" data-ref="${escapeHtml(ref)}">${escapeHtml(label)}</a>`;
    },
  };
}

const termExtension: TokenizerAndRendererExtension = {
  name: 'term',
  level: 'inline',
  start: (src) => {
    const index = src.indexOf('{{');
    return index < 0 ? undefined : index;
  },
  tokenizer(src) {
    const match = TERM_AT_START.exec(src);
    return match ? { type: 'term', raw: match[0], text: match[1] } : undefined;
  },
  renderer(token) {
    return `<span class="term" lang="bg">${escapeHtml(token['text'] as string)}</span>`;
  },
};

function calloutExtension(context: MarkdownContext): TokenizerAndRendererExtension {
  return {
    name: 'callout',
    level: 'block',
    start: (src) => {
      const index = src.search(/^> \[!/m);
      return index < 0 ? undefined : index;
    },
    tokenizer(src) {
      const match = CALLOUT_AT_START.exec(src);
      if (!match) {
        return undefined;
      }
      const requested = match[1].toLowerCase() as CalloutKind;
      const kind = CALLOUT_KINDS.includes(requested) ? requested : 'note';
      const body = match[3].replace(/^> ?/gm, '');
      return {
        type: 'callout',
        raw: match[0],
        kind,
        title: this.lexer.inlineTokens(match[2].trim() || context.calloutTitle(kind)),
        tokens: this.lexer.blockTokens(body, []),
      };
    },
    childTokens: ['title', 'tokens'],
    renderer(token) {
      const kind = token['kind'] as CalloutKind;
      const title = this.parser.parseInline(token['title'] as Tokens.Generic[]);
      const body = this.parser.parse(token.tokens ?? []);
      if (kind === 'solution') {
        return `<details class="callout callout--solution"><summary class="callout__title">${title}</summary><div class="callout__body">${body}</div></details>\n`;
      }
      return `<aside class="callout callout--${kind}"><p class="callout__title">${title}</p><div class="callout__body">${body}</div></aside>\n`;
    },
  };
}
