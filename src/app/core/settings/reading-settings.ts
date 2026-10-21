/**
 * Reading settings. The service writes each value to a data attribute on <html>
 * (for example data-text-size="large"); src/styles/_reading.scss maps the attributes to CSS values.
 */

export const THEME_CHOICES = ['system', 'light', 'dark'] as const;
export const TEXT_SIZES = ['small', 'medium', 'large', 'larger'] as const;
export const LINE_SPACINGS = ['compact', 'normal', 'relaxed'] as const;
export const TEXT_WIDTHS = ['narrow', 'medium', 'wide'] as const;
export const READING_FONTS = ['serif', 'sans'] as const;
export const MOTION_CHOICES = ['system', 'reduce'] as const;

export type ThemeChoice = (typeof THEME_CHOICES)[number];
export type TextSize = (typeof TEXT_SIZES)[number];
export type LineSpacing = (typeof LINE_SPACINGS)[number];
export type TextWidth = (typeof TEXT_WIDTHS)[number];
export type ReadingFont = (typeof READING_FONTS)[number];
export type MotionChoice = (typeof MOTION_CHOICES)[number];

export interface ReadingSettings {
  theme: ThemeChoice;
  textSize: TextSize;
  lineSpacing: LineSpacing;
  textWidth: TextWidth;
  readingFont: ReadingFont;
  motion: MotionChoice;
}

export const DEFAULT_READING_SETTINGS: Readonly<ReadingSettings> = {
  theme: 'system',
  textSize: 'medium',
  lineSpacing: 'normal',
  textWidth: 'medium',
  readingFont: 'serif',
  motion: 'system',
};

/** The options of each setting, in display order. */
export const READING_OPTIONS = {
  theme: THEME_CHOICES,
  textSize: TEXT_SIZES,
  lineSpacing: LINE_SPACINGS,
  textWidth: TEXT_WIDTHS,
  readingFont: READING_FONTS,
  motion: MOTION_CHOICES,
} as const satisfies { readonly [K in keyof ReadingSettings]: readonly ReadingSettings[K][] };
