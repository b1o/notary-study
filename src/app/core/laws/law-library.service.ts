import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import type { Language } from '../i18n/language';
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

  readonly catalog = httpResource<readonly LawCatalogEntry[]>(() => `${LAWS}/catalog.json`);

  readonly entries = computed<readonly LawCatalogEntry[]>(() =>
    this.catalog.hasValue() ? this.catalog.value() : [],
  );
  private readonly entriesById = computed(
    () => new Map(this.entries().map((entry) => [entry.id, entry])),
  );

  /** Acts and translations are loaded once and then shared by every view. */
  private readonly acts = new Map<string, Promise<ActIndex>>();
  private readonly translations = new Map<string, Promise<ActTranslation>>();

  entry(actId: string): LawCatalogEntry | undefined {
    return this.entriesById().get(actId);
  }

  /** Label of a reference in the current language, for example "чл. 25, ал. 9 ЗННД". */
  label(reference: LawReference | string): string {
    const parsed = typeof reference === 'string' ? parseReference(reference) : reference;
    return formatReference(parsed, this.entry(parsed.act), this.language.current());
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

  loadAct(actId: string): Promise<ActIndex> {
    return this.cached(this.acts, actId, async () =>
      indexAct(await firstValueFrom(this.http.get<LawAct>(`${LAWS}/acts/${actId}.json`))),
    );
  }

  /** English translations of the act's articles. Acts without a translation file give an empty map. */
  loadTranslation(actId: string): Promise<ActTranslation> {
    return this.cached(this.translations, actId, () =>
      firstValueFrom(this.http.get<ActTranslation>(`${LAWS}/en/${actId}.json`)).catch(() => ({})),
    );
  }

  /** Share one request per key. A failed request is forgotten, so the next call tries again. */
  private cached<T>(
    cache: Map<string, Promise<T>>,
    key: string,
    load: () => Promise<T>,
  ): Promise<T> {
    let promise = cache.get(key);
    if (!promise) {
      promise = load();
      cache.set(key, promise);
      promise.catch(() => cache.delete(key));
    }
    return promise;
  }
}
