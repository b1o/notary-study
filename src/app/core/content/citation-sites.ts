import { articleKey, findCitations, parseReference } from '../laws/citation';
import { splitSections } from './markdown-sections';

/** A place in a chapter that cites a provision. */
export interface CitationSite {
  readonly chapterId: string;
  /** The heading above the citation, and its fragment id in the rendered chapter. */
  readonly sectionTitle?: string;
  readonly sectionId?: string;
}

/**
 * Find the citations of one chapter, grouped by article ("znnd:25"). Code blocks show their
 * text as it is, so they hold no citations.
 */
export function citationSites(chapterId: string, markdown: string): Map<string, CitationSite[]> {
  const sites = new Map<string, CitationSite[]>();
  for (const section of splitSections(markdown)) {
    const site: CitationSite = { chapterId, sectionTitle: section.title, sectionId: section.id };
    for (const line of section.lines) {
      for (const { ref } of findCitations(line)) {
        const key = articleKey(parseReference(ref));
        const list = sites.get(key) ?? [];
        // One entry per section is enough.
        if (!list.includes(site)) {
          sites.set(key, [...list, site]);
        }
      }
    }
  }
  return sites;
}

/** Merge the maps of several chapters into one, in chapter order. */
export function mergeSites(
  maps: readonly Map<string, CitationSite[]>[],
): Map<string, CitationSite[]> {
  const merged = new Map<string, CitationSite[]>();
  for (const map of maps) {
    for (const [key, list] of map) {
      merged.set(key, [...(merged.get(key) ?? []), ...list]);
    }
  }
  return merged;
}
