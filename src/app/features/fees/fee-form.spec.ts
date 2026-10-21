import { FEE_ACTIONS } from '../../core/fees/fee-actions';
import { startingValue } from './fee-form';

const action = (id: string) => FEE_ACTIONS.find((candidate) => candidate.id === id)!;

describe('startingValue', () => {
  it('starts each action with a typical case', () => {
    expect(startingValue(action('deed'))).toMatchObject({ price: 150_000, assessment: 60_000 });
    expect(startingValue(action('vehicle'))).toMatchObject({ price: 8_000, agreed: 8_000 });
    expect(startingValue(action('signatures'))).toMatchObject({ signatures: 1, price: 0 });
  });

  it('keeps the place, VAT, entry and tax choices of the previous action', () => {
    const previous = {
      ...startingValue(action('deed')),
      surcharge: 'plus50',
      vat: false,
      taxKind: 'giftOther',
    } as const;
    expect(startingValue(action('building'), previous)).toMatchObject({
      surcharge: 'plus50',
      vat: false,
      taxKind: 'giftOther',
      price: 150_000,
    });
  });

  it('uses acquisition by prescription for a circumstantial verification only', () => {
    const circumstantial = startingValue(action('circumstantial'));
    expect(circumstantial.taxKind).toBe('prescription');
    expect(startingValue(action('deed'), circumstantial).taxKind).toBe('sale');
  });
});
