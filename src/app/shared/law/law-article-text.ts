import { Component, computed, inject, input } from '@angular/core';

import type { Language } from '../../core/i18n/language';
import { LanguageService } from '../../core/i18n/language.service';
import { LawDisplayService } from '../../core/laws/law-display.service';
import { groupParagraphs, type LawParagraph } from '../../core/laws/law-text';
import type { ArticleTranslation, LawArticle } from '../../core/laws/law.models';

interface TextVersion {
  readonly language: Language;
  readonly title?: string;
  readonly paragraphs: readonly LawParagraph[];
}

/**
 * The text of one article: the Bulgarian original, the English translation, or both,
 * as LawDisplayService says. The paragraph in `highlight` is marked, for example the cited one.
 */
@Component({
  selector: 'nc-law-article-text',
  templateUrl: './law-article-text.html',
  styleUrl: './law-article-text.scss',
  host: {
    class: 'law-article-text',
    '[class.law-article-text--both]': 'versions().length > 1',
    '[class.law-article-text--no-amendments]': 'display.hideAmendments()',
  },
})
export class LawArticleText {
  readonly article = input.required<LawArticle>();
  readonly translation = input<ArticleTranslation>();
  /** Paragraph number to mark, for example "9". */
  readonly highlight = input<string>();

  protected readonly display = inject(LawDisplayService);
  protected readonly ui = inject(LanguageService).text;

  protected readonly versions = computed<TextVersion[]>(() => {
    const choice = this.display.textLanguage();
    const article = this.article();
    const translation = this.translation();
    const versions: TextVersion[] = [];
    if (choice !== 'en' || !translation) {
      versions.push({ language: 'bg', title: article.title, paragraphs: groupParagraphs(article.paragraphs) });
    }
    if (choice !== 'bg' && translation) {
      versions.push({ language: 'en', title: translation.title, paragraphs: groupParagraphs(translation.paragraphs) });
    }
    return versions;
  });

  /** English was asked for, but this article has no translation, so the Bulgarian text shows. */
  protected readonly translationMissing = computed(
    () => this.display.textLanguage() === 'en' && !this.translation(),
  );
}
