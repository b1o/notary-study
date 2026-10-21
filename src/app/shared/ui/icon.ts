import { Component, computed, input } from '@angular/core';

/** Stroke icons on a 24×24 grid. Add a path here to add an icon. */
const ICONS = {
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M18 6 6 18',
  settings: 'M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4',
  chevronLeft: 'M15 6l-6 6 6 6',
  chevronRight: 'M9 6l6 6-6 6',
  chevronDown: 'M6 9l6 6 6-6',
  arrowLeft: 'M19 12H5M11 6l-6 6 6 6',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  open: 'M14 4h6v6M20 4l-8.5 8.5M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  home: 'M4 10.5 12 4l8 6.5V20H4ZM10 20v-5h4v5',
  law: 'M12 4v16M8 20h8M5 7h14M7 7l-3 6.5h6ZM17 7l-3 6.5h6Z',
  test: 'M9 4h6v3H9ZM7 5.5H6a1 1 0 0 0-1 1V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6.5a1 1 0 0 0-1-1h-1M9 14l2 2 4-4.5',
  cards:
    'M8 4h10a2 2 0 0 1 2 2v10M5 8h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z',
  glossary: 'M5 19V5a2 2 0 0 1 2-2h12v18H7a2 2 0 0 1-2-2ZM9.5 13l2.5-6 2.5 6M10.3 11h3.4',
  template:
    'M14 3H6.5a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V7.5ZM14 3v4.5h4.5M9 12h6M9 16h6',
  checklist: 'M10 6h10M10 12h10M10 18h10M4 6l1.2 1.2L7.5 5M4 12l1.2 1.2L7.5 11M4 18l1.2 1.2L7.5 17',
  calculator:
    'M6.5 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM8.5 7h7M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  copy: 'M9 9h10v10H9ZM5 15V5h10',
  print:
    'M7 9V4h10v5M7 17H5a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2M7 14h10v6H7Z',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18ZM12 7.5V12l3 2',
} as const;

export type IconName = keyof typeof ICONS;

/** An inline SVG icon. It is decorative: put the accessible name on the button or link around it. */
@Component({
  selector: 'nc-icon',
  template: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path [attr.d]="path()" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      inline-size: var(--icon-size, 1.25rem);
      block-size: var(--icon-size, 1.25rem);
      flex: none;
    }
    svg {
      inline-size: 100%;
      block-size: 100%;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  protected readonly path = computed(() => ICONS[this.name()]);
}
