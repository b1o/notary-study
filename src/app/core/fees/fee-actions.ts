import type { Localized } from '../i18n/language';

/**
 * What the material interest of an action is, and so which fields the calculator asks for:
 *   property    the agreed price (for a gift the market value), or the tax assessment if it is
 *               higher (Art. 96(1) and (3) ЗННД)
 *   building    90% of the market value of the land (Art. 96(2) ЗННД), or the agreed price or the
 *               tax assessment of the right if it is higher (Art. 96(3) and 97(3) ЗННД)
 *   claim       the secured amount
 *   vehicle     the insured value, or the agreed price if it is higher (Art. 97 ЗННД)
 *   ownership   ownership that the notary certifies: the market value of the property, or the tax
 *               assessment if it is higher (Art. 96(1) and (3) ЗННД)
 *   price       a price or amount that the reader enters
 *   signatures  no interest: a number of signatures (item 5)
 *   copies      no interest: pages and copies (item 6)
 */
export type InterestKind =
  'property' | 'building' | 'claim' | 'vehicle' | 'ownership' | 'price' | 'signatures' | 'copies';

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
    interest: 'ownership',
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

/**
 * The kinds of acquisition for the local tax (Art. 44–49 ЗМДТ), with the limits of the rate.
 * A gratuitous acquisition (a gift, prescription) has no agreed price, so its base is the tax
 * assessment alone (Art. 46(2)(1) ЗМДТ). Prescription pays the gift tax (Art. 44(2) and (3)); with
 * no donor, the rate is that of a gift between other persons (Art. 47(1)(2)).
 */
export const TAX_KINDS = [
  {
    id: 'sale',
    gratuitous: false,
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
    gratuitous: true,
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
    gratuitous: true,
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
    gratuitous: true,
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
    gratuitous: true,
    min: 3.3,
    max: 6.6,
    defaultRate: 5,
    ref: 'zmdt:44:3',
    label: {
      en: 'Prescription: as a gift to other persons, 3.3–6.6% (Art. 44(3) and 47(1) ЗМДТ)',
      bg: 'Давност: като дарение на други лица, 3,3–6,6% (чл. 44, ал. 3 и чл. 47, ал. 1 ЗМДТ)',
    },
  },
  {
    id: 'none',
    gratuitous: false,
    min: 0,
    max: 0,
    defaultRate: 0,
    ref: '',
    label: { en: 'Do not calculate the tax', bg: 'Без данък' },
  },
] as const satisfies readonly {
  id: string;
  gratuitous: boolean;
  min: number;
  max: number;
  defaultRate: number;
  ref: string;
  label: Localized;
}[];

export type TaxKind = (typeof TAX_KINDS)[number]['id'];
