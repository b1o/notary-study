import { isArticle, type LawAct, type LawArticle, type LawHeading } from './law.models';

/** Where an article sits in its act. */
export interface ArticleContext {
  readonly article: LawArticle;
  /** The chapter and section headings above the article, outermost first. */
  readonly path: readonly LawHeading[];
  readonly previous?: LawArticle;
  readonly next?: LawArticle;
  /** All articles under the same innermost heading, including this one. */
  readonly section: readonly LawArticle[];
}

export interface ActIndex {
  readonly act: LawAct;
  readonly articles: readonly LawArticle[];
  context(number: string): ArticleContext | undefined;
}

/** Index an act once, so that article lookups and neighbours are cheap. */
export function indexAct(act: LawAct): ActIndex {
  const articles: LawArticle[] = [];
  const pathOf = new Map<LawArticle, readonly LawHeading[]>();
  const sections = new Map<string, LawArticle[]>();
  let path: LawHeading[] = [];

  for (const item of act.items) {
    if (item.kind === 'heading') {
      // A heading closes every heading at its level or deeper.
      path = [...path.filter((heading) => heading.level < item.level), item];
    } else if (isArticle(item)) {
      articles.push(item);
      pathOf.set(item, path);
      const key = sectionKey(path);
      sections.set(key, [...(sections.get(key) ?? []), item]);
    }
  }

  const positions = new Map(articles.map((article, index) => [article.number, index]));

  return {
    act,
    articles,
    context(number) {
      const index = positions.get(number);
      if (index === undefined) {
        return undefined;
      }
      const article = articles[index];
      const articlePath = pathOf.get(article) ?? [];
      return {
        article,
        path: articlePath,
        previous: articles[index - 1],
        next: articles[index + 1],
        section: sections.get(sectionKey(articlePath)) ?? [article],
      };
    },
  };
}

const sectionKey = (path: readonly LawHeading[]) =>
  path.map((heading) => heading.text).join('\u0000');
