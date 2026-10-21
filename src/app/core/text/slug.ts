/** Text of a Markdown heading without citations, term marks and emphasis. */
export function plainHeading(markdown: string): string {
  return markdown
    .replace(/\[\[[^\]]*\]\]/g, '')
    .replace(/\{\{|\}\}|\*\*|[*`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** URL fragment for a heading: lower case, Latin and Cyrillic letters, digits and dashes. */
export function slugify(text: string): string {
  const slug = plainHeading(text)
    .toLowerCase()
    .normalize('NFC')
    .replace(/[^a-z0-9а-я]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
  return slug || 'section';
}

/** Gives each heading of one document a unique fragment: "costs", "costs-2", ... */
export class SlugRegistry {
  private readonly used = new Set<string>();

  next(text: string): string {
    const base = slugify(text);
    let slug = base;
    for (let n = 2; this.used.has(slug); n++) {
      slug = `${base}-${n}`;
    }
    this.used.add(slug);
    return slug;
  }
}
