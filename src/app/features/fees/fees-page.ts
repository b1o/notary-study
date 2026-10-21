import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { form, FormField, max, min } from '@angular/forms/signals';

import { computeBill, type BillLine, type Entered } from '../../core/fees/bill';
import {
  FEE_ACTIONS,
  PLACE_SURCHARGES,
  TAX_KINDS,
  type FeeAction,
} from '../../core/fees/fee-actions';
import type { Language, Localized } from '../../core/i18n/language';
import { LanguageService } from '../../core/i18n/language.service';
import { MarkdownService } from '../../core/markdown/markdown.service';
import { pageTitleEffect } from '../../core/page-title';
import { formatMoney, formatNumber } from '../../core/text/format';
import { LawRefs } from '../../shared/law/law-refs';
import { PageHeader } from '../../shared/layout/page-header';
import { PageLayout } from '../../shared/layout/page-layout';
import type { Choice } from '../../shared/ui/choice-group';
import { MarkdownContent } from '../../shared/ui/markdown-content';
import { Notice } from '../../shared/ui/notice';
import { SelectField } from '../../shared/ui/select-field';
import {
  AMOUNT_LIMITS,
  INTEREST_FORMS,
  startingValue,
  type AmountKey,
  type FeeFormValue,
} from './fee-form';

/** The options of a list of items with labels in both languages. */
function localizedChoices<T extends string>(
  items: readonly { readonly id: T; readonly label: Localized }[],
  language: Language,
): Choice<T>[] {
  return items.map((item) => ({ value: item.id, label: item.label[language] }));
}

/** The notarial fee calculator: an action and its amounts give a bill with the provision behind each line. */
@Component({
  selector: 'nc-fees-page',
  imports: [FormField, PageLayout, PageHeader, LawRefs, MarkdownContent, Notice, SelectField],
  templateUrl: './fees-page.html',
  styleUrl: './fees-page.scss',
})
export default class FeesPage {
  private readonly markdown = inject(MarkdownService);
  private readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;
  protected readonly lang = this.language.current;
  protected readonly limits = AMOUNT_LIMITS;

  protected readonly actionId = signal(FEE_ACTIONS[0].id);
  protected readonly action = computed<FeeAction>(
    () => FEE_ACTIONS.find((action) => action.id === this.actionId()) ?? FEE_ACTIONS[0],
  );
  protected readonly actionForm = computed(() => INTEREST_FORMS[this.action().interest]);

  private readonly value = linkedSignal<FeeAction, FeeFormValue>({
    source: this.action,
    computation: (action, previous) => startingValue(action, previous?.value),
  });
  protected readonly fields = form(this.value, (path) => {
    for (const key of Object.keys(AMOUNT_LIMITS) as AmountKey[]) {
      min(path[key], AMOUNT_LIMITS[key].min);
    }
  });

  /** The rate starts at the usual rate of the tax kind, and stays inside its limits. */
  private readonly taxKind = computed(
    () => TAX_KINDS.find((kind) => kind.id === this.value().taxKind) ?? TAX_KINDS[0],
  );
  private readonly taxRate = linkedSignal<Entered>(() => this.taxKind().defaultRate);
  protected readonly taxRateField = form(this.taxRate, (path) => {
    min(path, () => this.taxKind().min);
    max(path, () => this.taxKind().max);
  });
  protected readonly rateOutside = computed(() => {
    const { min, max } = this.taxKind();
    return this.ui().fees.rateOutside(
      formatNumber(min, this.lang()),
      formatNumber(max, this.lang()),
    );
  });

  protected readonly choices = computed(() => {
    const language = this.lang();
    return {
      actions: localizedChoices(FEE_ACTIONS, language),
      surcharges: localizedChoices(PLACE_SURCHARGES, language),
      taxKinds: localizedChoices(TAX_KINDS, language),
    };
  });

  protected readonly bill = computed(() =>
    computeBill(this.action(), { ...this.value(), taxRate: this.taxRate() }),
  );

  /** The lines of the bill with their labels, and their amounts as text. */
  protected readonly lines = computed(() => {
    const text = this.ui().fees;
    const labels: Record<BillLine['kind'], (line: BillLine) => string> = {
      fee: () => text.notarialFee,
      surcharge: () => text.additionalFee,
      vat: () => text.vatLine,
      entry: () => text.entryFeeLine,
      tax: (line) => text.localTax(formatNumber(line.rate ?? 0, this.lang())),
    };
    return this.bill().lines.map((line) => ({
      label: labels[line.kind](line),
      refs: line.ref ? [line.ref] : [],
      euro: this.money(line.euro),
      leva: line.leva === undefined ? undefined : this.money(line.leva, 'BGN'),
    }));
  });

  protected readonly whoPays = computed(() => this.markdown.renderInline(this.ui().fees.whoPays));
  protected readonly howItWorks = computed(
    () => this.markdown.render(this.ui().fees.howItWorks).html,
  );

  constructor() {
    pageTitleEffect(() => this.ui().nav.fees);
  }

  protected money(amount: number, currency: 'EUR' | 'BGN' = 'EUR'): string {
    return formatMoney(amount, currency, this.lang());
  }
}
