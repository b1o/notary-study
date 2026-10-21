import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';
import { parseReference } from './core/laws/citation';
import { LawPanelService } from './core/laws/law-panel.service';

/** Answer every open request: an empty course and library, and 404 for anything else. */
function respondToRequests(): void {
  for (const request of TestBed.inject(HttpTestingController).match(() => true)) {
    const url = request.request.url;
    if (url.endsWith('manifest.json')) request.flush({ parts: [], chapters: [] });
    else if (url.endsWith('catalog.json')) request.flush([]);
    else request.flush(null, { status: 404, statusText: 'Not Found' });
  }
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideHttpClientTesting()],
    });
  });

  async function render() {
    const fixture = TestBed.createComponent(App);
    TestBed.tick();
    respondToRequests();
    await fixture.whenStable();
    return fixture;
  }

  it('shows the navigation and the page area', async () => {
    const element: HTMLElement = (await render()).nativeElement;

    expect(element.querySelector('nc-side-nav nav')).toBeTruthy();
    expect(element.querySelector('main#main')).toBeTruthy();
  });

  it('shows the law panel only while it holds a provision', async () => {
    const fixture = await render();
    expect(fixture.nativeElement.querySelector('nc-law-panel')).toBeNull();

    TestBed.inject(LawPanelService).open(parseReference('znnd:25'));
    TestBed.tick();
    respondToRequests();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('nc-law-panel')).toBeTruthy();
  });
});
