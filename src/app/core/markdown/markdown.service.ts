import { inject, Service } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

import { LanguageService } from '../i18n/language.service';
import { LawLibraryService } from '../laws/law-library.service';
import {
  renderInlineMarkdown,
  renderMarkdown,
  type MarkdownContext,
  type TocEntry,
} from './render-markdown';

export interface RenderedContent {
  readonly html: SafeHtml;
  readonly toc: readonly TocEntry[];
}

/**
 * Renders course Markdown with citation labels and links in the current language.
 * Call it inside a computed(): the labels read the language and the law catalog,
 * so the text renders again when either changes.
 */
@Service()
export class MarkdownService {
  private readonly laws = inject(LawLibraryService);
  private readonly language = inject(LanguageService);
  private readonly sanitizer = inject(DomSanitizer);

  private readonly context: MarkdownContext = {
    citationLabel: (ref) => this.laws.label(ref),
    citationHref: (ref) => this.laws.url(ref),
    calloutTitle: (kind) => this.language.text().chapter.calloutTitles[kind],
  };

  /** A whole text: a chapter, the notes of a template. */
  render(source: string): RenderedContent {
    const rendered = renderMarkdown(source, this.context);
    return { html: this.trust(rendered.html), toc: rendered.toc };
  }

  /** One line: a test question, an answer option, a checklist item. */
  renderInline(source: string): SafeHtml {
    return this.trust(renderInlineMarkdown(source, this.context));
  }

  /** The renderers escape all HTML in the source and emit only their own markup. */
  private trust(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
