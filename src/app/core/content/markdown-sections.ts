import { plainHeading, SlugRegistry } from '../text/slug';

/** The text of a chapter under one heading. */
export interface MarkdownSection {
  /**
   * The heading without Markdown marks, and its fragment id in the rendered chapter.
   * The text before the first heading has neither.
   */
  readonly title?: string;
  readonly id?: string;
  /** The Markdown lines outside code blocks. */
  readonly lines: readonly string[];
  /** The lines inside code blocks: document samples, which show their text as it is. */
  readonly code: readonly string[];
}

const HEADING = /^(#{1,6})\s+(.*)$/;
const FENCE = /^```/;

/**
 * Split a chapter at its headings. The ids follow the same rules as renderMarkdown (one
 * SlugRegistry for every heading in order), so links to the sections work.
 */
export function splitSections(markdown: string): MarkdownSection[] {
  const sections: { title?: string; id?: string; lines: string[]; code: string[] }[] = [
    { lines: [], code: [] },
  ];
  const slugs = new SlugRegistry();
  let inFence = false;

  for (const line of markdown.split('\n')) {
    const current = sections[sections.length - 1];
    if (FENCE.test(line)) {
      inFence = !inFence;
    } else if (inFence) {
      current.code.push(line);
    } else {
      const heading = HEADING.exec(line);
      if (heading) {
        const [, , text] = heading;
        sections.push({ title: plainHeading(text), id: slugs.next(text), lines: [], code: [] });
      } else {
        current.lines.push(line);
      }
    }
  }
  return sections;
}
