import { LocationStrategy } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Service } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import type { Language } from '../i18n/language';
import { PromiseCache } from '../data/promise-cache';
import { LanguageService } from '../i18n/language.service';
import { indexAct, type ActIndex } from './act-index';
import { formatReference, parseReference, type LawReference } from './citation';
import type { ActTranslation, LawAct, LawCatalogEntry } from './law.models';

const LAWS = 'data/laws';

/** The law library: the catalog of acts, the act texts and their English translations. */
@Service()
export class LawLibraryService {
  private readonly http = inject(HttpClient);
  private readonly language = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly locationStrategy = inject(LocationStrategy);

  readonly catalog = httpResource<readonly LawCatalogEntry[]>(() => `${LAWS}/catalog.json`);

  readonly entries = computed<readonly LawCatalogEntry[]>(() =>
    this.catalog.hasValue() ? this.catalog.value() : [],
  );
  private readonly entriesById = computed(
    () => new Map(this.entries().map((entry) => [entry.id, entry])),
  );

  /** Acts and translations are loaded once and then shared by every view. */
  private readonly acts = new PromiseCache<ActIndex>();
  private readonly translations = new PromiseCache<ActTranslation>();

  entry(actId: string): LawCatalogEntry | undefined {
    return this.entriesById().get(actId);
  }

  /**
   * Label of a reference, for example "чл. 25, ал. 9 ЗННД". The language is the interface
   * language, unless the caller names the language of a text.
   */
  label(reference: LawReference | string, language: Language = this.language.current()): string {
    const parsed = typeof reference === 'string' ? parseReference(reference) : reference;
    return formatReference(parsed, this.entry(parsed.act), language);
  }

  /**
   * Label without the act, for lists inside one act: "чл. 25, ал. 9" or "Art. 25(9)".
   * The language is the interface language, unless the caller names the language of a text.
   */
  shortLabel(reference: LawReference, language: Language = this.language.current()): string {
    const unit = this.entry(reference.act)?.unit;
    return formatReference(reference, { abbr: '', unit }, language).trim();
  }

  /** Router link to a provision in the library. The paragraph travels as a query parameter. */
  link(reference: LawReference): { commands: string[]; queryParams: { paragraph?: string } } {
    const commands = reference.article
      ? ['/laws', reference.act, reference.article]
      : ['/laws', reference.act];
    return { commands, queryParams: reference.paragraph ? { paragraph: reference.paragraph } : {} };
  }

  /**
   * The same link as an address, for an href: "/laws/znnd/25?paragraph=9". The address starts
   * with the base href, as the href of a RouterLink does, so that a link opened in a new tab
   * stays in the app when the app is not at the root of its host.
   */
  url(reference: LawReference | string): string {
    const parsed = typeof reference === 'string' ? parseReference(reference) : reference;
    const { commands, queryParams } = this.link(parsed);
    const tree = this.router.createUrlTree(commands, { queryParams });
    return this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(tree));
  }

  loadAct(actId: string): Promise<ActIndex> {
    return this.acts.get(actId, async () =>
      indexAct(await firstValueFrom(this.http.get<LawAct>(`${LAWS}/acts/${actId}.json`))),
    );
  }

  /** English translations of the act's articles. Acts without a translation file give an empty map. */
  loadTranslation(actId: string): Promise<ActTranslation> {
    return this.translations.get(actId, () =>
      firstValueFrom(this.http.get<ActTranslation>(`${LAWS}/en/${actId}.json`)).catch(() => ({})),
    );
  }
}
