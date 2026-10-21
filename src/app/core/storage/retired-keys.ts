/**
 * Keys that an older version of the app kept in localStorage and that nothing reads any more.
 * The app removes them when it starts, so the browser keeps no stale values.
 *   nc.home.role    the role filter of the chapter list on the home page (removed in October 2026)
 *   nc.checklists   the ticks of the checklists (removed in October 2026)
 */
const RETIRED_KEYS = ['nc.home.role', 'nc.checklists'] as const;

export function removeRetiredKeys(): void {
  try {
    for (const key of RETIRED_KEYS) localStorage.removeItem(key);
  } catch {
    // Storage is not available, so it holds nothing to remove.
  }
}
