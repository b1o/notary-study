import {
  afterRenderEffect,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  resource,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { CourseIndexService } from '../../core/content/course-index.service';
import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { toReferenceString } from '../../core/laws/citation';
import { LAW_TEXT_LANGUAGES, LawDisplayService } from '../../core/laws/law-display.service';
import { LawLibraryService } from '../../core/laws/law-library.service';
import { LAW_PANEL_WIDTH, LawPanelService } from '../../core/laws/law-panel.service';
import { LawArticleText } from '../../shared/law/law-article-text';
import { ChoiceGroup, toChoices } from '../../shared/ui/choice-group';
import { Icon } from '../../shared/ui/icon';
import { LoadStatus } from '../../shared/ui/load-status';

/** Pixels per arrow key press on the resize handle; Shift moves four times as far. */
const RESIZE_STEP = 16;

/** Space above a cited paragraph when the panel scrolls to it, so the reader sees what leads to it. */
const SPACE_ABOVE_CITED = 96;

/**
 * The law panel next to the reading area. It shows the provision that LawPanelService holds,
 * with its place in the act, the neighbouring articles, and where the course cites it.
 */
@Component({
  selector: 'nc-law-panel',
  imports: [RouterLink, Icon, ChoiceGroup, LawArticleText, LoadStatus],
  templateUrl: './law-panel.html',
  styleUrl: './law-panel.scss',
  host: {
    role: 'complementary',
    '[attr.aria-label]': 'ui().panel.label',
  },
})
export class LawPanel {
  protected readonly panel = inject(LawPanelService);
  protected readonly laws = inject(LawLibraryService);
  protected readonly display = inject(LawDisplayService);
  private readonly content = inject(ContentService);
  private readonly courseIndex = inject(CourseIndexService);
  private readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;
  protected readonly lang = this.language.current;

  protected readonly widthLimits = LAW_PANEL_WIDTH;
  private readonly body = viewChild.required<ElementRef<HTMLElement>>('body');
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);

  /**
   * The width on screen. It differs from the chosen width when the reader chose none
   * (the width then follows the window) or when the window is too narrow for it.
   */
  protected readonly renderedWidth = signal(0);

  protected readonly reference = computed(() => this.panel.current());
  protected readonly libraryLink = computed(() => {
    const reference = this.reference();
    return reference && this.laws.link(reference);
  });
  protected readonly entry = computed(() => {
    const reference = this.reference();
    return reference && this.laws.entry(reference.act);
  });

  protected readonly act = resource({
    params: () => this.reference()?.act,
    loader: ({ params: actId }) => this.laws.loadAct(actId),
  });
  private readonly translations = resource({
    params: () => this.reference()?.act,
    loader: ({ params: actId }) => this.laws.loadTranslation(actId),
  });

  protected readonly context = computed(() => {
    const reference = this.reference();
    return reference && this.act.hasValue()
      ? this.act.value().context(reference.article)
      : undefined;
  });
  protected readonly translation = computed(() => {
    const reference = this.reference();
    return reference && this.translations.hasValue()
      ? this.translations.value()[reference.article]
      : undefined;
  });

  /** True while the chapter texts load. Until then, no article has known citations. */
  protected readonly courseIndexLoading = this.courseIndex.isLoading;

  /** Chapter sections that cite the article, with their chapter. */
  protected readonly sites = computed(() => {
    const reference = this.reference();
    if (!reference) return [];
    return this.courseIndex.sitesFor(reference).flatMap((site) => {
      const chapter = this.content.chapter(site.chapterId);
      return chapter ? [{ ...site, chapter }] : [];
    });
  });
  protected readonly terms = computed(() => {
    const reference = this.reference();
    return reference ? this.courseIndex.termsFor(reference) : [];
  });

  protected readonly textLanguageChoices = computed(() =>
    toChoices(LAW_TEXT_LANGUAGES, this.ui().law.textLanguages),
  );

  private drag?: { readonly startX: number; readonly startWidth: number };

  constructor() {
    this.courseIndex.load();

    const observer = new ResizeObserver(([entry]) =>
      this.renderedWidth.set(Math.round(entry.borderBoxSize[0].inlineSize)),
    );
    observer.observe(this.host.nativeElement);
    inject(DestroyRef).onDestroy(() => observer.disconnect());

    // Each new provision starts at the top. When the cited paragraph is not fully in view there,
    // the panel scrolls down to it instead.
    let shown: string | undefined;
    afterRenderEffect(() => {
      const reference = this.reference();
      if (!reference || !this.context()) return;
      const key = toReferenceString(reference);
      if (key === shown) return;
      shown = key;
      const body = this.body().nativeElement;
      body.scrollTop = 0;
      const marked = body.querySelector('.law-paragraph--highlight')?.getBoundingClientRect();
      const visible = body.getBoundingClientRect();
      if (marked && marked.bottom > visible.bottom) {
        body.scrollTop = marked.top - visible.top - SPACE_ABOVE_CITED;
      }
    });
  }

  /** Open another article of the same act in the panel. */
  protected openArticle(article: string): void {
    const reference = this.reference();
    if (reference) this.panel.open({ act: reference.act, article });
  }

  protected startResize(event: PointerEvent): void {
    if (event.button !== 0) return;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this.drag = { startX: event.clientX, startWidth: this.renderedWidth() };
    event.preventDefault();
  }

  protected moveResize(event: PointerEvent): void {
    // The panel is on the right, so moving the pointer to the left makes it wider.
    if (this.drag) this.panel.resize(this.drag.startWidth + this.drag.startX - event.clientX);
  }

  protected endResize(): void {
    this.drag = undefined;
  }

  /** The window splitter keys: arrows move the edge, Home and End go to the limits. */
  protected resizeWithKeys(event: KeyboardEvent): void {
    const step = event.shiftKey ? RESIZE_STEP * 4 : RESIZE_STEP;
    const width = this.renderedWidth();
    const target: Record<string, number> = {
      ArrowLeft: width + step,
      ArrowRight: width - step,
      Home: LAW_PANEL_WIDTH.min,
      End: LAW_PANEL_WIDTH.max,
    };
    if (event.key in target) {
      event.preventDefault();
      this.panel.resize(target[event.key]);
    }
  }
}
