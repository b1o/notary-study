import { effect, signal, type WritableSignal } from '@angular/core';

/** Turns a stored value (unknown JSON) into a valid value, or returns the fallback. */
export type Restore<T> = (stored: unknown, fallback: T) => T;

/**
 * A signal whose value is kept in the browser's localStorage under `key`.
 * Call it in an injection context (for example in a service field), because it creates an effect.
 * When storage is not available (private mode, blocked site data), the value lives in memory only.
 */
export function storedSignal<T>(key: string, fallback: T, restore: Restore<T>): WritableSignal<T> {
  const value = signal(readStored(key, fallback, restore));
  effect(() => writeStored(key, value()));
  return value;
}

function readStored<T>(key: string, fallback: T, restore: Restore<T>): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : restore(JSON.parse(raw), fallback);
  } catch {
    return fallback;
  }
}

function writeStored(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage is not available. The value stays in memory for this session.
  }
}

/** Restore for a value that must be one of a fixed list of options. */
export function oneOf<T extends string>(options: readonly T[]): Restore<T> {
  return (stored, fallback) => (options.includes(stored as T) ? (stored as T) : fallback);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
