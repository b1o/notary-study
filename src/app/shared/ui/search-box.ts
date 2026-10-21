import { Component, ElementRef, inject, input, model, viewChild } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';

import { LanguageService } from '../../core/i18n/language.service';
import { Icon } from './icon';

let nextId = 0;

/** A search field. Enter opens the search page for the text: /search?q=... */
@Component({
  selector: 'nc-search-box',
  imports: [FormField, Icon],
  template: `
    <form
      class="search-box"
      role="search"
      [attr.aria-label]="label() ?? ui().search.label"
      (submit)="submit($event)"
    >
      <label class="visually-hidden" [for]="inputId">{{ ui().search.label }}</label>
      <input
        #input
        class="text-field search-box__input"
        type="search"
        enterkeyhint="search"
        [id]="inputId"
        [placeholder]="ui().search.placeholder"
        [formField]="field"
      />
      <button
        type="submit"
        class="icon-button search-box__submit"
        [attr.aria-label]="ui().search.submit"
      >
        <nc-icon name="search" />
      </button>
    </form>
  `,
  styles: `
    :host {
      display: block;
    }
    .search-box {
      position: relative;
    }
    /* The button sits at the start of the field; the end keeps the browser's clear button. */
    .search-box__input {
      inline-size: 100%;
      padding-inline-start: 2.5rem;
    }
    .search-box__submit {
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0.125rem;
      margin-block: auto;
      --icon-size: 1.125rem;
    }
  `,
})
export class SearchBox {
  /** The text of the field. The search page passes its query, so the field shows it. */
  readonly query = model('');
  /** The name of the search landmark, when a page has more than one. */
  readonly label = input<string>();
  protected readonly field = form(this.query);

  private readonly router = inject(Router);
  protected readonly ui = inject(LanguageService).text;
  protected readonly inputId = `nc-search-${nextId++}`;
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  focus(): void {
    this.input().nativeElement.focus();
  }

  protected submit(event: Event): void {
    event.preventDefault();
    const q = this.query().trim();
    if (q) {
      void this.router.navigate(['/search'], { queryParams: { q } });
    }
  }
}
