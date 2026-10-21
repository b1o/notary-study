import { CITATION_PATTERN } from '../laws/citation';

/**
 * The text of course Markdown without its marks, for search: a citation becomes its label, a
 * term and a link become their text, and emphasis, heading and quote marks, table rules and
 * callout kinds go.
 */
export function plainMarkdown(source: string, citationLabel: (ref: string) => string): string {
  return source
    .replace(
      CITATION_PATTERN,
      (_, ref: string, label?: string) => label || citationLabel(ref.trim()),
    )
    .replace(/\{\{([^}]+)\}\}/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\[!\w+\]/g, ' ')
    .replace(/[*`#>|]|-{3,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
