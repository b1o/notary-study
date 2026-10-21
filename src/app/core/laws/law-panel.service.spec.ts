import { TestBed } from '@angular/core/testing';

import { parseReference } from './citation';
import { clampWidth, LAW_PANEL_WIDTH, LawPanelService } from './law-panel.service';

describe('LawPanelService', () => {
  let panel: LawPanelService;

  beforeEach(() => {
    localStorage.clear();
    panel = TestBed.inject(LawPanelService);
  });

  it('starts closed', () => {
    expect(panel.isOpen()).toBe(false);
  });

  it('keeps a history like a browser', () => {
    panel.open(parseReference('znnd:25'));
    panel.open(parseReference('znnd:26'));
    panel.back();
    expect(panel.current()?.article).toBe('25');
    expect(panel.canGoForward()).toBe(true);

    panel.open(parseReference('gpk:578'));
    expect(panel.canGoForward()).toBe(false);
    panel.back();
    expect(panel.current()?.article).toBe('25');
  });

  it('ignores the provision that it already shows', () => {
    panel.open(parseReference('znnd:25:9'));
    panel.open(parseReference('znnd:25:9'));
    expect(panel.canGoBack()).toBe(false);
  });

  it('forgets the history when it closes', () => {
    panel.open(parseReference('znnd:25'));
    panel.close();
    expect(panel.isOpen()).toBe(false);
    expect(panel.canGoBack()).toBe(false);
  });

  it('keeps the width inside the limits', () => {
    panel.resize(10_000);
    expect(panel.width()).toBe(LAW_PANEL_WIDTH.max);
    expect(clampWidth(0)).toBe(LAW_PANEL_WIDTH.min);
  });

  it('saves the width in the browser', () => {
    panel.resize(600);
    TestBed.tick();
    expect(localStorage.getItem('nc.lawPanel.width')).toBe('600');
  });
});
