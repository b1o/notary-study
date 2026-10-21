import { inject, Service } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { LanguageService } from '../i18n/language.service';
import { parseReference } from '../laws/citation';
import { LawLibraryService } from '../laws/law-library.service';
import { renderMarkdown, type TocEntry } from './render-markdown';

export interface RenderedContent {
  readonly html: SafeHtml;
  readonly toc: readonly TocEntry[];
}

/** Renders course Markdown with citation labels and links in the current language. */
@Service()
export class MarkdownService {
  private readonly laws = inject(LawLibraryService);
  private readonly language = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);

  /**
   * Call this inside a computed(): the labels read the language and the law catalog,
   * so the text renders again when either changes.
   */
  render(source: string): RenderedContent {
    const rendered = renderMarkdown(source, {
      citationLabel: (ref) => this.laws.label(ref),
      citationHref: (ref) => this.libraryUrl(ref),
      calloutTitle: (kind) => this.language.text().chapter.calloutTitles[kind],
    });
    // Trusted: renderMarkdown escapes all HTML in the source and emits only its own markup.
    return { html: this.sanitizer.bypassSecurityTrustHtml(rendered.html), toc: rendered.toc };
  }

  private libraryUrl(ref: string): string {
    const { commands, queryParams } = this.laws.link(parseReference(ref));
    return this.router.serializeUrl(this.router.createUrlTree(commands, { queryParams }));
  }
}
