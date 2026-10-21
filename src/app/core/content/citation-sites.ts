import { articleKey, findCitations, parseReference } from '../laws/citation';
import { plainHeading, SlugRegistry } from '../text/slug';

/** A place in a chapter that cites a provision. */
export interface CitationSite {
  readonly chapterId: string;
  /** The heading above the citation, and its fragment id in the rendered chapter. */
  readonly sectionTitle?: string;
  readonly sectionId?: string;
}

const HEADING = /^(#{1,6})\s+(.*)$/;
const FENCE = /^```/;

/**
 * Find the citations of one chapter, grouped by article ("znnd:25").
 * Heading ids follow the same rules as renderMarkdown, so links to the sections work.
 */
export function citationSites(chapterId: string, markdown: string): Map<string, CitationSite[]> {
  const sites = new Map<string, CitationSite[]>();
  const slugs = new SlugRegistry();
  let section: Pick<CitationSite, 'sectionTitle' | 'sectionId'> = {};
  let inFence = false;

  for (const line of markdown.split('\n')) {
    if (FENCE.test(line)) {
      inFence = !inFence;
      continue;
    }
    const heading = inFence ? null : HEADING.exec(line);
    if (heading) {
      section = { sectionTitle: plainHeading(heading[2]), sectionId: slugs.next(heading[2]) };
      continue;
    }
    for (const { ref } of findCitations(line)) {
      const key = articleKey(parseReference(ref));
      const list = sites.get(key) ?? [];
      // One entry per section is enough.
      if (!list.some((site) => site.sectionId === section.sectionId)) {
        sites.set(key, [...list, { chapterId, ...section }]);
      }
    }
  }
  return sites;
}

/** Merge the maps of several chapters into one, in chapter order. */
export function mergeSites(maps: readonly Map<string, CitationSite[]>[]): Map<string, CitationSite[]> {
  const merged = new Map<string, CitationSite[]>();
  for (const map of maps) {
    for (const [key, list] of map) {
      merged.set(key, [...(merged.get(key) ?? []), ...list]);
    }
  }
  return merged;
}
