import { plainMarkdown } from './plain-markdown';

describe('plainMarkdown', () => {
  const label = (ref: string) => `[${ref}]`;

  it('gives citations their label, or their own text', () => {
    expect(plainMarkdown('See [[znnd:25:9]] and [[gpk:578|the rule]].', label)).toBe(
      'See [znnd:25:9] and the rule.',
    );
  });

  it('keeps the text of terms and links and removes marks', () => {
    expect(
      plainMarkdown('> [!tip] **Bold** {{акт}} and [a link](https://example.org) `code`', label),
    ).toBe('Bold акт and a link code');
  });

  it('removes table rules', () => {
    expect(plainMarkdown('| A | B |\n|---|---|\n| 1 | 2 |', label)).toBe('A B 1 2');
  });
});
