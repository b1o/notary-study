import { Component, computed, ElementRef, inject } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

import { LanguageService } from '../../core/i18n/language.service';
import {
  LINE_SPACINGS,
  MOTION_CHOICES,
  READING_FONTS,
  TEXT_SIZES,
  TEXT_WIDTHS,
  THEME_CHOICES,
} from '../../core/settings/reading-settings';
import { ReadingSettingsService } from '../../core/settings/reading-settings.service';
import { ChoiceGroup, toChoices } from '../../shared/ui/choice-group';
import { Icon } from '../../shared/ui/icon';

/**
 * The reading settings. The parent shows it as a popover (`<nc-reading-settings-panel popover>`),
 * so the page stays visible and every change shows at once.
 */
@Component({
  selector: 'nc-reading-settings-panel',
  imports: [ChoiceGroup, FormField, Icon],
  templateUrl: './reading-settings-panel.html',
  styleUrl: './reading-settings-panel.scss',
})
export class ReadingSettingsPanel {
  protected readonly settings = inject(ReadingSettingsService);
  protected readonly ui = inject(LanguageService).text;
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);

  /** Each field edits one value of the stored settings directly. */
  protected readonly form = form(this.settings.values);

  protected readonly choices = computed(() => {
    const text = this.ui().settings;
    return {
      theme: toChoices(THEME_CHOICES, text.themes),
      textSize: toChoices(TEXT_SIZES, text.textSizes),
      lineSpacing: toChoices(LINE_SPACINGS, text.lineSpacings),
      textWidth: toChoices(TEXT_WIDTHS, text.textWidths),
      readingFont: toChoices(READING_FONTS, text.readingFonts),
      motion: toChoices(MOTION_CHOICES, text.motions),
    };
  });

  protected close(): void {
    this.host.nativeElement.hidePopover();
  }
}
