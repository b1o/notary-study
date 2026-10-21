import type { Localized } from '../i18n/language';

/**
 * What the material interest of an action is, and so which fields the calculator asks for:
 *   property    the higher of the agreed price and the tax assessment (Art. 96(3) ЗННД)
 *   building    90% of that, for the land of a building right (Art. 96(2) ЗННД)
 *   claim       the secured amount
 *   vehicle     the insured value, or the agreed price if it is higher (Art. 97 ЗННД)
 *   assessment  the market value of the property
 *   price       a price or amount that the reader enters
 *   signatures  no interest: a number of signatures (item 5)
 *   copies      no interest: pages and copies (item 6)
 */
export type InterestKind =
  'property' | 'building' | 'claim' | 'vehicle' | 'assessment' | 'price' | 'signatures' | 'copies';

export type TariffItem = '5' | '6' | '8' | '9' | '10' | '11' | '12';

export interface FeeAction {
  readonly id: string;
  readonly label: Localized;
  readonly item: TariffItem;
  readonly interest: InterestKind;
  /** The act is entered in the property register, so the entry fee applies. */
  readonly entry: boolean;
  /** The local tax on acquisition applies. */
  readonly localTax: boolean;
}

export const FEE_ACTIONS: readonly FeeAction[] = [
  {
    id: 'deed',
    item: '8',
    interest: 'property',
    entry: true,
    localTax: true,
    label: {
      en: 'Notarial deed: sale, gift or exchange of real estate',
      bg: 'Нотариален акт: продажба, дарение или замяна на имот',
    },
  },
  {
    id: 'mortgage',
    item: '8',
    interest: 'claim',
    entry: true,
    localTax: false,
    label: {
      en: 'Notarial deed for a contractual mortgage',
      bg: 'Нотариален акт за договорна ипотека',
    },
  },
  {
    id: 'building',
    item: '8',
    interest: 'building',
    entry: true,
    localTax: true,
    label: {
      en: 'Notarial deed for a building right',
      bg: 'Нотариален акт за учредяване на право на строеж',
    },
  },
  {
    id: 'contract30',
    item: '10',
    interest: 'price',
    entry: false,
    localTax: false,
    label: {
      en: 'Certification of signatures on a contract with a material interest (for example a preliminary contract)',
      bg: 'Заверка на подписи по договор с материален интерес (например предварителен договор)',
    },
  },
  {
    id: 'contract50',
    item: '9',
    interest: 'price',
    entry: true,
    localTax: false,
    label: {
      en: 'Certification of signatures on a contract that is entered in a register, or of content with a material interest',
      bg: 'Заверка на подписи по договор, който се вписва, или на съдържание с материален интерес',
    },
  },
  {
    id: 'vehicle',
    item: '11',
    interest: 'vehicle',
    entry: false,
    localTax: true,
    label: {
      en: 'Sale of a motor vehicle (signatures)',
      bg: 'Продажба на моторно превозно средство (подписи)',
    },
  },
  {
    id: 'circumstantial',
    item: '11',
    interest: 'assessment',
    entry: true,
    localTax: true,
    label: {
      en: 'Circumstantial verification (ownership by prescription)',
      bg: 'Обстоятелствена проверка (собственост по давност)',
    },
  },
  {
    id: 'will',
    item: '9',
    interest: 'price',
    entry: false,
    localTax: false,
    label: { en: 'Notarial will', bg: 'Нотариално завещание' },
  },
  {
    id: 'onesided',
    item: '12',
    interest: 'price',
    entry: false,
    localTax: false,
    label: {
      en: 'One-sided statement with a material interest (receipt, consent to delete a mortgage)',
      bg: 'Едностранно изявление с материален интерес (разписка, съгласие за заличаване на ипотека)',
    },
  },
  {
    id: 'signatures',
    item: '5',
    interest: 'signatures',
    entry: false,
    localTax: false,
    label: {
      en: 'Certification of signatures without a material interest (power of attorney, declaration)',
      bg: 'Заверка на подписи без материален интерес (пълномощно, декларация)',
    },
  },
  {
    id: 'copies',
    item: '6',
    interest: 'copies',
    entry: false,
    localTax: false,
    label: { en: 'Certification of copies', bg: 'Заверка на преписи' },
  },
];

/** The additional fee for work outside the office or out of hours (item 23 of the tariff). */
export const PLACE_SURCHARGES = [
  {
    id: 'office',
    rate: 0,
    label: { en: 'In the office, in working hours', bg: 'В кантората, в работно време' },
  },
  {
    id: 'plus25',
    rate: 0.25,
    label: {
      en: 'Outside the office in working hours, or in the office out of hours (+25%)',
      bg: 'Извън кантората в работно време или в кантората в неработно време (+25%)',
    },
  },
  {
    id: 'plus50',
    rate: 0.5,
    label: {
      en: 'Outside the office out of hours, or outside the town (+50%)',
      bg: 'Извън кантората в неработно време или извън населеното място (+50%)',
    },
  },
  {
    id: 'double',
    rate: 1,
    label: {
      en: 'Outside the office, out of hours and outside the town (double)',
      bg: 'Извън кантората, в неработно време и извън населеното място (двоен размер)',
    },
  },
] as const satisfies readonly { id: string; rate: number; label: Localized }[];

export type PlaceSurcharge = (typeof PLACE_SURCHARGES)[number]['id'];

/** The kinds of acquisition for the local tax (Art. 44–49 ЗМДТ), with the limits of the rate. */
export const TAX_KINDS = [
  {
    id: 'sale',
    min: 0.1,
    max: 3,
    defaultRate: 3,
    ref: 'zmdt:47:2',
    label: {
      en: 'Purchase or exchange: 0.1–3% set by the municipal council',
      bg: 'Покупка или замяна: 0,1–3% по решение на общинския съвет',
    },
  },
  {
    id: 'giftFree',
    min: 0,
    max: 0,
    defaultRate: 0,
    ref: 'zmdt:47:1',
    label: {
      en: 'Gift between relatives in the direct line or spouses: exempt',
      bg: 'Дарение между роднини по права линия или съпрузи: освободено',
    },
  },
  {
    id: 'giftSiblings',
    min: 0.4,
    max: 0.8,
    defaultRate: 0.6,
    ref: 'zmdt:47:1',
    label: {
      en: 'Gift between siblings and their children: 0.4–0.8%',
      bg: 'Дарение между братя и сестри и техните деца: 0,4–0,8%',
    },
  },
  {
    id: 'giftOther',
    min: 3.3,
    max: 6.6,
    defaultRate: 5,
    ref: 'zmdt:47:1',
    label: {
      en: 'Gift to other persons: 3.3–6.6%',
      bg: 'Дарение на други лица: 3,3–6,6%',
    },
  },
  {
    id: 'prescription',
    min: 0,
    max: 6.6,
    defaultRate: 3,
    ref: 'zmdt:44:3',
    label: {
      en: 'Prescription: the rate in the ordinance of the municipality (Art. 44(3) ЗМДТ)',
      bg: 'Давност: ставката по наредбата на общината (чл. 44, ал. 3 ЗМДТ)',
    },
  },
  {
    id: 'none',
    min: 0,
    max: 0,
    defaultRate: 0,
    ref: '',
    label: { en: 'Do not calculate the tax', bg: 'Без данък' },
  },
] as const satisfies readonly {
  id: string;
  min: number;
  max: number;
  defaultRate: number;
  ref: string;
  label: Localized;
}[];

export type TaxKind = (typeof TAX_KINDS)[number]['id'];
