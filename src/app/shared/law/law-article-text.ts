import { Component, computed, inject, input } from '@angular/core';

import type { Language } from '../../core/i18n/language';
import { LanguageService } from '../../core/i18n/language.service';
import { LawDisplayService } from '../../core/laws/law-display.service';
import { LawLibraryService } from '../../core/laws/law-library.service';
import { groupParagraphs, type LawParagraph } from '../../core/laws/law-text';
import type { ArticleTranslation, LawArticle } from '../../core/laws/law.models';

interface TextVersion {
  readonly language: Language;
  /** "Чл. 25", "§ 1" or "Art. 25", in the language of the text. */
  readonly number: string;
  readonly title?: string;
  readonly paragraphs: readonly LawParagraph[];
  /** True when the text writes paragraph numbers, so the view keeps a margin for them. */
  readonly numbered: boolean;
}

/**
 * The text of one article: the Bulgarian original, or the English translation when
 * LawDisplayService asks for English and the article has one. The paragraph in `highlight` is
 * marked, for example the cited one. All sizes are relative to the law text size, so the reading
 * settings keep the proportions.
 */
@Component({
  selector: 'nc-law-article-text',
  templateUrl: './law-article-text.html',
  styleUrl: './law-article-text.scss',
  host: {
    class: 'law-article-text',
    '[class.law-article-text--no-amendments]': 'display.hideAmendments()',
  },
})
export class LawArticleText {
  /** Id of the act, for the name of the numbered unit ("чл.", or "т." in the tariff). */
  readonly act = input.required<string>();
  readonly article = input.required<LawArticle>();
  readonly translation = input<ArticleTranslation>();
  /** Paragraph number to mark, for example "9". */
  readonly highlight = input<string>();
  /** Level of the article header among the headings of the page. */
  readonly headingLevel = input(3);

  protected readonly display = inject(LawDisplayService);
  private readonly laws = inject(LawLibraryService);
  protected readonly ui = inject(LanguageService).text;

  protected readonly version = computed<TextVersion>(() => {
    const article = this.article();
    const translation = this.translation();
    return this.display.textLanguage() === 'en' && translation
      ? this.toVersion('en', translation.title, translation.paragraphs)
      : this.toVersion('bg', article.title, article.paragraphs);
  });

  /** English was asked for, but this article has no translation, so the Bulgarian text shows. */
  protected readonly translationMissing = computed(
    () => this.display.textLanguage() === 'en' && !this.translation(),
  );

  private toVersion(
    language: Language,
    title: string | undefined,
    lines: readonly string[],
  ): TextVersion {
    const label = this.laws.shortLabel(
      { act: this.act(), article: this.article().number },
      language,
    );
    const paragraphs = groupParagraphs(lines);
    return {
      language,
      number: label.charAt(0).toUpperCase() + label.slice(1),
      title,
      paragraphs,
      numbered: paragraphs.some((paragraph) => paragraph.marker),
    };
  }
}
