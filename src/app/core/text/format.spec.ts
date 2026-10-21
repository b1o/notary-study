import { hostOf } from './format';

describe('hostOf', () => {
  it('names the site of a source without "www."', () => {
    expect(hostOf('https://www.registryagency.bg/media/tarifa.pdf')).toBe('registryagency.bg');
    expect(hostOf('https://lex.bg/laws/ldoc/2134163968')).toBe('lex.bg');
  });

  it('returns the text itself when it is not an address', () => {
    expect(hostOf('notary-chamber.bg')).toBe('notary-chamber.bg');
  });
});
