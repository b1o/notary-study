import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { GlossaryTerm } from '../../core/content/content.models';
import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { termAnchor } from '../../core/reference/glossary.service';
import { LawRefs } from '../law/law-refs';

/**
 * Glossary terms as a definition list: the term in both languages, the definition in the
 * reader's language, the provisions and the chapter. Each term has its fragment id (termAnchor).
 */
@Component({
  selector: 'nc-glossary-list',
  imports: [RouterLink, LawRefs],
  templateUrl: './glossary-list.html',
  styleUrl: './glossary-list.scss',
})
export class GlossaryList {
  readonly terms = input.required<readonly GlossaryTerm[]>();

  private readonly content = inject(ContentService);
  private readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;
  protected readonly lang = this.language.current;
  protected readonly anchor = termAnchor;

  protected chapterOf(term: GlossaryTerm) {
    return term.chapter ? this.content.chapter(term.chapter) : undefined;
  }
}
