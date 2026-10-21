import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LawLibraryService } from './law-library.service';

/** The href of a citation when the app is served under `baseHref`. */
function citationUrl(baseHref: string, reference: string): string {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      provideHttpClientTesting(),
      { provide: APP_BASE_HREF, useValue: baseHref },
    ],
  });
  return TestBed.inject(LawLibraryService).url(reference);
}

describe('LawLibraryService.url', () => {
  it('gives the address of a provision, with the paragraph as a query parameter', () => {
    expect(citationUrl('/', 'znnd:25:9')).toBe('/laws/znnd/25?paragraph=9');
  });

  it('keeps the base href, so that a link opened in a new tab stays in the app', () => {
    expect(citationUrl('/notary-study/', 'znnd:25:9')).toBe(
      '/notary-study/laws/znnd/25?paragraph=9',
    );
  });
});
